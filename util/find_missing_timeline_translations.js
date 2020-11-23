let triggersFile = process.argv[2];
let locale = process.argv[3];
let localeReg = 'regex' + locale[0].toUpperCase() + locale[1];

import fs from 'fs';
import path from 'path';
import Regexes from '../resources/regexes.js';
import { Timeline } from '../ui/raidboss/timeline.js';
import { commonReplacement, partialCommonReplacementKeys } from '../ui/raidboss/common_replacement.js';

// Hackily assume that any file with a txt file of the same name is a trigger/timeline.
let timelineFile = triggersFile.replace(/\.js$/, '.txt');
if (!fs.existsSync(timelineFile))
  process.exit(-1);

let timelineText = String(fs.readFileSync(timelineFile));
let timeline = new Timeline(timelineText);

const importPath = '../' + path.relative(process.cwd(), triggersFile).replace(/\\/g, '/');
let triggerSet;
let triggers;
let translations;
let trans;

let triggerText = String(fs.readFileSync(triggersFile));
let triggerLines = triggerText.split('\n');

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

    if (regex.test(line))
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
    for (let regex in trans.replaceSync) {
      let replace = Regexes.parseGlobal(regex);
      if (transRegex.match(replace))
        foundMatch = true;
      transRegex = transRegex.replace(replace, trans.replaceSync[regex]);
    }
    for (let regex in commonReplacement.replaceSync) {
      let replace = Regexes.parseGlobal(regex);
      if (transRegex.match(replace))
        foundMatch = true;
      transRegex = transRegex.replace(replace, commonReplacement.replaceSync[regex][locale]);
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
  // Don't bother translating timelines that are old.
  if (triggerSet.timelineNeedsFixing)
    return;

  // TODO: merge this with test_timeline.js??
  let testCases = [
    {
      type: 'replaceSync',
      items: new Set(timeline.syncStarts.map((x) =>
        ({ text: x.regex.source, line: x.lineNumber }))),
      replace: trans.replaceSync || {},
      label: 'sync',
    },
    {
      type: 'replaceText',
      items: new Set(timeline.events.map((x) => ({ text: x.text, line: x.lineNumber }))),
      replace: trans.replaceText || {},
      label: 'text',
    },
  ];

  const skipPartialCommon = true;

  // Add all common replacements, so they can be checked for collisions as well.
  for (let testCase of testCases) {
    let common = commonReplacement[testCase.type];
    for (let key in common) {
      if (skipPartialCommon && partialCommonReplacementKeys.includes(key))
        continue;
      if (!common[key][trans.locale]) {
        // To avoid throwing a "missing translation" error for
        // every single common translation, automatically add noops.
        testCase.replace[key] = key;
        continue;
      }

      if (key in testCase.replace) {
        console.log(`${triggersFile}: duplicated common translation of '${key}`);
        continue;
      }

      testCase.replace[key] = common[key][trans.locale];
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

  if (keys.length === 0 && trans.missingTranslations)
    console.log(`${triggersFile}: missingTranslations set true when not needed`);
}

async function findMissing() {

  triggerSet = (await import(importPath)).default;
  triggers = triggerSet.triggers;
  translations = triggerSet.timelineReplace;
  if (!translations)
    return;

  trans = {
    replaceSync: {},
    replaceText: {},
  };
  
  for (let transBlock of translations) {
    if (!transBlock.locale || transBlock.locale !== locale)
      continue;
    trans = transBlock;
    break;
  }

  findMissingRegex();
  findMissingTimeline();
}
findMissing();