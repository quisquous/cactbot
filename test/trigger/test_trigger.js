'use strict';

// This test loads an individual trigger file and makes validates
// the format and regex calls made.

// TODO: Remove ` ?` before each hex value once global prefix `^.{14} ` is added.
// JavaScript doesn't allow for possessive operators in regular expressions.

const { assert } = require('chai');
const Regexes = require('../../resources/regexes.js');
const NetRegexes = require('../../resources/netregexes.js');
const Conditions = require('../../resources/conditions.js');
const ZoneId = require('../../resources/zone_id.js');
const { Responses, triggerFunctions } = require('../../resources/responses.js');
const fs = require('fs');

let exitCode = 0;

let inputFilename = String(process.argv.slice(2));

const regexLanguages = [
  'regex',
  'regexCn',
  'regexDe',
  'regexFr',
  'regexJa',
  'regexKo',
];

const netRegexLanguages = [
  'netRegex',
  'netRegexCn',
  'netRegexDe',
  'netRegexFr',
  'netRegexJa',
  'netRegexKo',
];

const errorFunc = (str) => {
  console.error(str);
  exitCode = 1;
};

let testValidTriggerRegexLanguage = function(file, contents) {
  let unsupportedRegexLanguage = /(?:regex|triggerRegex)(?!:|Cn|De|Fr|Ko|Ja).*?:/g;
  let results = contents.match(unsupportedRegexLanguage);
  if (results && results.length > 0) {
    for (const result of results)
      errorFunc(`${file}: invalid regex language '${result}'`);
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
    for (const result of results)
      errorFunc(`${file}: 'Added new combatant' regex should begin with '03:\\y{ObjectId}:', found '${result}'`);
  }
};

let testWellFormedStartsUsingTriggerRegex = function(file, contents) {
  let startsUsingRegex = createTriggerRegexString('(?! ?14:)(.* )?starts using.*');
  let results = contents.match(startsUsingRegex);
  if (results) {
    for (const result of results)
      errorFunc(`${file}: 'starts using' regex should begin with '14:', found '${result}'`);
  }
};

let testWellFormedGainsEffectTriggerRegex = function(file, contents) {
  // There are some weird Eureka "gains effect" messages with 00:332e.
  // But everything else is 1A.
  let gainsEffectRegex = createTriggerRegexString('(?! (?:1A:\\\\y{ObjectId}|00:332e):)(.* )?gains the effect of.*');
  let results = contents.match(gainsEffectRegex);
  if (results) {
    for (const result of results)
      errorFunc(`${file}: 'gains the effect of' regex should begin with '1A:\\y{ObjectId}:', found '${result}'`);
  }
};

let testWellFormedLosesEffectTriggerRegex = function(file, contents) {
  let losesEffectRegex = createTriggerRegexString('(?! ?1E:\\\\y{ObjectId}:)(.* )?loses the effect of.*');
  let results = contents.match(losesEffectRegex);
  if (results) {
    for (const result of results)
      errorFunc(`${file}: 'loses the effect of' regex should begin with '1E:\\y{ObjectId}:', found '${result}'`);
  }
};

let testBadCatchAllRegex = function(file, contents) {
  // Matches 3, 5, 6, 7, or 9 (or more) consecutive '.' operators
  let badCatchAllRegex = createTriggerRegexString('.*:(\\.{3}(\\.{2,4})?|\\.{9,}):.*');
  let results = contents.match(badCatchAllRegex);
  if (results) {
    for (const result of results)
      errorFunc(`${file}: Invalid number of '.' operators, found '${result}'`);
  }
};

let testObjectIdRegex = function(file, contents) {
  let objectIdRegex = createTriggerRegexString('.*:\\.{8}:.*');
  let results = contents.match(objectIdRegex);
  if (results) {
    for (const result of results)
      errorFunc(`${file}: ObjectId should be used in favor of literal '........', found '${result}'`);
  }
};

let testUnnecessaryGroupRegex = function(file, contents) {
  let unnecessaryGroupRegex = createTriggerRegexString('.*\\(\\?:.\\|.\\).*');
  let results = contents.match(unnecessaryGroupRegex);
  if (results) {
    for (const result of results)
      errorFunc(`${file}: Match single character from set '[ab]' should be used in favor of group matching '(?:a|b)' for single characters, found '${result}'`);
  }
};

