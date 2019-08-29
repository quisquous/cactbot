'use strict';

// This test loads an individual raidboss timeline and makes sure
// that timeline.js can parse it without errors.

let fs = require('fs');
let Timeline = require('../../ui/raidboss/timeline.js');

let exitCode = 0;

let inputFilename = String(process.argv.slice(2));

let testTimelineFile = function(file) {
  let contents = fs.readFileSync(file) + '';
  let t = new Timeline(contents);
  for (let i = 0; i < t.errors.length; ++i) {
    let e = t.errors[i];
    console.error(file + ':' + e.lineNumber + ': ' + e.error + ': ' + e.line);
    exitCode = 1;
  }
};

testTimelineFile(inputFilename);

process.exit(exitCode);
