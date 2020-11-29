import fs, { readdirSync } from 'fs';
import path from 'path';
import chai from 'chai';
import { Timeline } from '../ui/raidboss/timeline.js';
import { commonReplacement, partialCommonReplacementKeys } from '../ui/raidboss/common_replacement.js';
import Regexes from '../resources/regexes.js';

const { expect } = chai;

const raidbossDataPath = './ui/raidboss/data/';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach((f) => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

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

const setup = () => {
  walkDir(raidbossDataPath, (filepath) => {
    // For each timeline file, ensure that its corresponding trigger file is pointing to it.
    const filename = filepath.split(path.sep).slice(-1)[0];
    if (!filename.endsWith('.txt'))
      return;
    if (filename === 'manifest.txt')
      return;
    const triggerFilename = filepath.replace('.txt', '.js');
    if (!fs.statSync(triggerFilename))
      throw new Error(`Error: Timeline file ${filepath} found without matching trigger file`);
    const timelineFile = parseTimelineFileFromTriggerFile(triggerFilename);
    if (timelineFile !== filename)
      throw new Error(`Error: Trigger file ${triggerFilename} has \`triggerFile: '${timelineFile}'\`, but was expecting \`triggerFile: '${filename}'\`.`);

    testFiles.push({
      timelineFile: filepath,
      triggersFile: filepath.replace('.txt', '.js'),
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
        expect(key, `${triggersFile}:locale ${trans.locale}:common replacement '${key}' found in ${testCase.type}`).to.be.null;
      testCase.replace[key] = common[key][trans.locale];
    }
  }

  return testCases;
}

describe('timeline test', () => {
  setup();

  for (const testFile of testFiles) {
    timelineFile = testFile.timelineFile;
    triggersFile = testFile.triggersFile;

    let timelineText;
    let triggerSet;

    describe(`${timelineFile}`, () => {
      before(async () => {
        const importPath = '../' + path.relative(process.cwd(), triggersFile).replace(/\\/g, '/');
        timelineText = String(fs.readFileSync(timelineFile));
        triggerSet = (await import(importPath)).default;
        timeline = new Timeline(timelineText, null, triggerSet.timelineTriggers);
      });
      // This test loads an individual raidboss timeline and makes sure
      // that timeline.js can parse it without errors.
      it('should load without errors', () => {
        for (const e of timeline.errors) {
          if (e.line && e.lineNumber)
            expect(e, `${timelineFile}:${e.lineNumber}:${e.error}:${e.line}`).to.be.null;
          else
            expect(e, `${timelineFile}:${e.error}`).to.be.null;
        }
      });
      it('should not have translation conflicts', () => {
        const translations = triggerSet.timelineReplace;
        if (!translations)
          return;

        for (const trans of translations) {
          const locale = trans.locale;
          // TODO: maybe this needs to be in the triggers test instead
          expect(locale, `${triggersFile}: missing locale in translation block`).to.not.be.undefined;

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

                  expect(otherFirst, `${triggersFile}:locale ${locale}: pre-translation collision on ${testCase.type} '${orig}' for '${regex}' and '${otherRegex}'`).to.equal(otherSecond);
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

                  expect(otherFirst, `${triggersFile}:locale ${locale}: post-translation collision on ${testCase.type} '${orig}' for '${regex}' => '${testCase.replace[regex]}', then '${otherRegex}'`).to.equal(otherSecond);
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
              expect(matched, `${triggersFile}:locale ${locale}:no translation for ${testCase.type} '${item}'`).to.be.true;
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
                expect(Regexes.parse(regex).source.match(bad), `${triggersFile}:locale ${locale}:invalid character in ${testCase.type} '${regex}'`).to.be.null;
            }
          }
        }
      });
      it('should have proper sealed sync', () => {
        for (const sync of timeline.syncStarts) {
          const regex = sync.regex.source;
          if (regex.includes('is no longer sealed'))
            expect(regex.includes('00:0839:.*is no longer sealed'), `${timelineFile}:${sync.lineNumber} 'is no longer sealed' sync must be exactly '00:0839:.*is no longer sealed'`).to.be.true;
          else if (regex.includes('will be sealed'))
            expect(regex.match('00:0839:.*will be sealed'), `${timelineFile}:${sync.lineNumber} 'will be sealed' sync must be preceded by '00:0839:'`).to.be.true;
        }
      });
    });
  }
});
