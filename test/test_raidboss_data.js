import fs from 'fs';
import path from 'path';

import Mocha from 'mocha';
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
const triggersFiles = [];

const processInputs = (inputPath) => {
  inputPath.forEach((path) => {
    walkDir(path, (filepath) => {
      const filename = filepath.split('/').slice(-1)[0];
      if (filename === 'manifest.txt') {
        manifestFiles.push(filepath);
        return;
      }
      if (filename.endsWith('.txt')) {
        timelineFiles.push(filepath);
        return;
      }
      if (filename.endsWith('.js')) {
        triggersFiles.push(filepath);
        return;
      }
    });
  });
};

// Run automatically via mocha, but also allow for running individual
// directories / files via the command-line.
// TODO: use this with lint-staged to run on individual file changes.
const defaultInput = ['ui/raidboss/'];
const inputs = process.argv.length > 2 ? process.argv.slice(1) : defaultInput;
processInputs(inputs);

// Globals are the only way to pass additional fields to the test files below.
// Invoking mocha manually here means that this file can either be run directly
// via node to run individual files or as part of a larger mocha invocation.
// TODO: Unfortunately, this also leads to multiple "pass" messages.  Maybe
// this script can invoke Mocha if not in Mocha but import some shared helper
// to run the tests when run directly??
global.manifestFiles = manifestFiles;
global.timelineFiles = timelineFiles;
global.triggersFiles = triggersFiles;

if (timelineFiles.length > 0)
  mocha.addFile(path.posix.join(path.relative(process.cwd(), './test/helper/test_timeline.js')));

// TODO:
// if (manifestFiles.length > 0)
//   mocha.addFile(path.posix.join(path.relative(process.cwd(), './test/manifests.spec.js')));
// if (triggersFiles.length > 0)
//   mocha.addFile(path.posix.join(path.relative(process.cwd(), './test/triggers.spec.js')));

mocha.loadFilesAsync()
  .then(() => mocha.run((failures) => process.exitCode = failures ? 1 : 0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
