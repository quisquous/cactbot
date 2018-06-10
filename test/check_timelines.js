'use strict';

// This test loads all of the timelines from raidboss and makes
// sure that timeline.js can parse them without errors.

let fs = require('fs');
let path = require('path');

let Timeline = require('../ui/raidboss/timeline.js');
let ignoreFiles = ['README.txt'];

let testFolder =
    path.join(__dirname, '..', 'ui', 'raidboss', 'data', 'timelines');

let exitCode = 0;

fs.readdirSync(testFolder).forEach((file) => {
  if (ignoreFiles.indexOf(file) >= 0)
    return;
  let contents = fs.readFileSync(path.join(testFolder, file)) + '';
  let t = new Timeline(contents);
  for (let i = 0; i < t.errors.length; ++i) {
    let e = t.errors[i];
    console.error(file + ':' + e.lineNumber + ': ' + e.error + ': ' + e.line);
    exitCode = 1;
  }
});

process.exit(exitCode);
