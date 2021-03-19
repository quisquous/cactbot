import argparse from 'argparse';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import readline from 'readline';
import { findMissing } from './find_missing_timeline_translations';

const parser = new argparse.ArgumentParser({
  addHelp: true,
  description: 'Prints out a list of missing translations',
});
parser.addArgument(['-l', '--locale'], {
  required: true,
  help: 'The locale to find missing translations for, e.g. de',
});
parser.addArgument(['-f', '--filter'], {
  nargs: '?',
  defaultValue: '',
  type: 'string',
  help: 'Limits the results to only match specific files/path',
});

// Directory names to ignore when looking for JavaScript files.
const ignoreDirs = [
  '.git',
  'publish',
  'ThirdParty',
  'node_modules',
];

// All valid two letter locale names.
const allLocales = new Set(['en', 'cn', 'de', 'fr', 'ja', 'ko']);

// Locales that are in zoneRegex object blocks.
const zoneregexLocales = new Set(['en', 'cn', 'ko']);

// Locales that are not in zoneRegex object blocks.
const nonZoneregexLocales = new Set([...allLocales].filter((locale) => {
  return !zoneregexLocales.has(locale);
}));

// Where to start looking for files.
const basePath = () => path.dirname(path.dirname(fileURLToPath(import.meta.url)));

// Utility function to walk directories
const walkDir = (dir, callback) => {
  if (fs.statSync(dir).isFile()) {
    callback(path.posix.join(dir));
    return;
  }
  fs.readdirSync(dir).forEach((f) => {
    const dirPath = path.posix.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.posix.join(dir, f));
  });
};

// Return a list of all javascript filenames found under basePath()
const findAllJavascriptFiles = (filter) => {
  const arr = [];
  walkDir(basePath(), (filepath) => {
    if (ignoreDirs.some((str) => filepath.includes(str)))
      return;
    if (!filepath.endsWith('.js'))
      return;
    if (filter !== undefined && !filepath.includes(filter))
      return;
    arr.push(filepath);
  });
  return arr;
};

// Print missing translations in |file| for |locales|
// TODO: this should just leverage eval
const parseJavascriptFile = (file, locales) => {
  locales = new Set(locales);

  const lineCounter = ((i = 0) => () => i++)();

  const lineReader = readline.createInterface({
    input: fs.createReadStream(file),
  });

  let lineNumber = 0;
  let keys = [];
  let openMatch = null;

  const openObjRe = new RegExp('(\\s*)(.*{)\\s*');
  const keyRe = new RegExp('\\s*(\\w{2}):');

  lineReader.on('line', (line, idx = lineCounter()) => {
    // Any time we encounter what looks like a new object, start over.
    // FIXME: this deliberately simplifies and will ignore nested objects.
    // That's what we get for parsing javascript with regex.
    const m = line.match(openObjRe);
    if (m) {
      openMatch = m;
      // idx is zero-based, but line numbers are not.
      lineNumber = idx + 1;
      keys = [];
      return;
    }

    // If we're not inside an object, keep looking for the start of one.
    if (!openMatch)
      return;

    // If this object is ended with the same indentation,
    // then we've probably maybe found the end of this object.
    if (line.match(`${openMatch[1]}}`)) {
      // Check if these keys look like a translation block.
      if (keys.includes('en')) {
        const missingKeys = new Set([...locales].filter((locale) => !keys.includes(locale)));

        const openStr = openMatch[2];
        // Only some locales care about zoneRegex, so special case.
        if (openStr === 'zoneRegex: {')
          missingKeys.delete(nonZoneregexLocales);

        if (missingKeys.size > 0) {
          let err = `${file}:${lineNumber} "${openStr}"`;
          if (locales.length > 1)
            err += ` ${missingKeys}`;
          console.log(err);
        }
      }
      openMatch = null;
      return;
    }

    // If we're inside an object, find anything that looks like a key.
    const keyMatch = line.match(keyRe);
    if (keyMatch)
      keys.push(keyMatch[1]);
  });
};

const run = async (args) => {
  const files = findAllJavascriptFiles(args['filter']);
  for (const file of files) {
    await findMissing(file, args['locale']);
    parseJavascriptFile(file, [args['locale']]);
  }
};

const args = parser.parseArgs();
run(args);
