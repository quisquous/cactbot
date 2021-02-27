import fs from 'fs';
import path from 'path';
import Regexes from '../resources/regexes.js';
import { Timeline } from '../ui/raidboss/timeline.js';
import { commonReplacement, partialCommonReplacementKeys } from '../ui/raidboss/common_replacement.js';

const triggersFile = process.argv[2];
const locale = process.argv[3];
const localeReg = 'regex' + locale[0].toUpperCase() + locale[1];
findMissing(triggersFile, locale, localeReg);

async function findMissing(triggersFile, locale, localeReg) {
  // Hackily assume that any file with a txt file of the same name is a trigger/timeline.
  const timelineFile = triggersFile.replace(/\.js$/, '.txt');
  if (!fs.existsSync(timelineFile))
    process.exit(-1);

  const timelineText = String(fs.readFileSync(timelineFile));
  const timeline = new Timeline(timelineText);

  const importPath = '../' + path.relative(process.cwd(), triggersFile).replace(/\\/g, '/');

  const triggerText = String(fs.readFileSync(triggersFile));
  const triggerLines = triggerText.split('\n');

  const triggerSet = (await import(importPath)).default;
  const translations = triggerSet.timelineReplace;
  if (!translations)
    return;

  let trans = {
    replaceSync: {},
    replaceText: {},
  };

  for (const transBlock of translations) {
    if (!transBlock.locale || transBlock.locale !== locale)
      continue;
    trans = transBlock;
    break;
  }

  findMissingRegex(triggerSet.triggers, triggerLines, timeline, trans, localeReg);
  findMissingTimeline(timelineFile, triggerSet, timeline, trans);
}

// An extremely hacky helper to turn a trigger id back into a line number.
function findLineNumberByTriggerId(text, id) {
  // Apostrophes need to be double escaped here, once for the Regexes.parse
  // and the second time for the the backslash itself, to turn /'/ into /\\'/
  let escapedId = id.replace(/'/, '\\\\\'');
  // Other regex characters just need to be escaped once to get out of
  // Regexes.parse unscathed.
  escapedId = escapedId.replace(/([+^$*])/, '\\$1');
  const regex = Regexes.parse('^\\s*id: \'' + escapedId + '\',');

  let lineNumber = 0;
  for (const line of text) {
    lineNumber++;

    if (regex.test(line))
      return lineNumber;
  }

  // This should never happen.
  console.log('Failure to find id in file for: ' + id);
  return '?';
}

function findMissingRegex(triggers, triggerLines, timeline, trans, localeReg) {
  for (const trigger of triggers) {
    let origRegex = trigger.regex;
    if (!origRegex)
      continue;

    const lineNumber = findLineNumberByTriggerId(triggerLines, trigger.id);

    origRegex = origRegex.source.toLowerCase();

    let foundMatch = false;

    let transRegex = origRegex;
    for (const regex in trans.replaceSync) {
      const replace = Regexes.parseGlobal(regex);
      if (transRegex.match(replace))
        foundMatch = true;
      transRegex = transRegex.replace(replace, trans.replaceSync[regex]);
    }
    for (const regex in commonReplacement.replaceSync) {
      const replace = Regexes.parseGlobal(regex);
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
    const ignore = timeline.GetMissingTranslationsToIgnore();
    let foundIgnore = false;
    for (const ig of ignore) {
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

function findMissingTimeline(timelineFile, triggerSet, timeline, trans) {
  // Don't bother translating timelines that are old.
  if (triggerSet.timelineNeedsFixing)
    return;

  // TODO: merge this with test_timeline.js??
  const testCases = [
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

      if (key in testCase.replace) {
        console.log(`${triggersFile}: duplicated common translation of '${key}`);
        continue;
      }

      testCase.replace[key] = common[key][trans.locale];
    }
  }

  const ignore = timeline.GetMissingTranslationsToIgnore();
  const isIgnored = (x) => {
    for (const ig of ignore) {
      if (x.match(ig))
        return true;
    }
    return false;
  };

  const output = {};

  for (const testCase of testCases) {
    for (const item of testCase.items) {
      if (isIgnored(item.text))
        continue;
      let matched = false;
      for (const regex in testCase.replace) {
        if (item.text.match(Regexes.parse(regex))) {
          matched = true;
          break;
        }
      }
      if (!matched) {
        // Because we handle syncs separately from texts, in order to
        // sort them all properly together, create a key to be used with sort().
        const sortKey = String(item.line).padStart(8, '0') + testCase.label;
        const value = `${timelineFile}:${item.line} ${testCase.label} "${item.text}"`;
        output[sortKey] = value;
      }
    }
  }

  const keys = Object.keys(output).sort();
  for (const key of keys)
    console.log(output[key]);

  if (keys.length === 0 && trans.missingTranslations)
    console.log(`${triggersFile}: missingTranslations set true when not needed`);
}
