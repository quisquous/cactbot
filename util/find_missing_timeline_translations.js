'use strict';

let triggersFile = process.argv[2];
let locale = process.argv[3];
let localeReg = 'regex' + locale[0].toUpperCase() + locale[1];

let fs = require('fs');
let Regexes = require('../resources/regexes.js');
let Conditions = require('../resources/conditions.js');
let responseModule = require('../resources/responses.js');
let Responses = responseModule.responses;
let Timeline = require('../ui/raidboss/timeline.js');
let commonReplacementExports = require('../ui/raidboss/common_replacement.js');
let commonReplacement = commonReplacementExports.commonReplacement;
let partialCommonReplacementKeys = commonReplacementExports.partialCommonReplacementKeys;

// Hackily assume that any file with a txt file of the same name is a trigger/timeline.
let timelineFile = triggersFile.replace(/\.js$/, '.txt');
if (!fs.existsSync(timelineFile))
  process.exit(-1);

let timelineText = String(fs.readFileSync(timelineFile));
let timeline = new Timeline(timelineText);
let triggerText = String(fs.readFileSync(triggersFile));
let triggerLines = triggerText.split('\n');
let triggerSetList = eval(triggerText);
let triggerSet = triggerSetList[0];
if (!triggerSet)
  process.exit(-1);
let triggers = triggerSet.triggers;

let translations = triggerSet.timelineReplace;
if (!translations)
  process.exit(-1);

let kEffectNames = '~effectNames';
let trans = {
  replaceSync: {},
  replaceText: {},
};
trans[kEffectNames] = {};

for (let transBlock of translations) {
  if (!transBlock.locale || transBlock.locale !== locale)
    continue;
  trans = transBlock;
  break;
}

// An extremely hacky helper to turn a trigger id back into a line number.
function findLineNumberByTriggerId(text, id) {
  // Apostrophes need to be double escaped here, once for the Regexes.parse
  // and the second time for the the backslash itself, to turn /'/ into /\\'/
  let escapedId = id.replace(/'/, '\\\\\'');
  // Other regex characters just need to be escaped once to get out of
  // Regexes.parse unscathed.
  escapedId = escapedId.replace(/([+^$*])/, '\\$1');
  let regex = Regexes.parse('^\\s*id: \'' + escapedId + '\',');

  let lineNumber = 0;
  for (let line of text) {
    lineNumber++;

    if (line.match(regex))
      return lineNumber;
  }

  // This should never happen.
  console.log('Failure to find id in file for: ' + id);
  return '?';
}

function findMissingRegex() {
  for (let trigger of triggers) {
    let origRegex = trigger.regex;
    if (!origRegex)
      continue;

    let lineNumber = findLineNumberByTriggerId(triggerLines, trigger.id);

    origRegex = origRegex.source.toLowerCase();

    let foundMatch = false;

    let transRegex = origRegex;
    for (let set of [trans.replaceSync, trans[kEffectNames]]) {
      for (let regex in set) {
        let replace = Regexes.parse(regex);
        if (transRegex.match(replace))
          foundMatch = true;
        transRegex = transRegex.replace(replace, set[regex]);
      }
    }

    transRegex = transRegex.toLowerCase();

    let locRegex = trigger[localeReg];
    if (locRegex) {
      // Things are in a good state if the translation regex matches the
      // locale regex.
      locRegex = locRegex.source.toLowerCase();
      if (transRegex === locRegex)
        continue;

      // If we have a match, then something translated it *AND* it is
      // different than what is there.  This is the worst case scenario.
      if (foundMatch)
        console.log(`${triggersFile}:${lineNumber} ${trigger.id}: incorrect timelineReplace for regex, got '${transRegex}', needed ${localeReg} '${locRegex}'`);
    }
    // Things *might* be in a good state if we have any translation for this.
    if (foundMatch)
      continue;

    // Any missing translations in the ignore list should be skipped.
    let ignore = timeline.GetMissingTranslationsToIgnore();
    let foundIgnore = false;
    for (let ig of ignore) {
      if (origRegex.match(ig)) {
        foundIgnore = true;
        break;
      }
    }
    if (foundIgnore)
      continue;

    // In any case, if we have no match for this, then this is missing.
    if (locRegex)
      console.log(`${triggersFile}:${lineNumber} ${trigger.id}: missing timelineReplace for regex '${origRegex}' (but have ${localeReg})`);
    else
      console.log(`${triggersFile}:${lineNumber} ${trigger.id}: missing timelineReplace for regex '${origRegex}'`);
  }
}

function findMissingTimeline() {
  // TODO: merge this with test_timeline.js??
  let testCases = [
    {
      type: 'replaceSync',
      items: new Set(timeline.syncStarts.map((x) =>
        ({ text: x.regex.source, line: x.lineNumber }))),
      replace: trans.replaceSync,
      label: 'sync',
    },
    {
      type: 'replaceText',
      items: new Set(timeline.events.map((x) => ({ text: x.text, line: x.lineNumber }))),
      replace: trans.replaceText,
      label: 'text',
    },
  ];

  const skipPartialCommon = true;

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
      // This shouldn't happen.
      if (key in testCase.replace)
        continue;
      testCase.replace[key] = commonReplacement[key][trans.locale];
    }
  }

  let ignore = timeline.GetMissingTranslationsToIgnore();
  let isIgnored = (x) => {
    for (let ig of ignore) {
      if (x.match(ig))
        return true;
    }
    return false;
  };

  let output = {};

  for (let testCase of testCases) {
    for (let item of testCase.items) {
      if (isIgnored(item.text))
        continue;
      let matched = false;
      for (let regex in testCase.replace) {
        if (item.text.match(Regexes.parse(regex))) {
          matched = true;
          break;
        }
      }
      if (!matched) {
        // Because we handle syncs separately from texts, in order to
        // sort them all properly together, create a key to be used with sort().
        let sortKey = String(item.line).padStart(8, '0') + testCase.label;
        let value = `${timelineFile}:${item.line} ${testCase.label} "${item.text}"`;
        output[sortKey] = value;
      }
    }
  }

  let keys = Object.keys(output).sort();
  for (let key of keys)
    console.log(output[key]);
}

findMissingRegex();
findMissingTimeline();
