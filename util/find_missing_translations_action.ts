import { Namespace, SubParser } from 'argparse';
import inquirer from 'inquirer';

import { isLang, languages } from '../resources/languages';
import { UnreachableCode } from '../resources/not_reached';

import { ErrorFuncType, findMissingTranslations } from './find_missing_translations';

import { ActionChoiceType } from '.';

type FindMissingTranslationsNamespaceInterface = {
  'filter': string | null;
  'locale': string | null;
};

class FindMissingTranslationsNamespace extends Namespace
  implements FindMissingTranslationsNamespaceInterface {
  'filter': string | null;
  'locale': string | null;
}

type FindMissingTranslationsInquirerType = {
  [name in keyof FindMissingTranslationsNamespaceInterface]:
    FindMissingTranslationsNamespaceInterface[name];
};

const printErrorFunc: ErrorFuncType = (file, line, type, _locale, message) => {
  let str = file;
  if (line)
    str += `:${line}`;
  str += ` [${type}]`;
  if (message)
    str += ` ${message}`;
  console.log(str);
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
        return findMissingTranslations(filter, [locale], printErrorFunc);
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
