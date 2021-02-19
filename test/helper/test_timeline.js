import fs from 'fs';
import path from 'path';
import chai from 'chai';
import { Timeline } from '../../ui/raidboss/timeline.js';
import { commonReplacement, partialCommonReplacementKeys } from '../../ui/raidboss/common_replacement.js';
import Regexes from '../../resources/regexes.js';

const { assert } = chai;

const raidbossDataPath = './ui/raidboss/data/';

const parseTimelineFileFromTriggerFile = (filepath) => {
  const fileContents = fs.readFileSync(filepath, 'utf8');
  const match = fileContents.match(/ {2}timelineFile: '(?<timelineFile>.*)',/);
  if (!match)
    throw new Error(`Error: Trigger file ${filepath} has no timelineFile attribute defined`);
  return match.groups.timelineFile;
};

function getTestCasesWithoutPartialCommon(trans) {
  return getTestCases(trans, true);
}

const testFiles = [];

let timelineFile;
let triggersFile;

let timeline;

const setup = (timelineFiles) => {
  timelineFiles.forEach((timelineFile) => {
    // For each timeline file, ensure that its corresponding trigger file is pointing to it.
    const filename = timelineFile.split('/').slice(-1)[0];
    const triggerFilename = timelineFile.replace('.txt', '.js');
    if (!fs.statSync(triggerFilename))
      throw new Error(`Error: Timeline file ${timelineFile} found without matching trigger file`);
    const timelineFileFromFile = parseTimelineFileFromTriggerFile(triggerFilename);
    if (filename !== timelineFileFromFile)
      throw new Error(`Error: Trigger file ${triggerFilename} has \`triggerFile: '${timelineFileFromFile}'\`, but was expecting \`triggerFile: '${filename}'\``);

    testFiles.push({
      timelineFile: timelineFile,
      triggersFile: triggerFilename,
    });
  });
};

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
        assert.isNull(key, `${triggersFile}:locale ${trans.locale}:common replacement '${key}' found in ${testCase.type}`);
      testCase.replace[key] = common[key][trans.locale];
    }
  }

  return testCases;
}

const testTimelineFiles = (timelineFiles) => {
  describe('timeline test', () => {
    setup(timelineFiles);

    for (const testFile of testFiles) {
      timelineFile = testFile.timelineFile;
      triggersFile = testFile.triggersFile;

      let timelineText;
      let triggerSet;

      describe(`${timelineFile}`, () => {
        before(async () => {
          const importPath = '../../' + path.relative(process.cwd(), triggersFile).replace(/\\/g, '/');
          timelineText = String(fs.readFileSync(timelineFile));
          triggerSet = (await import(importPath)).default;
          timeline = new Timeline(timelineText, null, triggerSet.timelineTriggers);
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

                    assert.equal(otherFirst, otherSecond, `${triggersFile}:locale ${locale}: pre-translation collision on ${testCase.type} '${orig}' for '${regex}' and '${otherRegex}'`);
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

                    assert.equal(otherFirst, otherSecond, `${triggersFile}:locale ${locale}: post-translation collision on ${testCase.type} '${orig}' for '${regex}' => '${testCase.replace[regex]}', then '${otherRegex}'`);
                  }
                }
              }
            }
          }
        });
        it('should not be missing translations', () => {
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
                assert(matched, `${triggersFile}:locale ${locale}:no translation for ${testCase.type} '${item}'`);
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

            const testCases = getTestCases(trans);

            // Text should not include ^ or $, unless preceded by \ or [
            const badRegex = [
              /(?<![\\[])[\^\$]/,
            ].map((x) => Regexes.parse(x));

            for (const testCase of testCases) {
              for (const regex in testCase.replace) {
                for (const bad of badRegex)
                  assert.isNull(Regexes.parse(regex).source.match(bad), `${triggersFile}:locale ${locale}:invalid character in ${testCase.type} '${regex}'`);
              }
            }
          }
        });
        it('should have proper sealed sync', () => {
          for (const sync of timeline.syncStarts) {
            const regex = sync.regex.source;
            if (regex.includes('is no longer sealed'))
              assert(regex.includes('00:0839:.*is no longer sealed'), `${timelineFile}:${sync.lineNumber} 'is no longer sealed' sync must be exactly '00:0839:.*is no longer sealed'`);
            else if (regex.includes('will be sealed'))
              assert(regex.match('00:0839:.*will be sealed'), `${timelineFile}:${sync.lineNumber} 'will be sealed' sync must be preceded by '00:0839:'`);
          }
        });
      });
    }
  });
};

export default testTimelineFiles;
