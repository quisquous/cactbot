import fs from 'fs';
import path from 'path';

import chai from 'chai';

import Regexes from '../../resources/regexes';
import { LooseTriggerSet } from '../../types/trigger';
import {
  CommonReplacement,
  commonReplacement,
  partialCommonTimelineReplacementKeys,
} from '../../ui/raidboss/common_replacement';
import { TimelineParser, TimelineReplacement } from '../../ui/raidboss/timeline_parser';

const { assert } = chai;

const parseTimelineFileFromTriggerFile = (filepath: string) => {
  const fileContents = fs.readFileSync(filepath, 'utf8');
  const match = / {2}timelineFile: '(?<timelineFile>.*)',/.exec(fileContents);
  if (!match?.groups?.timelineFile)
    throw new Error(`Error: Trigger file ${filepath} has no timelineFile attribute defined`);
  return match.groups.timelineFile;
};

type TestFile = {
  timelineFile: string;
  triggersFile: string;
};

const testFiles: TestFile[] = [];

const setup = (timelineFiles: string[]) => {
  timelineFiles.forEach((timelineFile) => {
    // For each timeline file, ensure that its corresponding trigger file is pointing to it.
    const filename = timelineFile.split('/').slice(-1)[0] ?? '';
    const triggerFilenameJS = timelineFile.replace('.txt', '.js');
    const triggerFilenameTS = timelineFile.replace('.txt', '.ts');

    let triggerFile;
    if (fs.existsSync(triggerFilenameJS))
      triggerFile = triggerFilenameJS;
    else if (fs.existsSync(triggerFilenameTS))
      triggerFile = triggerFilenameTS;
    else
      throw new Error(`Error: Timeline file ${timelineFile} found without matching trigger file`);

    const timelineFileFromFile = parseTimelineFileFromTriggerFile(triggerFile);
    if (filename !== timelineFileFromFile) {
      throw new Error(
        `Error: Trigger file ${triggerFile} has \`triggerFile: '${timelineFileFromFile}'\`, but was expecting \`triggerFile: '${filename}'\``,
      );
    }

    testFiles.push({
      timelineFile: timelineFile,
      triggersFile: triggerFile,
    });
  });
};

type ReplaceMap = Map<RegExp, string>;

type TestCase = {
  type: keyof CommonReplacement;
  items: Set<string>;
  replace: ReplaceMap;
};

const getTestCases = (
  triggersFile: string,
  timeline: TimelineParser,
  trans: TimelineReplacement,
  skipPartialCommon?: boolean,
) => {
  const syncMap: ReplaceMap = new Map();
  for (const [key, replaceSync] of Object.entries(trans.replaceSync ?? {}))
    syncMap.set(Regexes.parse(key), replaceSync);
  const textMap: ReplaceMap = new Map();
  for (const [key, replaceText] of Object.entries(trans.replaceText ?? {}))
    textMap.set(Regexes.parse(key), replaceText);

  const testCases: TestCase[] = [
    {
      type: 'replaceSync',
      items: new Set(timeline.syncStarts.map((x) => x.regex.source)),
      replace: syncMap,
    },
    {
      type: 'replaceText',
      items: new Set(timeline.events.map((x) => x.text)),
      replace: textMap,
    },
  ];

  // Add all common replacements, so they can be checked for collisions as well.
  for (const testCase of testCases) {
    const common = commonReplacement[testCase.type];
    for (const [key, localeText] of Object.entries(common)) {
      if (skipPartialCommon && partialCommonTimelineReplacementKeys.includes(key))
        continue;
      const regexKey = Regexes.parse(key);
      const transText = localeText[trans.locale];
      if (!transText) {
        // To avoid throwing a "missing translation" error for
        // every single common translation, automatically add noops.
        testCase.replace.set(regexKey, key);
        continue;
      }
      if (testCase.replace.has(regexKey)) {
        assert.fail(
          `${triggersFile}:locale ${trans.locale}:common replacement '${key}' found in ${testCase.type}`,
        );
      }
      testCase.replace.set(regexKey, transText);
    }
  }

  return testCases;
};

