'use strict';

let triggersFile = process.argv[2];
let locale = process.argv[3];

let fs = require('fs');
let Regexes = require('../resources/regexes.js');
let Conditions = require('../resources/conditions.js');
let responseModule = require('../resources/responses.js');
let Responses = responseModule.responses;
let Timeline = require('../ui/raidboss/timeline.js');

// Hackily assume that any file with a txt file of the same name is a trigger/timeline.
let timelineFile = triggersFile.replace(/\.js$/, '.txt');
if (!fs.existsSync(timelineFile))
  process.exit(-1);

let timelineText = String(fs.readFileSync(timelineFile));
let timeline = new Timeline(timelineText);
let triggerSet = eval(String(fs.readFileSync(triggersFile)));
let triggers = triggerSet[0];

function findMissing() {
  let translations = triggers.timelineReplace;
  if (!translations)
    return;

  let trans = {
    replaceSync: {},
    replaceText: {},
  };

  for (let transBlock of translations) {
    if (!transBlock.locale || transBlock.locale !== locale)
      continue;
    trans = transBlock;
    break;
  }

  let testCases = [
    {
      type: 'replaceSync',
      items: new Set(timeline.syncStarts.map((x) =>
        ({ text: x.regex.source, line: x.lineNumber }))),
      replace: trans.replaceSync,
      label: 'sync',
    },
    {
      type: 'replaceText',
      items: new Set(timeline.events.map((x) => ({ text: x.text, line: x.lineNumber }))),
      replace: trans.replaceText,
      label: 'text',
    },
  ];

  let ignore = timeline.GetMissingTranslationsToIgnore();
  let isIgnored = (x) => {
    for (let ig of ignore) {
      if (x.match(ig))
        return true;
    }
    return false;
  };

  let output = {};

  for (let testCase of testCases) {
    for (let item of testCase.items) {
      if (isIgnored(item.text))
        continue;
      let matched = false;
      for (let regex in testCase.replace) {
        if (item.text.match(Regexes.parse(regex))) {
          matched = true;
          break;
        }
      }
      if (!matched) {
        // Because we handle syncs separately from texts, in order to
        // sort them all properly together, create a key to be used with sort().
        let sortKey = String(item.line).padStart(8, '0') + testCase.label;
        let value = `${timelineFile}:${item.line} ${testCase.label} "${item.text}"`;
        output[sortKey] = value;
      }
    }
  }

  let keys = Object.keys(output).sort();
  for (let key of keys)
    console.log(output[key]);
}

findMissing();
