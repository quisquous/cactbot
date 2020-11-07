'use strict';

// One off hacky script to convert a trigger filename to output strings.
// Skips anything "tricky", but gets the majority.
// Run via:
//   node util/output-strings-converter.js <filename.js>

const fs = require('fs');
const readline = require('readline');

const fileName = process.argv[2];
const rl = readline.createInterface({
  input: fs.createReadStream(fileName),
  crlfDelay: Infinity,
});

let text = '';
const appendLine = (lineOrLines) => {
  if (typeof lineOrLines === 'string') {
    text += lineOrLines + '\r\n';
  } else {
    for (const line of lineOrLines)
      text += line + '\r\n';
  }
};

const makeOutputName = (lines) => {
  let firstLine;
  let matches;
  const phraseRe = /^\s*en: '(.*)',\s*$/;
  for (const line of lines) {
    firstLine = line;
    matches = firstLine.match(phraseRe);
    if (matches)
      break;
  }

  if (!matches) {
    console.error(`Can't make output name for ${line[0]}`);
    return null;
  }

  const phrase = matches[1].toLowerCase().replace(/[^0-9a-z ]/g, '');
  const words = phrase.split(' ');
  for (let idx = 1; idx < words.length; ++idx) {
    const word = words[idx];
    words[idx] = word.charAt(0).toUpperCase() + word.slice(1);
  }
  let str = words.join('');
  str = str.replace('OnPlayer', 'On');
  return str;
};

const convertLinesIntoParams = (lines) => {
  const paramRe = /(^\s*\w{2}: |' \+ )(.*?)( \+ '|,\s*$)/;
  const noParamRe = /^\s*\w{2}: '(?:[^']|\\')*',/;
  const commentLineRe = /^\s*\/\//;

  const regexes = [
    {
      // only data
      regex: /(?<header>^\s*\w{2}: )(?<param>[^+]*?)(?<footer>,\s*$)/,
      func: (matches, param) => {
        return `${matches.header}\${${param}}${matches.footer}`;
      },
    },
    {
      // starting data
      regex: /(?<header>^\s*\w{2}: )(?<param>[^'].*?) \+ '/,
      func: (matches, param) => {
        return `${matches.header}'\${${param}}`;
      },
    },
    {
      // middle data
      regex: /' \+ (?<param>[^'].*?) \+ '/,
      func: (matches, param) => {
        return `\${${param}}`;
      },
    },
    {
      // end data
      regex: /' \+ (?<param>[^'].*?)(?<footer>,\s*$)/,
      func: (matches, param) => {
        return `\${${param}}'${matches.footer}`;
      },
    },
  ];

  const paramsByLine = [];
  for (let idx = 0; idx < lines.length; ++idx) {
    let line = lines[idx];

    if (commentLineRe.test(line))
      continue;

    if (noParamRe.test(line)) {
      paramsByLine.push(null);
      continue;
    }

    if (!paramRe.test(line)) {
      console.log(`    unknown param line: ${line}`);
      return null;
    }

    const foundParams = {};

    for (const regexDef of regexes) {
      let matches = line.match(regexDef.regex);
      while (matches) {
        const paramValue = matches.groups.param;

        const dataParamRe = /\bdata\.(\w*)/;

        let paramName = null;
        if (paramValue.includes('data.ShortName')) {
          if (paramValue.includes('.join'))
            paramName = 'players';
          else
            paramName = 'player';
        } else if (/^[A-Za-z]*$/.test(paramValue)) {
          paramName = paramValue;
        } else if (paramValue.includes('names')) {
          paramName = 'players';
        } else if (paramValue.toLowerCase().includes('count')) {
          paramName = 'num';
        } else if (paramValue.toLowerCase().includes('number')) {
          paramName = 'num';
        } else if (dataParamRe.test(paramValue)) {
          const matches = paramValue.match(dataParamRe);
          paramName = matches[1];
        } else if (/\.length/.test(paramValue)) {
          paramName = 'num';
        } else {
          // TODO: make this better
          paramName = 'param';
        }

        // If there's a collision, just add a numerical suffix.
        let suffix = 2;
        if (foundParams[paramName]) {
          const baseParamName = paramName;
          while (foundParams[paramName]) {
            paramName = `${baseParamName}${suffix}`;
            suffix++;
          }
        }

        foundParams[paramName] = paramValue;
        line = line.replace(regexDef.regex, regexDef.func(matches.groups, paramName));

        // Try to find another replacement.
        matches = line.match(regexDef.regex);
      }
    }

    paramsByLine.push(foundParams);
    lines[idx] = line;
  }

  // TODO: Verify that all are null or none are null.
  let anyAreNull = false;
  let allAreNull = true;
  for (const params of paramsByLine) {
    if (params === null)
      anyAreNull = true;
    if (params !== null)
      allAreNull = false;
  }

  if (allAreNull)
    return '';

  if (anyAreNull) {
    console.log(`    inconsistent zero params`);
    return null;
  }

  const firstParams = paramsByLine[0];
  for (const params of paramsByLine) {
    // No extra params
    for (const key in params) {
      if (!firstParams[key]) {
        console.log(`    missing param: ${key}`);
        return null;
      }
    }
    for (const key in firstParams) {
      // No missing params
      if (!params[key]) {
        console.log(`    missing param: ${key}`);
        return null;
      }
      // Matching values
      if (params[key] !== firstParams[key]) {
        console.log(`    inconsistent param: ${key}, ${params[key]} vs ${firstParams[key]}`);
        return null;
      }
    }
  }

  const params = paramsByLine[0];
  const names = Object.keys(params);
  let str = '{ ';
  for (let i = 0; i < names.length; ++i) {
    str += `${names[i]}: ${params[names[i]]}`;
    if (i !== names.length - 1)
      str += ', ';
  }
  str += ' }';
  return str;
};