// https://stackoverflow.com/questions/1007981/
// Parsing code with regular expressions is always a great idea.
let getParamNames = function(func) {
  return func.toString()
    .replace(/[/][/].*$/mg, '') // strip single-line comments
    .replace(/\s+/g, '') // strip white space
    .replace(/[/][*][^/*]*[*][/]/g, '') // strip multi-line comments
    .replace(/\)(?:{|=>).*$/, '') // remove trailing paren
    .replace(/^[^(]*[(]/, '') // remove leading paren
    .replace(/=[^,]+/g, '') // strip any ES6 defaults
    .split(/,(?![^{]*})/g).filter(Boolean); // split & filter [""]
};

let testInvalidCapturingGroupRegex = function(file, contents) {
  let json = eval(contents);

  for (let i in json[0].triggers) {
    let currentTrigger = json[0].triggers[i];

    let containsMatches = false;
    let containsMatchesParam = false;

    let verifyTrigger = (trigger) => {
      for (let j = 0; j < triggerFunctions.length; j++) {
        let currentTriggerFunction = trigger[triggerFunctions[j]];
        if (currentTriggerFunction === null)
          continue;
        if (typeof currentTriggerFunction !== 'undefined') {
          containsMatches |= currentTriggerFunction.toString().includes('matches');
          containsMatchesParam |= getParamNames(currentTriggerFunction).includes('matches');
        }
        if (triggerFunctions[j] === 'response' && typeof currentTriggerFunction === 'object') {
          // Treat a response object as its own trigger and look at all the functions it returns.
          verifyTrigger(currentTriggerFunction);
        }
      }
    };
    verifyTrigger(currentTrigger);

    let captures = -1;

    // Check for inconsistencies between languages in regexes.
    for (let regexLang of regexLanguages) {
      let currentRegex = currentTrigger[regexLang];
      if (typeof currentRegex !== 'undefined') {
        let currentCaptures = new RegExp('(?:' + currentRegex.toString() + ')?').exec('').length - 1;
        // Ignore first pass
        if (captures !== -1 && captures !== currentCaptures) {
          errorFunc(`${file}: Found inconsistent capturing groups between languages for trigger id '${currentTrigger.id}'.`);
          break;
        }
        captures = Math.max(captures, currentCaptures);
      }
    }

    // Check for inconsistencies between languages in netRegexes.
    for (let netRegexLang of netRegexLanguages) {
      let currentRegex = currentTrigger[netRegexLang];
      if (typeof currentRegex !== 'undefined') {
        let currentCaptures = new RegExp('(?:' + currentRegex.toString() + ')?').exec('').length - 1;
        // Ignore first pass
        if (captures !== -1 && captures !== currentCaptures) {
          errorFunc(`${file}: Found inconsistent capturing groups between languages for trigger id '${currentTrigger.id}'.`);
          break;
        }
        captures = Math.max(captures, currentCaptures);
      }
    }

    if (captures > 0) {
      if (!containsMatches)
        errorFunc(`${file}: Found unnecessary regex capturing group for trigger id '${currentTrigger.id}'.`);
      else if (!containsMatchesParam)
        errorFunc(`${file}: Missing matches param for '${currentTrigger.id}'.`);
    } else {
      if (containsMatches)
        errorFunc(`${file}: Found 'matches' as a function parameter without regex capturing group for trigger id '${currentTrigger.id}'.`);
    }
  }
};

let testInvalidTriggerKeys = function(file, contents) {
  let json = eval(contents);

  for (let i in json[0].triggers) {
    let currentTrigger = json[0].triggers[i];
    for (let key in currentTrigger) {
      if (triggerFunctions.includes(key))
        continue;
      if (regexLanguages.includes(key))
        continue;
      if (netRegexLanguages.includes(key))
        continue;
      errorFunc(`${file}: Found unknown key '${key}' in trigger id '${currentTrigger.id}'.`);
    }
  }
};

let testValidIds = function(file, contents) {
  let json = eval(contents);

  let prefix = null;
  let brokenPrefixes = false;
  let ids = new Set();

  for (let set of [json[0].triggers, json[0].timelineTriggers]) {
    if (!set)
      continue;
    for (let trigger of set) {
      if (!trigger.id) {
        errorFunc(`${file}: Missing id field in trigger ${trigger.regex}`);
        continue;
      }

      // Triggers must be unique.
      if (ids.has(trigger.id))
        errorFunc(`${file}: duplicate id: '${trigger.id}`);

      ids.add(trigger.id);

      // Only show one broken prefix per file.
      if (brokenPrefixes)
        continue;

      if (prefix === null) {
        prefix = trigger.id;
        continue;
      }

      // Find common prefix.
      let idx = 0;
      let len = Math.min(prefix.length, trigger.id.length);
      for (idx = 0; idx < len; ++idx) {
        if (prefix[idx] != trigger.id[idx])
          break;
      }
      if (idx == 0) {
        errorFunc(`${file}: No common id prefix in '${prefix}' and '${trigger.id}'`);
        brokenPrefixes = true;
        continue;
      }
      prefix = prefix.substr(0, idx);
    }
  }

  // If there's at least two ids, then the prefix must be a full word.
  // e.g. you can have two triggers like "Prefix Thing 1" and "Prefix Thing 2"
  // you cannot have two triggers like "O4N Thing 1" and "O4S Thing 2",
  // as the prefix "O4" is not a full word (and have a space after it,
  // as "Prefix " does.  This is a bit rigid, but prevents many typos.
  if (ids.size > 1 && !brokenPrefixes && prefix && prefix.length > 0) {
    // if prefix includes more than one word, just remove latter letters.
    if (prefix.includes(' '))
      prefix = prefix.substr(0, prefix.lastIndexOf(' ') + 1);
    if (prefix[prefix.length - 1] != ' ')
      errorFunc(`${file}: id prefix '${prefix}' is not a full word, must end in a space`);
  }
};

let testResponseHasNoFriends = function(file, contents) {
  let json = eval(contents);

  let bannedItems = [
    'alarmText',
    'alertText',
    'infoText',
    'tts',
  ];

  for (let set of [json[0].triggers, json[0].timelineTriggers]) {
    if (!set)
      continue;
    for (let trigger of set) {
      if (!trigger.response)
        continue;
      for (let item of bannedItems) {
        if (trigger[item])
          errorFunc(`${file}: ${trigger.id} cannot have both 'response' and '${item}'`);
      }
    }
  }
};

let testTriggerFieldsSorted = function(file, contents) {
  let json = eval(contents);

  // This is the order in which they are run.
  const triggerOrder = [
    'id',
    'disabled',
    'netRegex',
    // Other netRegexes are not important in ordering.
    'regex',
    // Other regexes are not important in ordering.
    'beforeSeconds',
    'condition',
    'preRun',
    'delaySeconds',
    'durationSeconds',
    'suppressSeconds',
    // This is where the delay happens.
    'promise',
    // This is where the promise delay happens.
    'sound',
    'soundVolume',
    'response',
    'alarmText',
    'alertText',
    'infoText',
    'groupTTS',
    'tts',
    'run',
  ];

  for (let set of [json[0].triggers, json[0].timelineTriggers]) {
    if (!set)
      continue;
    for (let trigger of set) {
      let lastIdx = -1;

      let keys = Object.keys(trigger);

      for (let field of triggerOrder) {
        if (typeof trigger[field] === 'undefined')
          continue;

        let thisIdx = keys.indexOf(field);
        if (thisIdx === -1)
          continue;
        if (thisIdx <= lastIdx)
          errorFunc(`${file}: in ${trigger.id}, field '${keys[lastIdx]}' must precede '${keys[thisIdx]}'`);

        lastIdx = thisIdx;
      }
    }
  }
};

let testBadTimelineTriggerRegex = function(file, contents) {
  let json = eval(contents);
  if (!json[0].timelineTriggers)
    return;

  for (let trigger of json[0].timelineTriggers) {
    let keys = Object.keys(trigger);
    for (let key of keys) {
      // regex is the only valid regular expression field on a timeline trigger.
      if (key === 'regex')
        continue;
      if (regexLanguages.includes(key) || netRegexLanguages.includes(key))
        errorFunc(`${file}: in ${trigger.id}, invalid field '${key}' in timelineTrigger`);
    }
  }
};


let testBadZoneId = function(file, contents) {
  let json = eval(contents);
  let triggerSet = json[0];

  if (!('zoneId' in triggerSet))
    errorFunc(`${file}: missing zone id`);
  else if (typeof triggerSet.zoneId === 'undefined')
    errorFunc(`${file}: unknown zone id`);

  if ('zoneRegex' in triggerSet)
    errorFunc(`${file}: use zoneId instead of zoneRegex`);
};

let testTriggerFile = function(file) {
  let contents = fs.readFileSync(file) + '';

  try {
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
    testValidIds(file, contents);
    testResponseHasNoFriends(file, contents);
    testTriggerFieldsSorted(file, contents);
    testBadTimelineTriggerRegex(file, contents);
    testBadZoneId(file, contents);
  } catch (e) {
    errorFunc(`Trigger error in ${file}.`);
    console.error(e);
  }
};

testTriggerFile(inputFilename);

process.exit(exitCode);
