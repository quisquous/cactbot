import fs from 'fs';
import path from 'path';

import { Lang } from '../resources/languages';
import NetRegexes from '../resources/netregexes';
import Regexes from '../resources/regexes';
import { LooseTriggerSet } from '../types/trigger';
import {
  commonReplacement,
  partialCommonTimelineReplacementKeys,
} from '../ui/raidboss/common_replacement';
import { TimelineParser, TimelineReplacement } from '../ui/raidboss/timeline_parser';

// Set a global flag to mark regexes for NetRegexes.doesNetRegexNeedTranslation.
// See details in that function for more information.
NetRegexes.setFlagTranslationsNeeded(true);

type ErrorFuncType = (
  file: string,
  line: number | undefined,
  label: string | undefined,
  message: string,
) => void;

export const findMissing = async (
  triggersFile: string,
  locale: Lang,
  errorFunc: ErrorFuncType,
): Promise<void> => {
  // Hackily assume that any file with a txt file of the same name is a trigger/timeline.
  const timelineFile = triggersFile.replace(/\.[jt]s$/, '.txt');
  if (!fs.existsSync(timelineFile))
    return;

  const timelineText = fs.readFileSync(timelineFile).toString();
  const timeline = new TimelineParser(timelineText, [], [], []);

  const importPath = '../' + path.relative(process.cwd(), triggersFile).replace(/\\/g, '/');

  // Dynamic imports don't have a type, so add type assertion.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const triggerSet = (await import(importPath)).default as LooseTriggerSet;
  const translations = triggerSet.timelineReplace;
  if (!translations)
    return;

  let trans: TimelineReplacement = {
    replaceSync: {},
    replaceText: {},
    locale: locale,
  };

  for (const transBlock of translations) {
    if (!transBlock.locale || transBlock.locale !== locale)
      continue;
    trans = transBlock;
    break;
  }

  findMissingTimeline(timelineFile, triggersFile, triggerSet, timeline, trans, errorFunc);
};

const findMissingTimeline = (
  timelineFile: string,
  triggersFile: string,
  triggerSet: LooseTriggerSet,
  timeline: TimelineParser,
  trans: TimelineReplacement,
  errorFunc: ErrorFuncType,
) => {
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
  ] as const;

  const skipPartialCommon = true;

  // Add all common replacements, so they can be checked for collisions as well.
  for (const testCase of testCases) {
    const common = commonReplacement[testCase.type];
    for (const [key, value] of Object.entries(common)) {
      if (skipPartialCommon && partialCommonTimelineReplacementKeys.includes(key))
        continue;
      const transValue = value[trans.locale];
      if (!transValue) {
        // To avoid throwing a "missing translation" error for
        // every single common translation, automatically add noops.
        testCase.replace[key] = key;
        continue;
      }

      if (key in testCase.replace) {
        errorFunc(triggersFile, undefined, undefined, `duplicated common translation of '${key}`);
        continue;
      }

      testCase.replace[key] = transValue;
    }
  }

  const ignore = timeline.GetMissingTranslationsToIgnore();
  const isIgnored = (x: string) => {
    for (const ig of ignore) {
      if (x.match(ig))
        return true;
    }
    return false;
  };

  const output: { [key: string]: [string, number | undefined, 'sync' | 'text', string] } = {};

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
        output[sortKey] = [timelineFile, item.line, testCase.label, `"${item.text}"`];
      }
    }
  }

  const keys = Object.keys(output).sort();
  for (const key of keys) {
    const value = output[key];
    if (value)
      errorFunc(...value);
  }

  if (keys.length === 0 && trans.missingTranslations)
    errorFunc(triggersFile, undefined, undefined, `missingTranslations set true when not needed`);
};
