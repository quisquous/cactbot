// This test loads an individual trigger file and makes validates
// the format and regex calls made.

// TODO: Remove ` ?` before each hex value once global prefix `^.{14} ` is added.
// JavaScript doesn't allow for possessive operators in regular expressions.

import { triggerFunctions, triggerTextOutputFunctions, builtInResponseStr } from '../../resources/responses.js';
import fs from 'fs';
import path from 'path';
import chai from 'chai';

const { assert } = chai;

const exitCode = 0;

const inputFilename = String(process.argv.slice(2));

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

const createTriggerRegexString = function(string) {
  return new RegExp(`(?:regex|triggerRegex)(?:|\\w{2}): \/${string}\/`, 'g');
};

const testTriggerFile = (file) => {
  let contents;
  let triggerSet;

  before(async () => {
    contents = fs.readFileSync(file) + '';
    const importPath = '../../' + path.relative(process.cwd(), file).replace(/\\/g, '/');
    triggerSet = (await import(importPath)).default;
  });

  // Dummy test so that failures in before show up with better text.
  it('should load properly', () => {});

  it('has valid trigger regex language', () => {
    const unsupportedRegexLanguage = /(?:regex|triggerRegex)(?!:|Cn|De|Fr|Ko|Ja)\w*\s*:/g;
    const results = contents.match(unsupportedRegexLanguage);
    if (results && results.length > 0) {
      for (const result of results)
        assert.fail(`invalid regex language '${result}'`);
    }
  });

  it('has well-formed new combatant trigger regex', () => {
    // Escape the escapes so they can escape the escape in the parsed regex.
    const newCombatantRegex = createTriggerRegexString('(?! ?03:\\\\y{ObjectId}:)(.*:)?Added new combatant.*');
    const results = contents.match(newCombatantRegex);
    if (results) {
      for (const result of results)
        assert.fail(`'Added new combatant' regex should begin with '03:\\y{ObjectId}:', found '${result}'`);
    }
  });

  it('has well-formed starts using trigger', () => {
    const startsUsingRegex = createTriggerRegexString('(?! ?14:)(.* )?starts using.*');
    const results = contents.match(startsUsingRegex);
    if (results) {
      for (const result of results)
        assert.fail(`'starts using' regex should begin with '14:', found '${result}'`);
    }
  });

  it('has well-formed gains effect trigger', () => {
    // There are some weird Eureka "gains effect" messages with 00:332e.
    // But everything else is 1A.
    const gainsEffectRegex = createTriggerRegexString('(?! (?:1A:\\\\y{ObjectId}|00:332e):)(.* )?gains the effect of.*');
    const results = contents.match(gainsEffectRegex);
    if (results) {
      for (const result of results)
        assert.fail(`'gains the effect of' regex should begin with '1A:\\y{ObjectId}:', found '${result}'`);
    }
  });

  it('has well-formed loses effect trigger', () => {
    const losesEffectRegex = createTriggerRegexString('(?! ?1E:\\\\y{ObjectId}:)(.* )?loses the effect of.*');
    const results = contents.match(losesEffectRegex);
    if (results) {
      for (const result of results)
        assert.fail(`'loses the effect of' regex should begin with '1E:\\y{ObjectId}:', found '${result}'`);
    }
  });

  it('has no bad catch-all regex', () => {
    // Matches 3, 5, 6, 7, or 9 (or more) consecutive '.' operators
    const badCatchAllRegex = createTriggerRegexString('.*:(\\.{3}(\\.{2,4})?|\\.{9,}):.*');
    const results = contents.match(badCatchAllRegex);
    if (results) {
      for (const result of results)
        assert.fail(`Invalid number of '.' operators, found '${result}'`);
    }
  });

  it('should use ObjectId instead of literal periods', () => {
    const objectIdRegex = createTriggerRegexString('.*:\\.{8}:.*');
    const results = contents.match(objectIdRegex);
    if (results) {
      for (const result of results)
        assert.fail(`${file}: ObjectId should be used in favor of literal '........', found '${result}'`);
    }
  });

  it('should not use an unnecessary group regex', () => {
    const unnecessaryGroupRegex = createTriggerRegexString('.*\\(\\?:.\\|.\\).*');
    const results = contents.match(unnecessaryGroupRegex);
    if (results) {
      for (const result of results)
        assert.fail(`${file}: Match single character from set '[ab]' should be used in favor of group matching '(?:a|b)' for single characters, found '${result}'`);
    }
  });

  // https://stackoverflow.com/questions/1007981/
  // Parsing code with regular expressions is always a great idea.
  const getParamNames = function(func) {
    return func.toString()
      .replace(/[/][/].*$/mg, '') // strip single-line comments
      .replace(/\s+/g, '') // strip white space
      .replace(/[/][*][^/*]*[*][/]/g, '') // strip multi-line comments
      .replace(/\)(?:{|=>).*$/, '') // remove trailing paren
      .replace(/^[^(]*[(]/, '') // remove leading paren
      .replace(/=[^,]+/g, '') // strip any ES6 defaults
      .split(/,(?![^{]*})/g).filter(Boolean); // split & filter [""]
  };

  it('has valid matches and output parameters', () => {
    for (const currentTrigger of triggerSet.triggers) {
      let containsMatches = false;
      let containsMatchesParam = false;

      const verifyTrigger = (trigger) => {
        for (const func of triggerFunctions) {
          let currentTriggerFunction = trigger[func];
          if (currentTriggerFunction === null)
            continue;
          if (typeof currentTriggerFunction === 'undefined')
            continue;
          const funcStr = currentTriggerFunction.toString();

          const containsOutput = /\boutput\.(\w*)\(/.test(funcStr);
          const containsOutputParam = getParamNames(currentTriggerFunction).includes('output');
          // TODO: should we error when there is an unused output param? that seems a bit much.
          if (containsOutput && !containsOutputParam)
            assert.fail(`Missing 'output' param for '${currentTrigger.id}'.`);


          containsMatches |= funcStr.includes('matches');
          containsMatchesParam |= getParamNames(currentTriggerFunction).includes('matches');

          const builtInResponse = 'cactbot-builtin-response';
          if (funcStr.includes(builtInResponse)) {
            if (typeof currentTriggerFunction !== 'function') {
              assert.fail(`${currentTrigger.id} field '${func}' has ${builtinResponse} but is not a function.`);
              continue;
            }
            if (func !== 'response') {
              assert.fail(`${currentTrigger.id} field '${func}' has ${builtinResponse} but is not a response.`);
              continue;
            }
            // Built-in response functions can be safely called once.
            const output = new TestOutputProxy(trigger, {});
            currentTriggerFunction = currentTriggerFunction({}, {}, output);
          }
          if (func === 'response' && typeof currentTriggerFunction === 'object') {
            // Treat a response object as its own trigger and look at all the functions it returns.
            verifyTrigger(currentTriggerFunction);
          }
        }
      };
      verifyTrigger(currentTrigger);

      let captures = -1;

      // Check for inconsistencies between languages in regexes.
      for (const regexLang of regexLanguages) {
        const currentRegex = currentTrigger[regexLang];
        if (typeof currentRegex !== 'undefined') {
          const currentCaptures = new RegExp('(?:' + currentRegex.toString() + ')?').exec('').length - 1;
          // Ignore first pass
          if (captures !== -1 && captures !== currentCaptures) {
            assert.fail(`Found inconsistent capturing groups between languages for trigger id '${currentTrigger.id}'.`);
            break;
          }
          captures = Math.max(captures, currentCaptures);
        }
      }

      // Check for inconsistencies between languages in netRegexes.
      for (const netRegexLang of netRegexLanguages) {
        const currentRegex = currentTrigger[netRegexLang];
        if (typeof currentRegex !== 'undefined') {
          const currentCaptures = new RegExp('(?:' + currentRegex.toString() + ')?').exec('').length - 1;
          // Ignore first pass
          if (captures !== -1 && captures !== currentCaptures) {
            assert.fail(`Found inconsistent capturing groups between languages for trigger id '${currentTrigger.id}'.`);
            break;
          }
          captures = Math.max(captures, currentCaptures);
        }
      }

      if (captures > 0) {
        if (!containsMatches)
          assert.fail(`Found unnecessary regex capturing group for trigger id '${currentTrigger.id}'.`);
        else if (!containsMatchesParam)
          assert.fail(`Missing matches param for '${currentTrigger.id}'.`);
      } else {
        if (containsMatches)
          assert.fail(`Found 'matches' as a function parameter without regex capturing group for trigger id '${currentTrigger.id}'.`);
      }
    }
  });

  it('has valid trigger fields', () => {
    for (const currentTrigger of triggerSet.triggers) {
      for (const key in currentTrigger) {
        if (triggerFunctions.includes(key))
          continue;
        if (regexLanguages.includes(key))
          continue;
        if (netRegexLanguages.includes(key))
          continue;
        assert.fail(`${file}: Found unknown key '${key}' in trigger id '${currentTrigger.id}'.`);
      }
    }
  });

  it('has valid id and prefix', () => {
    let prefix = null;
    let brokenPrefixes = false;
    // TODO: make this global to this file.
    const ids = new Set();

    for (const set of [triggerSet.triggers, triggerSet.timelineTriggers]) {
      if (!set)
        continue;
      for (const trigger of set) {
        if (!trigger.id) {
          assert.fail(`Missing id field in trigger ${trigger.regex}`);
          continue;
        }

        // Triggers must be unique.
        if (ids.has(trigger.id))
          assert.fail(`duplicate id: '${trigger.id}`);

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
        const len = Math.min(prefix.length, trigger.id.length);
        for (idx = 0; idx < len; ++idx) {
          if (prefix[idx] !== trigger.id[idx])
            break;
        }
        if (idx === 0) {
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
      if (prefix[prefix.length - 1] !== ' ')
        assert.fail(`id prefix '${prefix}' is not a full word, must end in a space`);
    }
  });

  it('does not combine response with texts', () => {
    const bannedItems = [
      'alarmText',
      'alertText',
      'infoText',
      'tts',
    ];

    for (const set of [triggerSet.triggers, triggerSet.timelineTriggers]) {
      if (!set)
        continue;
      for (const trigger of set) {
        if (!trigger.response)
          continue;
        for (const item of bannedItems) {
          if (trigger[item])
            assert.fail(`${trigger.id} cannot have both 'response' and '${item}'`);
        }
      }
    }
  });

  it('has sorted trigger fields', () => {
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
      'tts',
      'run',
    ];

    for (const set of [triggerSet.triggers, triggerSet.timelineTriggers]) {
      if (!set)
        continue;
      for (const trigger of set) {
        let lastIdx = -1;

        const keys = Object.keys(trigger);

        for (const field of triggerOrder) {
          if (typeof trigger[field] === 'undefined')
            continue;

          const thisIdx = keys.indexOf(field);
          if (thisIdx === -1)
            continue;
          if (thisIdx <= lastIdx)
            assert.fail(`in ${trigger.id}, field '${keys[lastIdx]}' must precede '${keys[thisIdx]}'`);

          lastIdx = thisIdx;
        }
      }
    }
  });

  it('has valid regex for timeline trigger', () => {
    if (!triggerSet.timelineTriggers)
      return;

    for (const trigger of triggerSet.timelineTriggers) {
      for (const key in trigger) {
        // regex is the only valid regular expression field on a timeline trigger.
        if (key === 'regex')
          continue;
        if (regexLanguages.includes(key) || netRegexLanguages.includes(key))
          assert.fail(`in ${trigger.id}, invalid field '${key}' in timelineTrigger`);
      }
    }
  });

  it('has valid zone id', () => {
    if (!('zoneId' in triggerSet))
      assert.fail(`missing zone id`);
    else if (typeof triggerSet.zoneId === 'undefined')
      assert.fail(`unknown zone id`);

    if ('zoneRegex' in triggerSet)
      assert.fail(`use zoneId instead of zoneRegex`);
  });

  class TestOutputProxy {
    constructor(trigger, responseOutputStrings) {
      return new Proxy(this, {
        get(target, name) {
          // We can't validate all possible paths from the trigger,
          // so always succeed here and we'll validate later.
          return () => '';
        },
        set(target, property, value) {
          if (property === 'responseOutputStrings') {
            // The normal output proxy assigns here, but we want to keep the same
            // object so we can inspect it outside the proxy.
            Object.assign(responseOutputStrings, value);
            return true;
          }

          assert.fail(`Trigger ${trigger.id} set invalid '${property}' on output.`);
        },
      });
    }
  }

  // responses_test.js will handle testing any response with builtInResponseStr.
  // triggers using `response:` otherwise cannot be tested, because we cannot
  // safely call the response function.
  it('has valid output strings', () => {
    for (const set of [triggerSet.triggers, triggerSet.timelineTriggers]) {
      if (!set)
        continue;
      for (const trigger of set) {
        let outputStrings = {};
        let response = {};
        if (trigger.response) {
          // Triggers using responses should include the outputStrings in the
          // response func itself, via `output.responseOutputStrings = {};`
          if (trigger.outputStrings) {
            assert.fail(`found both 'response' and 'outputStrings in '${trigger.id}'.`);
            continue;
          }
          if (typeof trigger.response !== 'function')
            continue;
          const funcStr = trigger.response.toString();
          if (!funcStr.includes(builtInResponseStr)) {
            assert.fail(`'${trigger.id}' built-in response does not include "${builtInResponseStr}".`);
            continue;
          }
          const output = new TestOutputProxy(trigger, outputStrings);
          // Call the function to get the outputStrings.
          response = trigger.response({}, {}, output);

          if (typeof outputStrings !== 'object') {
            assert.fail(`'${trigger.id}' built-in response did not set outputStrings.`);
            continue;
          }
        } else {
          if (trigger.outputStrings && typeof outputStrings !== 'object') {
            assert.fail(`'${trigger.id}' outputStrings must be an object.`);
            continue;
          }
          if (typeof trigger.outputStrings !== 'object') {
            for (const func of triggerTextOutputFunctions) {
              if (trigger[func]) {
                assert.fail(`'${trigger.id}' missing field outputStrings.`);
                break;
              }
            }
            // If no output functions and no output strings, then no error and nothing left to do.
            continue;
          }
          outputStrings = trigger.outputStrings;
        }

        // TODO: should we prevent `output['phrase with spaces']()` style constructions?
        // TODO: should we restrict outputStrings keys to valid variable characters?
        // TODO: should we prevent built in responses from returning other Response functions?

        // TODO: share this with popup-text.js?
        const paramRegex = /\${\s*([^}\s]+)\s*}/g;

        // key => [] of params
        const outputStringsParams = {};

        // For each outputString, find and validate all of the parameters.
        for (const key in outputStrings) {
          let templateObj = outputStrings[key];
          if (typeof templateObj === 'string') {
            // Strings are acceptable as output strings, but convert to a translatable object
            // to make the rest of the code simpler.
            templateObj = { en: templateObj };
          }
          if (typeof templateObj !== 'object') {
            assert.fail(`'${key}' in '${trigger.id}' outputStrings is not a translatable object`);
            continue;
          }

          // All languages must have the same set of params.
          for (const lang in templateObj) {
            const template = templateObj[lang];
            if (typeof template !== 'string') {
              assert.fail(`'${key}' in '${trigger.id}' outputStrings for lang ${lang} is not a string`);
              continue;
            }

            // Build params with a set for uniqueness, but store as an array later for ease of use.
            const params = new Set();
            template.replace(paramRegex, (fullMatch, key) => {
              params.add(key);
              return fullMatch;
            });

            // If this is not the first lang, validate it has the same params as previous languages.
            if (key in outputStringsParams) {
              // prevParams is an array, params is a set.
              const prevParams = outputStringsParams[key];
              let ok = false;
              if (prevParams.length === params.size)
                ok = prevParams.every((key) => params.has(key));

              if (!ok) {
                assert.fail(`'${key}' in '${trigger.id}' outputStrings has inconsistent params among languages`);
                continue;
              }
            }
            outputStringsParams[key] = [...params];

            // Verify that there's no dangling ${
            if (/\${/.test(template.replace(paramRegex, ''))) {
              assert.fail(`'${key}' in '${trigger.id}' outputStrings has an open \${ without a closing }`);
              continue;
            }
          }
        }

        const usedOutputStringEntries = new Set();

        // Detects uses of `output[variable]()` which could be anything.
        let dynamicOutputStringAccess = false;

        // Now, we have an optional |outputStrings| and an optional |response|.
        // Verify that any function in |trigger| or |response| using |output|
        // has a corresponding key in |outputStrings|.  But hackily.
        const obj = Object.assign({}, trigger, response);
        for (const field in obj) {
          const func = obj[field];
          if (typeof func !== 'function')
            continue;
          const funcStr = func.toString();
          const keys = [];

          dynamicOutputStringAccess |= /\boutput\[/.test(funcStr);

          // Validate that any calls to output.word() have a corresponding outputStrings entry.
          funcStr.replace(/\boutput\.(\w*)\(/g, (fullMatch, key) => {
            if (!outputStrings[key]) {
              assert.fail(`missing key '${key}' in '${trigger.id}' outputStrings`);
              return;
            }
            usedOutputStringEntries.add(key);
            keys.push(key);
            return fullMatch;
          });

          for (const key of keys) {
            for (const param of outputStringsParams[key]) {
              if (!funcStr.match(`\\b${param}\\s*:`))
                assert.fail(`'${trigger.id}' does not define param '${param}' for outputStrings entry '${key}'`);
            }
          }
        }

        // Responses can have unused output strings in some cases, such as ones
        // that work with and without matching.
        if (!response && !dynamicOutputStringAccess) {
          for (const key in outputStrings) {
            if (!usedOutputStringEntries.has(key))
              assert.fail(`'${trigger.id}' has unused outputStrings entry '${key}'`);
          }
        }
      }
    }
  });
};

const testTriggerFiles = (triggerFiles) => {
  describe('trigger test', () => {
    for (const file of triggerFiles)
      describe(`${file}`, () => testTriggerFile(file));
  });
};

export default testTriggerFiles;
