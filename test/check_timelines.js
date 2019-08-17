'use strict';

// This test loads all of the timelines from raidboss and makes
// sure that timeline.js can parse them without errors.

let fs = require('fs');
let path = require('path');
let Timeline = require('../ui/raidboss/timeline.js');

let baseFolder = path.join(__dirname, '..', 'ui', 'raidboss', 'data');

let testedAny = false;
let exitCode = 0;

let testTimelineFile = function(fullPath, context) {
  testedAny = true;
  if (!fs.existsSync(fullPath)) {
    console.error(fullPath + ' doesn\'t exist.  (' + context + ')');
    exitCode = 1;
    return;
  }

  let contents = fs.readFileSync(fullPath) + '';
  let t = new Timeline(contents);
  for (let i = 0; i < t.errors.length; ++i) {
    let e = t.errors[i];
    console.error(file + ':' + e.lineNumber + ': ' + e.error + ': ' + e.line);
    exitCode = 1;
  }
};

let testDirectory = function(dir) {
  fs.readdirSync(dir).forEach((file) => {
    let fullPath = path.join(dir, file);
    let stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      testDirectory(fullPath);
      return;
    }
    if (file.substr(file.length - 3) != '.js')
      return;

    let contents = fs.readFileSync(fullPath) + '';
    let m = contents.match(/^\s*timelineFile: '([^']*)',\s$/m);
    if (!m)
      return;
    // TODO: could count line numbers here
    let context = fullPath;

    testTimelineFile(path.join(dir, m[1]), context);
  });
};

testDirectory(baseFolder);

if (!testedAny) {
  console.error('Did not find any timelines');
  exitCode = 1;
}

process.exit(exitCode);
