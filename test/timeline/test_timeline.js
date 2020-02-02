'use strict';

let fs = require('fs');
let Timeline = require('../../ui/raidboss/timeline.js');

let exitCode = 0;

let timelineFile = String(process.argv[2]);
let triggersFile = String(process.argv[3]);
let timeline = fs.readFileSync(timelineFile) + '';
let triggers = fs.readFileSync(triggersFile) + '';

let errorFunc = (str) => {
  console.error(str);
  exitCode = 1;
};

let tests = {
  // This test loads an individual raidboss timeline and makes sure
  // that timeline.js can parse it without errors.
  timelineErrorTest: () => {
    let t = new Timeline(timeline);
    for (let i = 0; i < t.errors.length; ++i) {
      let e = t.errors[i];
      errorFunc(timelineFile + ':' + e.lineNumber + ': ' + e.error + ': ' + e.line);
    }
  },
};

for (let name in tests)
  tests[name]();


process.exit(exitCode);
