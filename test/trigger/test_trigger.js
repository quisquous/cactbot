'use strict';

// This test loads an individual trigger file and makes validates
// the format and regex calls made.

// TODO: Remove ` ?` before each hex value once global prefix `^.{14} ` is added.
// JavaScript doesn't allow for possessive operators in regular expressions.

let fs = require('fs');

let exitCode = 0;

let inputFilename = String(process.argv.slice(2));

let testValidTriggerRegexLanguage = function(file, contents) {
  let unsupportedRegexLanguage = /(?:regex|triggerRegex)(?!:|Cn|De|Fr|Ko|Ja).*?:/g;
  let results = contents.match(unsupportedRegexLanguage);
  if (results && results.length > 0) {
    for (const result of results) {
      console.error(`${file}: invalid regex language '${result}'`);
      exitCode = 1;
    }
  }
};

let createTriggerRegexString = function(string) {
  return new RegExp(`(?:regex|triggerRegex)(?:|\\w{2}): \/${string}\/`, 'g');
};

let testWellFormedNewCombatantTriggerRegex = function(file, contents) {
  let newCombatantRegex = createTriggerRegexString('(?! ?03:)(.*:)?Added new combatant .*');
  let results = contents.match(newCombatantRegex);
  if (results) {
    for (const result of results) {
      console.error(`${file}: 'Added new combatant' regex should begin with '03:', found '${result}'`);
      exitCode = 1;
    }
  }
};

let testWellFormedStartsUsingTriggerRegex = function(file, contents) {
  let startsUsingRegex = createTriggerRegexString('(?! ?14:)(.* )?starts using .*');
  let results = contents.match(startsUsingRegex);
  if (results) {
    for (const result of results) {
      console.error(`${file}: 'starts using' regex should begin with '14:', found '${result}'`);
      exitCode = 1;
    }
  }
};

let testWellFormedGainsEffectTriggerRegex = function(file, contents) {
  // There are some weird Eureka "gains effect" messages with 00:332e.
  // But everything else is 1A.
  let gainsEffectRegex = createTriggerRegexString('(?! ?(?:1A|00:332e):)(.* )?gains the effect of .*');
  let results = contents.match(gainsEffectRegex);
  if (results) {
    for (const result of results) {
      console.error(`${file}: 'gains the effect of' regex should begin with '1A:', found '${result}'`);
      exitCode = 1;
    }
  }
};

let testWellFormedLosesEffectTriggerRegex = function(file, contents) {
  let losesEffectRegex = createTriggerRegexString('(?! ?1E:)(.* )?loses the effect of .*');
  let results = contents.match(losesEffectRegex);
  if (results) {
    for (const result of results) {
      console.error(`${file}: 'loses the effect of' regex should begin with '1E:', found '${result}'`);
      exitCode = 1;
    }
  }
};

let testTriggerFile = function(file) {
  let contents = fs.readFileSync(file) + '';

  testValidTriggerRegexLanguage(file, contents);
  testWellFormedNewCombatantTriggerRegex(file, contents);
  testWellFormedStartsUsingTriggerRegex(file, contents);
  testWellFormedGainsEffectTriggerRegex(file, contents);
  testWellFormedLosesEffectTriggerRegex(file, contents);
};

testTriggerFile(inputFilename);

process.exit(exitCode);
