import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

import { isLang, Lang } from '../resources/languages';

import { walkDirSync } from './file_utils';
import { findMissing } from './find_missing_timeline_translations';

export type MissingTranslationErrorType = 'sync' | 'text' | 'code' | 'other';

export type ErrorFuncType = (
  file: string,
  line: number | undefined,
  type: MissingTranslationErrorType,
  lang: Lang | Lang[],
  message: string,
) => void;

// Directory names to ignore when looking for JavaScript files.
const ignoreDirs = [
  '.git',
  'dist',
  'node_modules',
  'publish',
  'ThirdParty',
  'user',
];

// All valid two letter locale names.
const allLocales = new Set<Lang>(['en', 'cn', 'de', 'fr', 'ja', 'ko']);

// Locales that are in zoneRegex object blocks.
const zoneregexLocales = new Set<Lang>(['en', 'cn', 'ko']);

// Locales that are not in zoneRegex object blocks.
const nonZoneregexLocales = new Set<Lang>([...allLocales].filter((locale) => {
  return !zoneregexLocales.has(locale);
}));

// Where to start looking for files.
const basePath = () => path.dirname(path.dirname(fileURLToPath(import.meta.url)));

// Return a list of all javascript filenames found under basePath()
const findAllJavascriptFiles = (filter?: string): string[] => {
  const arr: string[] = [];
  walkDirSync(basePath(), (filepath) => {
    if (ignoreDirs.some((str) => filepath.includes(str)))
      return;
    if (!filepath.endsWith('.js') && !filepath.endsWith('.ts'))
      return;
    // Skip definition files, e.g. `en: T` in trigger.d.ts.
    if (filepath.endsWith('.d.ts'))
      return;
    if (filter !== undefined && !filepath.includes(filter))
      return;
    // normalize file path, handles windows vs linux separators
    arr.push(path.normalize(filepath));
  });
  return arr;
};

// Print missing translations in |file| for |locales|
const parseJavascriptFile = async (
  file: string,
  inputLocales: readonly Lang[],
  func: ErrorFuncType,
) => {
  const locales = new Set(inputLocales);

  const lineReader = readline.createInterface({
    input: fs.createReadStream(file),
  });

  let lineNumber = 0;
  let keys: string[] = [];
  let fixme: Lang[] = [];
  let openMatch: RegExpMatchArray | undefined = undefined;
  let foundIgnore = false;

  const openObjRe = /^(\s*)(.*{)\s*$/;
  const keyRe = /^\s*(\w{2}):/;
  const fixmeRe = /\/\/ FIX-?ME/;
  const ignoreRe = /cactbot-ignore-missing-translations/;

  for await (const line of lineReader) {
    lineNumber++;
    // Immediately exit if the file is auto-generated
    if (line.match('// Auto-generated')) {
      lineReader.close();
      lineReader.removeAllListeners();
      return;
    }

    // Any time we encounter what looks like a new object, start over.
    // FIXME: this deliberately simplifies and will ignore nested objects.
    // That's what we get for parsing javascript with regex.
    const m = line.match(openObjRe);
    if (m) {
      openMatch = m;
      keys = [];
      fixme = [];
      foundIgnore = false;
      continue;
    }

    // If we're not inside an object, keep looking for the start of one.
    const openMatchValue = openMatch?.[1];
    if (!openMatch || openMatchValue === undefined)
      continue;

    // If this object is ended with the same indentation,
    // then we've probably maybe found the end of this object.
    if (line.match(`${openMatchValue}}`)) {
      // Check if these keys look like a translation block.
      if (!foundIgnore && keys.includes('en')) {
        const missingKeys = new Set([...locales].filter((locale) => {
          return !keys.includes(locale) || fixme.includes(locale);
        }));

        const openStr = openMatch[2];

        if (openStr === undefined)
          continue;

        // Only some locales care about zoneRegex, so special case.
        if (openStr === 'zoneRegex: {')
          nonZoneregexLocales.forEach((lang: Lang) => missingKeys.delete(lang));

        if (missingKeys.size > 0)
          func(file, lineNumber, 'code', Array.from(missingKeys), openStr);
      }
      openMatch = undefined;
      continue;
    }

    if (line.match(ignoreRe))
      foundIgnore = true;

    // If we're inside an object, find anything that looks like a key.
    const keyMatch = line.match(keyRe);
    if (keyMatch) {
      const lang = keyMatch[1];
      if (isLang(lang)) {
        keys.push(lang);

        // Track if this line has a FIXME comment on it, so we can include it as "missing".
        if (fixmeRe.test(line))
          fixme.push(lang);
      }
    }
  }
};

export const findMissingTranslations = async (
  filter: string | undefined,
  locales: readonly Lang[],
  func: ErrorFuncType,
): Promise<void> => {
  const files = findAllJavascriptFiles(filter);
  for (const file of files) {
    for (const locale of locales) {
      await findMissing(
        file,
        locale,
        func,
      );
    }
    await parseJavascriptFile(file, locales, func);
  }
};
