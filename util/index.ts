import { ArgumentParser } from 'argparse';
import inquirer, { Answers } from 'inquirer';
import inquirerFuzzyPath, { FuzzyPathQuestionOptions } from 'inquirer-fuzzy-path';

import { Lang, languages } from '../resources/languages';

import { run as findMissingTranslations } from './find_missing_translations';
import { default as generateEffectIds } from './gen_effect_id';
import { run as translateTimeline } from './translate_timeline';

declare module 'inquirer' {
  interface QuestionMap<T> {
    fuzzypath: FuzzyPathQuestionOptions<T>;
  }
}

const dataFilesMap: { readonly [filename: string]: () => Promise<void> } = {
  'effect_id': generateEffectIds,
};

const actionChoices = {
  generate: {
    name: 'Generate common data files',
    value: 'generate',
  },
  translateTimeline: {
    name: 'Translate Raidboss timeline',
    value: 'translateTimeline',
  },
  findTranslations: {
    name: 'Find missing translations',
    value: 'findTranslations',
  },
};

const argumentParser = new ArgumentParser({
  description: 'A collection of common util functions for developing cactbot.',
});
const subparsers = argumentParser.addSubparsers({
  title: 'action',
  help: 'sub-command help',
  dest: 'action',
});

const generateParser = subparsers.addParser(actionChoices.generate.value, {
  description: actionChoices.generate.name,
});

generateParser.addArgument(['-c', '--choice'], {
  choices: Object.keys(dataFilesMap),
});

const translateParser = subparsers.addParser(actionChoices.translateTimeline.value, {
  description: actionChoices.translateTimeline.name,
});

translateParser.addArgument(['-l', '--locale'], {
  type: 'string',
  help: 'The locale to translate the timeline for, e.g. de',
});
translateParser.addArgument(['-t', '--timeline'], {
  type: 'string',
  help: 'The timeline file to match, e.g. "a12s"',
});

const findParser = subparsers.addParser(actionChoices.findTranslations.value, {
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

inquirer.registerPrompt('fuzzypath', inquirerFuzzyPath);

const run = (args: any) => {
  inquirer.prompt([{
    type: 'list',
    name: 'action',
    message: 'What do you want to do?',
    choices: Object.values(actionChoices),
    default: args.action ?? undefined,
    when: () => typeof args.action !== 'string',
  }]).then((answer: Answers) => {
    const action = answer.action || args.action;
    if (action === actionChoices.generate.value)
      return generateDataFiles(args);
    if (action === actionChoices.translateTimeline.value)
      return translateTimelineFunc(args);
    if (action === actionChoices.findTranslations.value)
      return findMissingTranslationsFunc(args);
  }).catch(console.error);
};

const generateDataFiles = (args: any) => {
  return inquirer.prompt([{
    type: 'list',
    name: 'choice',
    message: 'Which data file do you want to generate?',
    choices: Object.keys(dataFilesMap),
    default: args.choice ?? undefined,
    when: () => typeof args.choice !== 'string',
  }]).then(async (answers: Answers) => {
    if (typeof answers.choice === 'string' && answers.choice in dataFilesMap)
      return await dataFilesMap[answers.choice]?.();
  });
};

const translateTimelineFunc = (args: any) => {
  return inquirer.prompt([
    {
      type: 'fuzzypath',
      name: 'timeline',
      message: 'Input a valid timeline filename: ',
      rootPath: 'ui/raidboss/data',
      default: args.timeline ?? '',
      when: () => typeof args.timeline !== 'string',
    },
    {
      type: 'list',
      name: 'locale',
      message: 'Select a locale: ',
      choices: languages,
      default: args.locale ?? undefined,
      when: () => typeof args.locale !== 'string',
    },
  ]).then((answers: Answers) => {
    if (answers.timeline && answers.locale)
      return translateTimeline(answers as { timeline: string; locale: Lang });
  });
};

const findMissingTranslationsFunc = (args: any) => {
  return inquirer.prompt([
    {
      type: 'fuzzypath',
      name: 'filter',
      message: 'Input a valid trigger JavaScript filename: ',
      rootPath: 'ui/raidboss/data',
      default: args.filter ?? undefined,
      when: () => typeof args.filter !== 'string',
    },
    {
      type: 'list',
      name: 'locale',
      message: 'Select a locale: ',
      choices: languages,
      default: args.locale ?? undefined,
      when: () => typeof args.locale !== 'string',
    },
  ]).then((answers: Answers) => {
    if (answers.filter && answers.locale)
      return findMissingTranslations(answers);
  });
};

run(process.argv.length > 2 ? argumentParser.parseArgs() : {});
