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

processInputs(process.argv.slice(1));

global.manifestFiles = manifestFiles;
global.timelineFiles = timelineFiles;
global.triggersFiles = triggersFiles;

// if (manifestFiles.length > 0)
//   mocha.addFile(path.posix.join(path.relative(process.cwd(), './test/manifests.spec.js')));
if (timelineFiles.length > 0)
  mocha.addFile(path.posix.join(path.relative(process.cwd(), './test/timelines.spec.js')));
// if (triggersFiles.length > 0)
//   mocha.addFile(path.posix.join(path.relative(process.cwd(), './test/triggers.spec.js')));

mocha.loadFilesAsync()
  .then(() => mocha.run((failures) => process.exitCode = failures ? 1 : 0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