let handle = null;

const triggerIdRe = /^ {6}id: '(.*)',\s*$/;
const triggerFieldRe = /^ {6}(\w*):/;
const triggerFinishRe = /^ {4}},/;
let trigger = {};

const processTrigger = (trigger) => {
  const id = trigger.id[0].match(triggerIdRe)[1];
  console.log(`Processing: ${id}`);

  // Can't handle trigger with output strings already.
  if (trigger.outputStrings) {
    console.log('    has outputStrings');
    for (const field in trigger)
      appendLine(trigger[field]);
    return;
  }

  if (trigger.response) {
    console.log('    has response');
    for (const field in trigger)
      appendLine(trigger[field]);
    return;
  }

  // This doesn't handle responses.
  let hasOutputField = false;
  const outputFields = ['infoText', 'alertText', 'alarmText', 'tts'];
  for (const field of outputFields) {
    if (field in trigger)
      hasOutputField = true;
  }

  // Don't do anything for triggers without output fields.
  if (!hasOutputField) {
    console.log('    no output fields');
    for (const field in trigger)
      appendLine(trigger[field]);
    return;
  }

  // key => { isObject: bool, extractedThings: {} }
  const triggerInfo = {};
  const translations = {};
  const isObjectRe = /^ {6}\w*: {/;

  // Walk through and convert.
  let numReplacements = 0;
  for (const field of outputFields) {
    if (!trigger[field])
      continue;

    const firstLine = trigger[field][0];
    triggerInfo[field] = {
      isObject: isObjectRe.test(firstLine),
      replacement: null,
    };

    if (triggerInfo[field].isObject) {
      const collect = [];
      // Skip first and last line.
      for (let idx = 1; idx < trigger[field].length - 1; ++idx)
        collect.push(trigger[field][idx]);

      const params = convertLinesIntoParams(collect);
      let outputName = makeOutputName(collect);
      if (params === null || outputName === null) {
        console.log('    bad params');
        for (const field in trigger)
          appendLine(trigger[field]);
        return;
      }

      const baseOutputName = outputName;
      let suffix = 2;
      while (translations[outputName]) {
        outputName = `${baseOutputName}${suffix}`;
        suffix++;
      }

      translations[outputName] = collect;

      triggerInfo[field].replacement = [
        `      ${field}: (data, _, output) => output.${outputName}(${params}),`,
      ];
      console.log(`    replacing simple output ${field}`);
      numReplacements++;
      continue;
    }

    // Tricky case of editing return values @_@;;;
    const returnObj = /\breturn {\s*$/;
    const returnAnything = /\breturn\b/;
    const returnNothing = /\breturn(?: null| undefined| ''|);/;

    const lines = [];
    let foundAnyReplacement = false;
    for (let idx = 0; idx < trigger[field].length; ++idx) {
      const line = trigger[field][idx];
      if (!returnAnything.test(line)) {
        lines.push(trigger[field][idx]);
        continue;
      }
      if (returnNothing.test(line)) {
        lines.push(trigger[field][idx]);
        continue;
      }
      if (!returnObj.test(line)) {
        console.log('    tricky return');
        for (const field in trigger)
          appendLine(trigger[field]);
        return;
      }

      const nextLine = trigger[field][idx + 1];
      if (!/^\s*en: /.test(nextLine)) {
        console.log('    unknown translation line');
        for (const field in trigger)
          appendLine(trigger[field]);
        return;
      }

      const collect = [];
      idx++;
      while (idx < trigger[field].length) {
        const collectLine = trigger[field][idx];

        // Translation line.
        if (/^\s*\w{2}: /.test(collectLine)) {
          collect.push(collectLine);
          idx++;
          continue;
        }

        // Object close.
        if (/^\s*};/.test(collectLine))
          break;

        // Unknown???
        console.log('    unknown translation close');
        for (const field in trigger)
          appendLine(trigger[field]);
        return;
      }

      const params = convertLinesIntoParams(collect);
      let outputName = makeOutputName(collect);
      if (params === null || outputName === null) {
        console.log('    bad params');
        for (const field in trigger)
          appendLine(trigger[field]);
        return;
      }

      const baseOutputName = outputName;
      let suffix = 2;
      while (translations[outputName]) {
        outputName = `${baseOutputName}${suffix}`;
        suffix++;
      }

      translations[outputName] = collect;
      lines.push(line.replace(returnObj, `return output.${outputName}(${params});`));

      console.log(`    replacing output ${field}`);
      foundAnyReplacement = true;
      numReplacements++;
    }

    if (foundAnyReplacement) {
      triggerInfo[field].replacement = lines;

      const firstLine = lines[0];

      // Add output parameter to function header.
      if (/\(data\)/.test(firstLine)) {
        lines[0] = firstLine.replace(/\(data\)/, '(data, _, output)');
      } else if (/\(data, matches\)/.test(firstLine)) {
        lines[0] = firstLine.replace(/\(data, matches\)/, '(data, matches, output)');
      } else {
        console.log(`    unknown function line: ${firstLine}`);
        for (const field in trigger)
          appendLine(trigger[field]);
        return;
      }
    }
  }


  // If there's only one, change it to `output.text()`.
  if (numReplacements === 1) {
    const translationKeys = Object.keys(translations);
    const oldName = translationKeys[0];

    translations.text = translations[oldName];
    delete translations[oldName];

    for (const field in triggerInfo) {
      if (!triggerInfo[field].replacement)
        continue;
      const lines = [];
      for (const line of triggerInfo[field].replacement)
        lines.push(line.replace(/\boutput\.\w*\(/, 'output.text('));

      triggerInfo[field].replacement = lines;
      break;
    }
  }

  // Append replacement lines as needed.
  for (const field in trigger) {
    if (!triggerInfo[field] || !triggerInfo[field].replacement) {
      appendLine(trigger[field]);
      continue;
    }

    appendLine(triggerInfo[field].replacement);
  }

  if (numReplacements === 0)
    return;

  // Append additional outputStrings block if any were needed.
  appendLine('      outputStrings: {');
  for (const key in translations) {
    appendLine(`        ${key}: {`);
    for (const line of translations[key])
      appendLine(line.replace(/^\s*/, '          '));
    appendLine(`        },`);
  }
  appendLine(`      },`);
};

rl.on('line', (line) => {
  if (handle) {
    handle(line);
    return;
  }

  if (!triggerIdRe.test(line)) {
    appendLine(line);
    return;
  }

  // Starting new trigger.  Reset data.
  trigger = {};

  handle = (line) => {
    if (triggerFinishRe.test(line)) {
      handle = null;
      processTrigger(trigger);
      appendLine(line);
      return;
    }

    // New trigger field?
    const matches = line.match(triggerFieldRe);
    if (matches) {
      const key = matches[1];
      trigger[key] = [line];
      return;
    }

    // More lines for an existing trigger field.
    const keys = Object.keys(trigger);
    trigger[keys[keys.length - 1]].push(line);
  };
  handle(line);
});

rl.on('close', () => {
  fs.writeFile(fileName, text, (err) => {
    if (err)
      console.error(err);
  });
});
