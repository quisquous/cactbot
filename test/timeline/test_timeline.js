'use strict';

let fs = require('fs');
let assert = require('chai').assert;
let Regexes = require('../../resources/regexes.js');
let Conditions = require('../../resources/conditions.js');
let responseExports = require('../../resources/responses.js');
let Responses = responseExports.responses;
let Timeline = require('../../ui/raidboss/timeline.js');
let commonReplacementExports = require('../../ui/raidboss/common_replacement.js');
let commonReplacement = commonReplacementExports.commonReplacement;
let partialCommonReplacementKeys = commonReplacementExports.partialCommonReplacementKeys;

let exitCode = 0;

let errorFunc = (str) => {
  console.error(str);
  exitCode = 1;
};

// Global setup.
let timelineFile = process.argv[2];
let triggersFile = process.argv[3];
let timelineText = String(fs.readFileSync(timelineFile));
let timeline = new Timeline(timelineText);
let triggerSet = eval(String(fs.readFileSync(triggersFile)));

if (triggerSet.length != 1) {
  console.log(triggerSet.length);
  errorFunc(triggersFile + ':Break out multiple trigger sets into multiple files');
}
let triggers = triggerSet[0];

function getTestCases(trans, skipPartialCommon) {
  let testCases = [
    {
      type: 'replaceSync',
      items: new Set(timeline.syncStarts.map((x) => x.regex.source)),
      replace: Object.assign({}, trans.replaceSync),
    },
    {
      type: 'replaceText',
      items: new Set(timeline.events.map((x) => x.text)),
      replace: Object.assign({}, trans.replaceText),
    },
  ];

  // Add all common replacements, so they can be checked for collisions as well.
  // As of now they apply to both replaceSync and replaceText, so add them to both.
  for (let testCase of testCases) {
    for (let key in commonReplacement) {
      if (skipPartialCommon && partialCommonReplacementKeys.includes(key))
        continue;
      if (!commonReplacement[key][trans.locale]) {
        // To avoid throwing a "missing translation" error for
        // every single common translation, automatically add noops.
        testCase.replace[key] = key;
        continue;
      }
      if (key in testCase.replace)
        errorFunc(`${triggersFile}:locale ${trans.locale}:common replacement '${key}' found in ${testCase.type}`);
      testCase.replace[key] = commonReplacement[key][trans.locale];
    }
  }

  return testCases;
}

function getTestCasesWithoutPartialCommon(trans) {
  return getTestCases(trans, true);
}

