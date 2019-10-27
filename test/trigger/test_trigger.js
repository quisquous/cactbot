'use strict';

// This test loads an individual trigger file and makes validates
// the format and regex calls made.

// TODO: Remove ` ?` before each hex value once global prefix `^.{14} ` is added.
// JavaScript doesn't allow for possessive operators in regular expressions.

let Regexes = require('../../resources/regexes.js');
let fs = require('fs');

let exitCode = 0;

let inputFilename = String(process.argv.slice(2));

const triggerFunctions = [
  'alarmText',
  'alertText',
  'condition',
  'delaySeconds',
  'disabled',
  'durationSeconds',
  'groupTTS',
  'id',
  'infoText',
  'preRun',
  'run',
  'sound',
  'soundVolume',
  'suppressSeconds',
  'tts',
];

const regexLanguages = [
  'regex',
  'regexCn',
  'regexDe',
  'regexFr',
  'regexJa',
  'regexKo',
];

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
  // Escape the escapes so they can escape the escape in the parsed regex.
  let newCombatantRegex = createTriggerRegexString('(?! ?03:\\\\y{ObjectId}:)(.*:)?Added new combatant.*');
  let results = contents.match(newCombatantRegex);
  if (results) {
    for (const result of results) {
      console.error(`${file}: 'Added new combatant' regex should begin with '03:\\y{ObjectId}:', found '${result}'`);
      exitCode = 1;
    }
  }
};

let testWellFormedStartsUsingTriggerRegex = function(file, contents) {
  let startsUsingRegex = createTriggerRegexString('(?! ?14:)(.* )?starts using.*');
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
  let gainsEffectRegex = createTriggerRegexString('(?! (?:1A:\\\\y{ObjectId}|00:332e):)(.* )?gains the effect of.*');
  let results = contents.match(gainsEffectRegex);
  if (results) {
    for (const result of results) {
      console.error(`${file}: 'gains the effect of' regex should begin with '1A:\\y{ObjectId}:', found '${result}'`);
      exitCode = 1;
    }
  }
};

let testWellFormedLosesEffectTriggerRegex = function(file, contents) {
  let losesEffectRegex = createTriggerRegexString('(?! ?1E:\\\\y{ObjectId}:)(.* )?loses the effect of.*');
  let results = contents.match(losesEffectRegex);
  if (results) {
    for (const result of results) {
      console.error(`${file}: 'loses the effect of' regex should begin with '1E:\\y{ObjectId}:', found '${result}'`);
      exitCode = 1;
    }
  }
};

let testBadCatchAllRegex = function(file, contents) {
  // Matches 3, 5, 6, 7, or 9 (or more) consecutive '.' operators
  let badCatchAllRegex = createTriggerRegexString('.*:(\\.{3}(\\.{2,4})?|\\.{9,}):.*');
  let results = contents.match(badCatchAllRegex);
  if (results) {
    for (const result of results) {
      console.error(`${file}: Invalid number of '.' operators, found '${result}'`);
      exitCode = 1;
    }
  }
};

let testObjectIdRegex = function(file, contents) {
  let objectIdRegex = createTriggerRegexString('.*:\\.{8}:.*');
  let results = contents.match(objectIdRegex);
  if (results) {
    for (const result of results) {
      console.error(`${file}: ObjectId should be used in favor of literal '........', found '${result}'`);
      exitCode = 1;
    }
  }
};

let testUnnecessaryGroupRegex = function(file, contents) {
  let unnecessaryGroupRegex = createTriggerRegexString('.*\\(\\?:.\\|.\\).*');
  let results = contents.match(unnecessaryGroupRegex);
  if (results) {
    for (const result of results) {
      console.error(`${file}: Match single character from set '[ab]' should be used in favor of group matching '(?:a|b)' for single characters, found '${result}'`);
      exitCode = 1;
    }
  }
};

let testInvalidCapturingGroupRegex = function(file, contents) {
  let json = eval(contents);

  for (let i in json[0].triggers) {
    let currentTrigger = json[0].triggers[i];

    let containsMatches = false;

    for (let j = 0; !containsMatches && j < triggerFunctions.length; j++) {
      let currentTriggerFunction = currentTrigger[triggerFunctions[j]];
      if (typeof currentTriggerFunction !== 'undefined' && currentTriggerFunction !== null)
        containsMatches = currentTriggerFunction.toString().includes('matches');
    }

    let captures = -1;

    // Check for inconsistencies between languages
    for (let j = 0; j < regexLanguages.length; j++) {
      let currentRegex = currentTrigger[regexLanguages[j]];
      if (typeof currentRegex !== 'undefined') {
        let currentCaptures = new RegExp('(?:' + currentRegex.toString() + ')?').exec('').length - 1;
        // Ignore first pass
        if (captures !== -1 && captures !== currentCaptures) {
          console.error(`${file}: Found inconsistent capturing groups between languages for trigger id '${currentTrigger.id}'.`);
          break;
        }
        captures = Math.max(captures, currentCaptures);
      }
    }

    if (captures > 0) {
      if (!containsMatches)
        console.error(`${file}: Found unnecessary regex capturing group for trigger id '${currentTrigger.id}'.`);
    } else {
      if (containsMatches)
        console.error(`${file}: Found 'matches' as a function parameter without regex capturing group for trigger id '${currentTrigger.id}'.`);
    }
  }
};

let testInvalidTriggerKeys = function(file, contents) {
  let json = eval(contents);

  for (let i in json[0].triggers) {
    let currentTrigger = json[0].triggers[i];
    for (let key in currentTrigger) {
      if (!triggerFunctions.includes(key) && !regexLanguages.includes(key))
        console.error(`${file}: Found unknown key '${key}' in trigger id '${currentTrigger.id}'.`);
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
  testBadCatchAllRegex(file, contents);
  testObjectIdRegex(file, contents);
  testUnnecessaryGroupRegex(file, contents);
  testInvalidCapturingGroupRegex(file, contents);
  testInvalidTriggerKeys(file, contents);
};

testTriggerFile(inputFilename);

process.exit(exitCode);
