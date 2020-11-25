import { commonReplacement, partialCommonReplacementKeys } from '../../ui/raidboss/common_replacement.js';

import Regexes from '../../resources/regexes.js';
import { Timeline } from '../../ui/raidboss/timeline.js';
import fs from 'fs';
import path from 'path';

let exitCode = 0;

const errorFunc = (str) => {
  console.error(str);
  exitCode = 1;
};

// Global setup.
const timelineFile = process.argv[2];
const triggersFile = process.argv[3];
const timelineText = String(fs.readFileSync(timelineFile));
const importPath = '../../' + path.relative(process.cwd(), triggersFile).replace(/\\/g, '/');
let triggerSet;
let timeline;

function getTestCases(trans, skipPartialCommon) {
  const testCases = [
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
  for (const testCase of testCases) {
    const common = commonReplacement[testCase.type];
    for (const key in common) {
      if (skipPartialCommon && partialCommonReplacementKeys.includes(key))
        continue;
      if (!common[key][trans.locale]) {
        // To avoid throwing a "missing translation" error for
        // every single common translation, automatically add noops.
        testCase.replace[key] = key;
        continue;
      }
      if (key in testCase.replace)
        errorFunc(`${triggersFile}:locale ${trans.locale}:common replacement '${key}' found in ${testCase.type}`);
      testCase.replace[key] = common[key][trans.locale];
    }
  }

  return testCases;
}

function getTestCasesWithoutPartialCommon(trans) {
  return getTestCases(trans, true);
}

const tests = {
  // This test loads an individual raidboss timeline and makes sure
  // that timeline.js can parse it without errors.
  timelineErrorTest: () => {
    for (const e of timeline.errors) {
      if (e.line && e.lineNumber)
        errorFunc(timelineFile + ':' + e.lineNumber + ': ' + e.error + ': ' + e.line);
      else
        errorFunc(timelineFile + ':' + e.error);
    }
  },

  translationConflictTest: () => {
    const translations = triggerSet.timelineReplace;
    if (!translations)
      return;

    for (const trans of translations) {
      const locale = trans.locale;
      if (!locale) {
        // TODO: maybe this needs to be in the triggers test instead
        errorFunc(triggersFile + ': missing locale in translation block');
        continue;
      }

      // Note: even if translations are missing, they should not have conflicts.
      const testCases = getTestCases(trans);

      // For both texts and syncs...
      for (const testCase of testCases) {
        // For every unique replaceable text or sync the timeline knows about...
        for (const orig of testCase.items) {
          // For every translation for that timeline...
          for (const regex in testCase.replace) {
            const replaced = orig.replace(Regexes.parse(regex), testCase.replace[regex]);
            if (orig === replaced)
              continue;

            // If we get here, then |regex| is a valid replacemnt in |orig|.
            // The goal is to ensure via testing that there are no ordering
            // constraints in the timeline translations.  To fix these issues,
            // add negative lookahead/lookbehind assertions to make the regexes unique.

            // (1) Verify that there is no pre-replacement collision,.
            // i.e. two regexes that apply to the same text or sync.
            // e.g. "Holy IV" is affected by both /Holy IV/ and /Holy/.
            for (const otherRegex in testCase.replace) {
              if (regex === otherRegex)
                continue;
              const otherReplaced =
                  orig.replace(Regexes.parse(otherRegex), testCase.replace[otherRegex]);
              if (orig === otherReplaced)
                continue;

              // If we get here, then there is a pre-replacement collision.
              // Verify if these two regexes can be applied in either order
              // to get the same result, if so, then this collision can be
              // safely ignored.
              // e.g. "Magnetism/Repel" is affected by both /Magnetism/ and /Repel/,
              // however these are independent and could be applied in either order.

              const otherFirst = otherReplaced.replace(
                  Regexes.parse(regex),
                  testCase.replace[regex],
              );
              const otherSecond = replaced.replace(Regexes.parse(otherRegex),
                  testCase.replace[otherRegex]);
              if (otherFirst === otherSecond)
                continue;

              errorFunc(`${triggersFile}:locale ${locale}: pre-translation collision on ${testCase.type} '${orig}' for '${regex}' and '${otherRegex}'`);
            }

            // (2) Verify that there is no post-replacement collision with this text,
            // i.e. a regex that applies to the replaced text that another regex
            // has already modified.
            for (const otherRegex in testCase.replace) {
              if (regex === otherRegex)
                continue;
              const otherSecond =
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
    const translations = triggerSet.timelineReplace;
    if (!translations)
      return;

    for (const trans of translations) {
      const locale = trans.locale;
      if (!locale)
        continue;

      if (trans.missingTranslations)
        continue;

      // Ignore partial common translations here, as they don't
      // count towards completing missing translations.
      const testCases = getTestCasesWithoutPartialCommon(trans);

      const ignore = timeline.GetMissingTranslationsToIgnore();
      const isIgnored = (x) => {
        for (const ig of ignore) {
          if (ig.test(x))
            return true;
        }
        return false;
      };

      for (const testCase of testCases) {
        for (const item of testCase.items) {
          if (isIgnored(item))
            continue;
          let matched = false;
          for (const regex in testCase.replace) {
            if (Regexes.parse(regex).test(item)) {
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
    const translations = triggerSet.timelineReplace;
    if (!translations)
      return;

    for (const trans of translations) {
      const locale = trans.locale;
      if (!locale)
        continue;

      const testCases = getTestCases(trans);

      // Text should not include ^ or $, unless preceeded by \ or [
      const badRegex = [
        /(?<![\\[])[\^\$]/,
      ].map((x) => Regexes.parse(x));

      for (const testCase of testCases) {
        for (const regex in testCase.replace) {
          for (const bad of badRegex) {
            if (Regexes.parse(regex).source.match(bad))
              errorFunc(`${triggersFile}:locale ${locale}:invalid character in ${testCase.type} '${regex}'`);
          }
        }
      }
    }
  },
  sealedSyncTest: () => {
    for (const sync of timeline.syncStarts) {
      const regex = sync.regex.source;
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

async function doTests() {
  triggerSet = (await import(importPath)).default;
  timeline = new Timeline(timelineText, null, triggerSet.timelineTriggers);

  for (const name in tests)
    tests[name]();

  process.exit(exitCode);
}

doTests();