let tests = {
  // This test loads an individual raidboss timeline and makes sure
  // that timeline.js can parse it without errors.
  timelineErrorTest: () => {
    for (let e of timeline.errors)
      errorFunc(timelineFile + ':' + e.lineNumber + ': ' + e.error + ': ' + e.line);
  },

  translationConflictTest: () => {
    let translations = triggers.timelineReplace;
    if (!translations)
      return;

    for (let trans of translations) {
      let locale = trans.locale;
      if (!locale) {
        // TODO: maybe this needs to be in the triggers test instead
        errorFunc(triggersFile + ': missing locale in translation block');
        continue;
      }

      // Note: even if translations are missing, they should not have conflicts.
      let testCases = getTestCases(trans);

      // For both texts and syncs...
      for (let testCase of testCases) {
        // For every unique replaceable text or sync the timeline knows about...
        for (let orig of testCase.items) {
          // For every translation for that timeline...
          for (let regex in testCase.replace) {
            let replaced = orig.replace(Regexes.parse(regex), testCase.replace[regex]);
            if (orig === replaced)
              continue;

            // If we get here, then |regex| is a valid replacemnt in |orig|.
            // The goal is to ensure via testing that there are no ordering
            // constraints in the timeline translations.  To fix these issues,
            // add negative lookahead/lookbehind assertions to make the regexes unique.

            // (1) Verify that there is no pre-replacement collision,.
            // i.e. two regexes that apply to the same text or sync.
            // e.g. "Holy IV" is affected by both /Holy IV/ and /Holy/.
            for (let otherRegex in testCase.replace) {
              if (regex === otherRegex)
                continue;
              let otherReplaced =
                  orig.replace(Regexes.parse(otherRegex), testCase.replace[otherRegex]);
              if (orig === otherReplaced)
                continue;

              // If we get here, then there is a pre-replacement collision.
              // Verify if these two regexes can be applied in either order
              // to get the same result, if so, then this collision can be
              // safely ignored.
              // e.g. "Magnetism/Repel" is affected by both /Magnetism/ and /Repel/,
              // however these are independent and could be applied in either order.

              let otherFirst = otherReplaced.replace(Regexes.parse(regex), testCase.replace[regex]);
              let otherSecond = replaced.replace(Regexes.parse(otherRegex),
                  testCase.replace[otherRegex]);
              if (otherFirst === otherSecond)
                continue;

              errorFunc(`${triggersFile}:locale ${locale}: pre-translation collision on ${testCase.type} '${orig}' for '${regex}' and '${otherRegex}'`);
            }

            // (2) Verify that there is no post-replacement collision with this text,
            // i.e. a regex that applies to the replaced text that another regex
            // has already modified.
            for (let otherRegex in testCase.replace) {
              if (regex === otherRegex)
                continue;
              let otherSecond =
                  replaced.replace(Regexes.parse(otherRegex), testCase.replace[otherRegex]);
              if (replaced === otherSecond)
                continue;

              // If we get here, then there is a post-replacement collision.
              // Verify if these two regexes can be applied in either order
              // to get the same result, if so, then this collision can be
              // safely ignored.
              let otherFirst = orig.replace(Regexes.parse(otherRegex),
                  testCase.replace[otherRegex]);
              otherFirst = otherFirst.replace(Regexes.parse(regex), testCase.replace[regex]);
              if (otherFirst === otherSecond)
                continue;

              errorFunc(`${triggersFile}:locale ${locale}: post-translation collision on ${testCase.type} '${orig}' for '${regex}' => '${testCase.replace[regex]}', then '${otherRegex}'`);
            }
          }
        }
      }
    }
  },
  missingTranslationTest: () => {
    let translations = triggers.timelineReplace;
    if (!translations)
      return;

    for (let trans of translations) {
      let locale = trans.locale;
      if (!locale)
        continue;

      if (trans.missingTranslations)
        continue;

      // Ignore partial common translations here, as they don't
      // count towards completing missing translations.
      let testCases = getTestCasesWithoutPartialCommon(trans);

      let ignore = timeline.GetMissingTranslationsToIgnore();
      let isIgnored = (x) => {
        for (let ig of ignore) {
          if (x.match(ig))
            return true;
        }
        return false;
      };

      for (let testCase of testCases) {
        for (let item of testCase.items) {
          if (isIgnored(item))
            continue;
          let matched = false;
          for (let regex in testCase.replace) {
            if (item.match(Regexes.parse(regex))) {
              matched = true;
              break;
            }
          }
          if (!matched)
            errorFunc(`${triggersFile}:locale ${locale}:no translation for ${testCase.type} '${item}'`);
        }
      }
    }
  },
  badCharacters: () => {
    let translations = triggers.timelineReplace;
    if (!translations)
      return;

    for (let trans of translations) {
      let locale = trans.locale;
      if (!locale)
        continue;

      let testCases = getTestCases(trans);

      // Text should not include ^ or $, unless preceeded by \ or [
      let badRegex = [
        /(?<![\\[])[\^\$]/,
      ].map((x) => Regexes.parse(x));

      for (let testCase of testCases) {
        for (let regex in testCase.replace) {
          for (let bad of badRegex) {
            if (Regexes.parse(regex).source.match(bad))
              errorFunc(`${triggersFile}:locale ${locale}:invalid character in ${testCase.type} '${regex}'`);
          }
        }
      }
    }
  },
  sealedSyncTest: () => {
    for (let sync of timeline.syncStarts) {
      let regex = sync.regex.source;
      if (regex.includes('is no longer sealed')) {
        if (!regex.includes('00:0839:.*is no longer sealed'))
          errorFunc(`${timelineFile}:${sync.lineNumber} 'is no longer sealed' sync must be exactly '00:0839:.*is no longer sealed'`);
      } else if (regex.includes('will be sealed')) {
        if (!regex.match('00:0839:.*will be sealed'))
          errorFunc(`${timelineFile}:${sync.lineNumber} 'will be sealed' sync must be preceded by '00:0839:'`);
      }
    }
  },
};

for (let name in tests)
  tests[name]();


process.exit(exitCode);
