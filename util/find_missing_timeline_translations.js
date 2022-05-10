import fs from 'fs';
import path from 'path';
import Regexes from '../resources/regexes';
import NetRegexes from '../resources/netregexes';
import { TimelineParser } from '../ui/raidboss/timeline_parser';
import { commonReplacement, partialCommonTimelineReplacementKeys } from '../ui/raidboss/common_replacement';

// Set a global flag to mark regexes for NetRegexes.doesNetRegexNeedTranslation.
// See details in that function for more information.
NetRegexes.setFlagTranslationsNeeded(true);

export async function findMissing(triggersFile, locale, errorFunc) {
  // Hackily assume that any file with a txt file of the same name is a trigger/timeline.
  const timelineFile = triggersFile.replace(/\.[jt]s$/, '.txt');
  if (!fs.existsSync(timelineFile))
    return;

  const timelineText = String(fs.readFileSync(timelineFile));
  const timeline = new TimelineParser(timelineText);

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

  const findMissingArgs = {
    timelineFile,
    triggersFile,
    triggerSet,
    triggerLines,
    timeline,
    trans,
    locale,
    errorFunc,
  };

  findMissingTimeline(findMissingArgs);
}

// An extremely hacky helper to turn a trigger id back into a line number.
function findLineNumberByTriggerId(text, id) {
  // Apostrophes need to be double escaped here, once for the Regexes.parse
  // and the second time for the the backslash itself, to turn /'/ into /\\'/
  let escapedId = id.replace(/'/g, '\\\\\'');
  // Other regex characters just need to be escaped once to get out of
  // Regexes.parse unscathed.
  escapedId = escapedId.replace(/([+^$*])/g, '\\$1');
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

function findMissingTimeline(findMissingArgs) {
  const { timelineFile, triggerSet, timeline, trans, triggersFile, errorFunc } = findMissingArgs;

  // Don't bother translating timelines that are old.
  if (triggerSet.timelineNeedsFixing)
    return;

  // TODO: merge this with test_timeline.js??
  const testCases = [
    {
      type: 'replaceSync',
      items: new Set(
        timeline.syncStarts.map((x) => ({ text: x.regex.source, line: x.lineNumber })),
      ),
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
      if (skipPartialCommon && partialCommonTimelineReplacementKeys.includes(key))
        continue;
      if (!common[key][trans.locale]) {
        // To avoid throwing a "missing translation" error for
        // every single common translation, automatically add noops.
        testCase.replace[key] = key;
        continue;
      }

      if (key in testCase.replace) {
        errorFunc(triggersFile, null, null, `duplicated common translation of '${key}`);
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
        const value = [timelineFile, item.line, testCase.label, `"${item.text}"`];
        output[sortKey] = value;
      }
    }
  }

  const keys = Object.keys(output).sort();
  for (const key of keys)
    errorFunc(...output[key]);

  if (keys.length === 0 && trans.missingTranslations)
    errorFunc(triggersFile, null, null, `missingTranslations set true when not needed`);
}
