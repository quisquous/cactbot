import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { walkDirSync } from './file_utils';

const timelineLineRegexes = {
  startsUsing: /:([0-9A-F\[\]\(\)\|]+):([^:]+)/,
  ability: /sync \/:([^:]+):([0-9A-F\(\)\|]+)/,
  gainsEffect: /1A:.......:(.+) gains the effect of (.+)( from)?/,
  addedCombatant: /Added new combatant (.*$)/,
  gameLog: /\s*00:([0-9]*):(.*$)/,
  targetable: / sync \/\s?22:........:([^:]+):/,
};

const files = [];

const knownSkipLines = [
  'hideall',
  '0 "--reset--"',
  '0 "--Reset--"',
  '/Engage!/',
  '/:Engage!/',
  '/:Engage!:/',
];

walkDirSync('../ui/raidboss', (path) => filterTextFiles(path));

function filterTextFiles(input) {
  if (input.includes('.txt'))
    files.push(input);
}

function isRawLineSkip(line) {
  let skip = false;
  for (const el of knownSkipLines) {
    if (line.includes(el))
      skip = true;
  }
  if (line[0] === '#' || line === '')
    skip = true;
  return skip;
}

function fixSealLine(line) {
  return line.replace(/0839:/, '0839::');
}

function isLineSync(line) {
  return line.match(/sync \/([^\/]+)\//);
}

function isLineEntryType(line, type) {
  return line.match(timelineLineRegexes[type]);
}

function findLineEntryType(line) {
  for (const key of Object.keys(timelineLineRegexes)) {
    if (isLineEntryType(line, key))
      return key;
  }
  return false;
}

const badFileNames = [];
const allProblems = {};

for (const file of files) {
  // This one should be manually handled.
  if (file === '../ui/raidboss/data/00-misc/test.txt')
    continue;
  const reader = readline.createInterface({
    input: fs.createReadStream(file),
  });
  reader.on('line', (line) => {
    // Don't bother parsing non-convertible lines.
    if (isRawLineSkip(line))
      return;
    // Check whether the line is known. If it is, it can be auto-converted,
    // and therefore skipped.
    const type = findLineEntryType(line);
    // If the line has a sync *and* an unknown type, we need to know.
    if (isLineSync(line) && !type) {
      const name = file.slice(file.lastIndexOf('/') + 1, file.lastIndexOf('.'));
      allProblems[name] = allProblems[name] || [];
      allProblems[name].push(line);
      if (!badFileNames.includes(name))
        badFileNames.push(name);
    }
  });
  reader.on('close', () => {
    // Messy nonsense because I can't brain today
    if (files.indexOf(file) === files.length - 1) {
      for (const el of badFileNames) {
        const name = el.slice(el.lastIndexOf('/') + 1);
        console.log(name);
      }
      console.log(allProblems);
    }
  });
}
