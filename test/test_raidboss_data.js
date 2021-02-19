import fs from 'fs';
import path from 'path';
import Mocha from 'mocha';

import testManifestFiles from './helper/test_manifest.js';
import testTimelineFiles from './helper/test_timeline.js';
import testTriggerFiles from './helper/test_trigger.js';

// This file runs in one of two ways:
// (1) As a part of Mocha's normal execution, running all the files in test...
//     In this case, this file will call all of the testXFiles functions
//     itself so that there is only run() of Mocha.
// (2) Called directly via node with optional filenames being passed via argv...
//     In this case, this is for something like lint-staged.  This file will
//     pass all of the filenames it finds into globals and add
//     test_data_runner.js as a test, which will take thiose globals and call
//     all of the same testXFiles functions.
//
// This weird dance allows for both partial testing of data files for lint-staged
// while only having a single Mocha execution when running implicitly as a part
// of Mocha.

const mocha = new Mocha();

const walkDir = (dir, callback) => {
  if (fs.statSync(dir).isFile()) {
    callback(path.posix.join(dir));
    return;
  }
  fs.readdirSync(dir).forEach((f) => {
    const dirPath = path.posix.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.posix.join(dir, f));
  });
};

const manifestFiles = [];
const timelineFiles = [];
const triggerFiles = [];

const processInputs = (inputPath) => {
  inputPath.forEach((path) => {
    walkDir(path, (filepath) => {
      if (/\/(?:raidboss|oopsyraidsy)\/data\/manifest.txt/.test(filepath)) {
        manifestFiles.push(filepath);
        return;
      }
      if (/\/raidboss\/data\/.*\.txt/.test(filepath)) {
        timelineFiles.push(filepath);
        return;
      }
      if (/\/raidboss\/data\/.*\.js/.test(filepath)) {
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
const inputs = !insideMocha && process.argv.length > 2 ? process.argv.slice(1) : defaultInput;
processInputs(inputs);

if (insideMocha) {
  testTriggerFiles(triggerFiles);
  testManifestFiles(manifestFiles);
  testTimelineFiles(timelineFiles);
} else {
  // Globals are the only way to pass additional fields to the test files below.
  // Because we are running mocha programatically here, the file names must be
  // passed via globals.  We can't add files after Mocha has started, unfortunately.
  global.manifestFiles = manifestFiles;
  global.timelineFiles = timelineFiles;
  global.triggerFiles = triggerFiles;
  mocha.addFile(path.posix.join(path.relative(process.cwd(), './test/helper/test_data_runner.js')));

  mocha.loadFilesAsync()
    .then(() => mocha.run((failures) => process.exitCode = failures ? 1 : 0))
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}
