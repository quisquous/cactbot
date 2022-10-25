import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

import { Namespace, SubParser } from 'argparse';
import inquirer from 'inquirer';

import { isLang, Lang, languages } from '../resources/languages';
import { UnreachableCode } from '../resources/not_reached';

import { walkDirSync } from './file_utils';
import { findMissing } from './find_missing_timeline_translations';

import { ActionChoiceType } from '.';

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
const findAllJavascriptFiles = (filter: string): string[] => {
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
// TODO: this should just leverage eval
const parseJavascriptFile = (file: string, inputLocales: Lang[]) => {
  const locales = new Set(inputLocales);

  const lineCounter = ((i = 0) => () => i++)();

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

  lineReader.on('line', (line, idx = lineCounter()) => {
    // Immediately exit if the file is auto-generated
    if (line.match('// Auto-generated')) {
      lineReader.close();
      lineReader.removeAllListeners();
    }

    // Any time we encounter what looks like a new object, start over.
    // FIXME: this deliberately simplifies and will ignore nested objects.
    // That's what we get for parsing javascript with regex.
    const m = line.match(openObjRe);
    if (m) {
      openMatch = m;
      // idx is zero-based, but line numbers are not.
      lineNumber = idx + 1;
      keys = [];
      fixme = [];
      foundIgnore = false;
      return;
    }

    // If we're not inside an object, keep looking for the start of one.
    const openMatchValue = openMatch?.[1];
    if (!openMatch || openMatchValue === undefined)
      return;

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
          return;

        // Only some locales care about zoneRegex, so special case.
        if (openStr === 'zoneRegex: {')
          nonZoneregexLocales.forEach((lang: Lang) => missingKeys.delete(lang));

        if (missingKeys.size > 0) {
          let err = `${file}:${lineNumber} "${openStr}"`;
          if (locales.size > 1)
            err += ` ${[...missingKeys].join(',')}`;
          console.log(err);
        }
      }
      openMatch = undefined;
      return;
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
  });
};

const findMissingTranslations = async (filter: string, locale: Lang): Promise<void> => {
  const files = findAllJavascriptFiles(filter);
  for (const file of files) {
    await findMissing(
      file,
      locale,
      (file: string, line: number | undefined, label: string | undefined, message: string) => {
        let str = file;
        if (line)
          str += `:${line}`;
        if (label !== undefined)
          str += ` ${label}`;
        if (message)
          str += ` ${message}`;
        console.log(str);
      },
    );
    parseJavascriptFile(file, [locale]);
  }
};

type FindMissingTranslationsNamespaceInterface = {
  'filter': string | null;
  'locale': string | null;
};

class FindMissingTranslationsNamespace extends Namespace implements FindMissingTranslationsNamespaceInterface {
  'filter': string | null;
  'locale': string | null;
}

type FindMissingTranslationsInquirerType = {
  [name in keyof FindMissingTranslationsNamespaceInterface]: FindMissingTranslationsNamespaceInterface[name];
};

const findMissingTranslationsFunc = (args: Namespace): Promise<void> => {
  if (!(args instanceof FindMissingTranslationsNamespace))
    throw new UnreachableCode();
  const questions = [
    {
      type: 'fuzzypath',
      name: 'filter',
      message: 'Input a valid trigger JavaScript filename: ',
      rootPath: 'ui',
      suggestOnly: true,
      default: args.filter ?? '',
      when: () => typeof args.filter !== 'string',
    },
    {
      type: 'list',
      name: 'locale',
      message: 'Select a locale: ',
      choices: languages,
      default: args.locale,
      when: () => typeof args.locale !== 'string',
    },
  ] as const;
  return inquirer.prompt<FindMissingTranslationsInquirerType>(questions)
    .then((answers) => {
      const filter = answers.filter ?? args.filter;
      const locale = answers.locale ?? args.locale;
      if (typeof filter === 'string' && typeof locale === 'string' && isLang(locale))
        return findMissingTranslations(filter, locale);
    });
};

export const registerFindMissingTranslations = (
  actionChoices: ActionChoiceType,
  subparsers: SubParser,
): void => {
  actionChoices.findTranslations = {
    name: 'Find missing translations',
    callback: findMissingTranslationsFunc,
    namespace: FindMissingTranslationsNamespace,
  };
  const findParser = subparsers.addParser('findTranslations', {
    description: actionChoices.findTranslations.name,
  });

  findParser.addArgument(['-l', '--locale'], {
    help: 'The locale to find missing translations for, e.g. de',
  });
  findParser.addArgument(['-f', '--filter'], {
    nargs: '?',
    type: 'string',
    help: 'Limits the results to only match specific files/path',
  });
};
