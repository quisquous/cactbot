import path from 'path';

import Mocha from 'mocha';

import { walkDirSync } from '../util/file_utils';

import testManifestFiles from './helper/test_manifest';
import testTimelineFiles from './helper/test_timeline';
import testTriggerFiles from './helper/test_trigger';

export type TestMochaGlobal = typeof global & {
  triggerFiles?: string[];
  manifestFiles?: string[];
  timelineFiles?: string[];
};

// This file runs in one of two ways:
// (1) As a part of Mocha's normal execution, running all the files in test...
//     In this case, this file will call all of the testXFiles functions
//     itself so that there is only run() of Mocha.
// (2) Called directly via node with optional filenames being passed via argv...
//     In this case, this is for something like lint-staged.  This file will
//     pass all of the filenames it finds into globals and add
//     test_data_runner.ts as a test, which will take those globals and call
//     all of the same testXFiles functions.
//
// This weird dance allows for both partial testing of data files for lint-staged
// while only having a single Mocha execution when running implicitly as a part
// of Mocha.

const mocha = new Mocha();

const manifestFiles: string[] = [];
const timelineFiles: string[] = [];
const triggerFiles: string[] = [];

const processInputs = (inputPath: string[]) => {
  inputPath.forEach((path: string) => {
    walkDirSync(path, (filepath) => {
      if (/\/(?:raidboss|oopsy)_manifest.txt/.test(filepath)) {
        manifestFiles.push(filepath);
        return;
      }
      if (/\/raidboss\/data\/.*\.txt/.test(filepath)) {
        timelineFiles.push(filepath);
        return;
      }
      if (/\/raidboss\/data\/.*\.[jt]s/.test(filepath)) {
        triggerFiles.push(filepath);
        return;
      }
    });
  });
};

const insideMocha = typeof global.describe === 'function';

// Run automatically via mocha, but also allow for running individual
// directories / files via the command-line.
// TODO: use this with lint-staged to run on individual file changes.
const defaultInput = ['ui/raidboss/data', 'ui/oopsyraidsy/data'];
const inputs: string[] = !insideMocha && process.argv.length > 2
  ? process.argv.slice(1)
  : defaultInput;
processInputs(inputs);

if (insideMocha) {
  testTriggerFiles(triggerFiles);
  testManifestFiles(manifestFiles);
  testTimelineFiles(timelineFiles);
} else {
  const annotatedGlobal: TestMochaGlobal = global;

  // Globals are the only way to pass additional fields to the test files below.
  // Because we are running mocha programmatically here, the file names must be
  // passed via globals.  We can't add files after Mocha has started, unfortunately.
  annotatedGlobal.manifestFiles = manifestFiles;
  annotatedGlobal.timelineFiles = timelineFiles;
  annotatedGlobal.triggerFiles = triggerFiles;
  mocha.addFile(path.posix.join(path.relative(process.cwd(), './test/helper/test_data_runner.ts')));

  mocha.loadFilesAsync()
    .then(() => mocha.run((failures) => process.exitCode = failures ? 1 : 0))
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}
