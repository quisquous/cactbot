import fs from 'fs';
import path from 'path';
import chai from 'chai';
import { Timeline } from '../../ui/raidboss/timeline';
import { commonReplacement, partialCommonReplacementKeys } from '../../ui/raidboss/common_replacement';
import Regexes from '../../resources/regexes';

const { assert } = chai;

const raidbossDataPath = './ui/raidboss/data/';

const parseTimelineFileFromTriggerFile = (filepath) => {
  const fileContents = fs.readFileSync(filepath, 'utf8');
  const match = fileContents.match(/ {2}timelineFile: '(?<timelineFile>.*)',/);
  if (!match)
    throw new Error(`Error: Trigger file ${filepath} has no timelineFile attribute defined`);
  return match.groups.timelineFile;
};

const testFiles = [];

const setup = (timelineFiles) => {
  timelineFiles.forEach((timelineFile) => {
    // For each timeline file, ensure that its corresponding trigger file is pointing to it.
    const filename = timelineFile.split('/').slice(-1)[0];
    const triggerFilenameJS = timelineFile.replace('.txt', '.js');
    const triggerFilenameTS = timelineFile.replace('.txt', '.ts');
    if (!fs.existsSync(triggerFilenameJS) && !fs.existsSync(triggerFilenameTS))
      throw new Error(`Error: Timeline file ${timelineFile} found without matching trigger file`);
    const triggerFile = fs.existsSync(triggerFilenameJS) ? triggerFilenameJS : triggerFilenameTS;
    const timelineFileFromFile = parseTimelineFileFromTriggerFile(triggerFile);
    if (filename !== timelineFileFromFile)
      throw new Error(`Error: Trigger file ${triggerFile} has \`triggerFile: '${timelineFileFromFile}'\`, but was expecting \`triggerFile: '${filename}'\``);

    testFiles.push({
      timelineFile: timelineFile,
      triggersFile: triggerFile,
    });
  });
};

function getTestCases(triggersFile, timeline, trans, skipPartialCommon) {
  const syncMap = new Map();
  for (const key in trans.replaceSync)
    syncMap.set(Regexes.parse(key), trans.replaceSync[key]);
  const textMap = new Map();
  for (const key in trans.replaceText)
    textMap.set(Regexes.parse(key), trans.replaceText[key]);

  const testCases = [
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
    for (const key in common) {
      if (skipPartialCommon && partialCommonReplacementKeys.includes(key))
        continue;
      const regexKey = Regexes.parse(key);
      if (!common[key][trans.locale]) {
        // To avoid throwing a "missing translation" error for
        // every single common translation, automatically add noops.
        testCase.replace.set(regexKey, key);
        continue;
      }
      if (testCase.replace.has(regexKey))
        assert.fail(`${triggersFile}:locale ${trans.locale}:common replacement '${key}' found in ${testCase.type}`);
      testCase.replace.set(regexKey, common[key][trans.locale]);
    }
  }

  return testCases;
}

function getTestCasesWithoutPartialCommon(triggersFile, timeline, trans) {
  return getTestCases(triggersFile, timeline, trans, true);
}

const testTimelineFiles = (timelineFiles) => {
  describe('timeline test', () => {
    setup(timelineFiles);

    for (const testFile of testFiles) {
      describe(`${testFile.timelineFile}`, () => {
        // Capture the test file params in scoped variables so that they are not changed
        // by the testFiles loop during the async `before` function below.
        const timelineFile = testFile.timelineFile;
        const triggersFile = testFile.triggersFile;
        let timelineText;
        let triggerSet;
        let timeline;

        before(async () => {
          // Normalize path
          const importPath = '../../' + path.relative(process.cwd(), triggersFile).replace(/\\/g, '/').replace('.ts', '.js');
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
            const testCases = getTestCases(triggersFile, timeline, trans);

            // For both texts and syncs...
            for (const testCase of testCases) {
              // For every unique replaceable text or sync the timeline knows about...
              for (const orig of testCase.items) {
                // For every translation for that timeline...

                // Do a first pass to find which regexes, if any will apply to orig.
                const translateMatches = [];
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

                    assert.equal(otherFirst, otherSecond, `${triggersFile}:locale ${locale}: pre-translation collision on ${testCase.type} '${orig}' for '${regex}' and '${otherRegex}'`);
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
            // English cannot be missing translations and is always a "partial" translation.
            if (locale === 'en')
              continue;

            if (trans.missingTranslations)
              continue;

            // Ignore partial common translations here, as they don't
            // count towards completing missing translations.
            const testCases = getTestCasesWithoutPartialCommon(triggersFile, timeline, trans);

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
                for (const regex of testCase.replace.keys()) {
                  if (regex.test(item)) {
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

            const testCases = getTestCases(triggersFile, timeline, trans);

            // Text should not include ^ or $, unless preceded by \ or [
            const badRegex = [
              /(?<![\\[])[\^\$]/,
            ].map((x) => Regexes.parse(x));

            for (const testCase of testCases) {
              for (const regex of testCase.replace.keys()) {
                for (const bad of badRegex)
                  assert.isNull(regex.source.match(bad), `${triggersFile}:locale ${locale}:invalid character in ${testCase.type} '${regex}'`);
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