const getTestCasesWithoutPartialCommon = (
  triggersFile: string,
  timeline: TimelineParser,
  trans: TimelineReplacement,
) => {
  return getTestCases(triggersFile, timeline, trans, true);
};

const testTimelineFiles = (timelineFiles: string[]): void => {
  describe('timeline test', () => {
    setup(timelineFiles);

    for (const testFile of testFiles) {
      describe(`${testFile.timelineFile}`, () => {
        // Capture the test file params in scoped variables so that they are not changed
        // by the testFiles loop during the async `before` function below.
        const timelineFile = testFile.timelineFile;
        const triggersFile = testFile.triggersFile;
        let timelineText;
        let triggerSet: LooseTriggerSet;
        let timeline: TimelineParser;

        before(async () => {
          // Normalize path
          const importPath = '../../' +
            path.relative(process.cwd(), triggersFile).replace('.ts', '.js');
          timelineText = String(fs.readFileSync(timelineFile));

          // Dynamic imports don't have a type, so add type assertion.
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          triggerSet = (await import(importPath)).default as LooseTriggerSet;
          timeline = new TimelineParser(timelineText, [], triggerSet.timelineTriggers ?? []);
        });
        // This test loads an individual raidboss timeline and makes sure
        // that timeline.js can parse it without errors.
        it('should load without errors', () => {
          for (const e of timeline.errors) {
            if (e.line && e.lineNumber)
              assert.isNull(e, `${timelineFile}:${e.lineNumber}:${e.error}:${e.line}`);
            else
              assert.isNull(e, `${timelineFile}:${e.error}`);
          }
        });
        it('should not have translation conflicts', () => {
          const translations = triggerSet.timelineReplace;
          if (!translations)
            return;

          for (const trans of translations) {
            const locale = trans.locale;
            // TODO: maybe this needs to be in the triggers test instead
            assert.isDefined(locale, `${triggersFile}: missing locale in translation block`);

            // Note: even if translations are missing, they should not have conflicts.
            const testCases = getTestCases(triggersFile, timeline, trans);

            // For both texts and syncs...
            for (const testCase of testCases) {
              // For every unique replaceable text or sync the timeline knows about...
              for (const orig of testCase.items) {
                // For every translation for that timeline...

                // Do a first pass to find which regexes, if any will apply to orig.
                type TranslateMatch = [RegExp, string, string];
                const translateMatches: TranslateMatch[] = [];
                for (const [regex, replaceText] of testCase.replace) {
                  const replaced = orig.replace(regex, replaceText);
                  if (orig === replaced)
                    continue;
                  translateMatches.push([regex, replaceText, replaced]);
                }

                // Now do a second O(n^2) pass, only against regexes which apply.
                for (const [regex, replaceText, replaced] of translateMatches) {
                  // If we get here, then |regex| is a valid replacement in |orig|.
                  // The goal is to ensure via testing that there are no ordering
                  // constraints in the timeline translations.  To fix these issues,
                  // add negative lookahead/lookbehind assertions to make the regexes unique.

                  // (1) Verify that there is no pre-replacement collision,.
                  // i.e. two regexes that apply to the same text or sync.
                  // e.g. "Holy IV" is affected by both /Holy IV/ and /Holy/.
                  for (const [otherRegex, otherReplaceText, otherReplaced] of translateMatches) {
                    if (regex === otherRegex)
                      continue;

                    // If we get here, then there is a pre-replacement collision.
                    // Verify if these two regexes can be applied in either order
                    // to get the same result, if so, then this collision can be
                    // safely ignored.
                    // e.g. "Magnetism/Repel" is affected by both /Magnetism/ and /Repel/,
                    // however these are independent and could be applied in either order.

                    const otherFirst = otherReplaced.replace(regex, replaceText);
                    const otherSecond = replaced.replace(otherRegex, otherReplaceText);

                    assert.equal(
                      otherFirst,
                      otherSecond,
                      `${triggersFile}:locale ${locale}: pre-translation collision on ${testCase.type} '${orig}' for '${regex.source}' and '${otherRegex.source}'`,
                    );
                  }

                  // (2) Verify that there is no post-replacement collision with this text,
                  // i.e. a regex that applies to the replaced text that another regex
                  // has already modified.  We need to look through everything here
                  // and not just through translateMatches, unfortunately.
                  for (const [otherRegex, otherReplaceText] of testCase.replace) {
                    if (regex === otherRegex)
                      continue;
                    const otherSecond = replaced.replace(otherRegex, otherReplaceText);
                    if (replaced === otherSecond)
                      continue;

                    // If we get here, then there is a post-replacement collision.
                    // Verify if these two regexes can be applied in either order
                    // to get the same result, if so, then this collision can be
                    // safely ignored.
                    let otherFirst = orig.replace(otherRegex, otherReplaceText);
                    otherFirst = otherFirst.replace(regex, replaceText);

                    assert.equal(
                      otherFirst,
                      otherSecond,
                      `${triggersFile}:locale ${locale}: post-translation collision on ${testCase.type} '${orig}' for '${regex.source}' => '${replaced}', then '${otherRegex.source}'`,
                    );
                  }
                }
              }
            }
          }
        });
        it('should not be missing timeline translations', () => {
          const translations = triggerSet.timelineReplace;
          if (!translations)
            return;

          for (const trans of translations) {
            const locale = trans.locale;
            if (!locale)
              continue;
            // English cannot be missing translations and is always a "partial" translation.
            if (locale === 'en')
              continue;

            if (trans.missingTranslations)
              continue;

            // Ignore partial common translations here, as they don't
            // count towards completing missing translations.
            const testCases = getTestCasesWithoutPartialCommon(triggersFile, timeline, trans);

            const ignore = timeline.GetMissingTranslationsToIgnore();
            const isIgnored = (x: string) => {
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
                for (const regex of testCase.replace.keys()) {
                  if (regex.test(item)) {
                    matched = true;
                    break;
                  }
                }
                assert.isTrue(
                  matched,
                  `${triggersFile}:locale ${locale}:no translation for ${testCase.type} '${item}'`,
                );
              }
            }
          }
        });
        it('should not have bad characters', () => {
          const translations = triggerSet.timelineReplace;
          if (!translations)
            return;

          for (const trans of translations) {
            const locale = trans.locale;
            if (!locale)
              continue;

            const testCases = getTestCases(triggersFile, timeline, trans);

            // Text should not include ^ or $, unless preceded by \ or [
            const badRegex = [
              /(?<![\\[])[\^\$]/,
            ].map((x) => Regexes.parse(x));

            for (const testCase of testCases) {
              for (const regex of testCase.replace.keys()) {
                for (const bad of badRegex) {
                  assert.isNull(
                    bad.exec(regex.source),
                    `${triggersFile}:locale ${locale}:invalid character in ${testCase.type} '${regex.source}'`,
                  );
                }
              }
            }
          }
        });
        it('should have proper sealed sync', () => {
          for (const sync of timeline.syncStarts) {
            const regex = sync.regex.source;
            if (regex.includes('is no longer sealed')) {
              assert.isArray(
                /00:0839::\.\*is no longer sealed/.exec(regex),
                `${timelineFile}:${sync.lineNumber} 'is no longer sealed' sync must be exactly '00:0839::.*is no longer sealed'`,
              );
            } else if (regex.includes('will be sealed')) {
              assert.isArray(
                /00:0839::.*will be sealed/.exec(regex),
                `${timelineFile}:${sync.lineNumber} 'will be sealed' sync must be preceded by '00:0839::'`,
              );
            }
          }
        });
      });
    }
  });
};

export default testTimelineFiles;
