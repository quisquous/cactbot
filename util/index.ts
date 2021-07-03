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

const dataFilesMap = {
  'effect_id.ts': generateEffectIds,
} as const;

inquirer.registerPrompt('fuzzypath', inquirerFuzzyPath);

const run = () => {
  inquirer.prompt([{
    type: 'list',
    name: 'action',
    message: 'What do you want to do?',
    choices: [
      'Generate common data files',
      'Translate Raidboss timeline',
      'Find missing translations',
    ],
  }]).then((answer: Answers) => {
    if (answer.action === 'Generate common data files')
      return generateDataFiles();
    if (answer.action === 'Translate Raidboss timeline')
      return translateTimelineFunc();
    if (answer.action === 'Find Raidboss missing translations')
      return findMissingTranslationsFunc();
  }).catch(console.error);
};

const generateDataFiles = () => {
  return inquirer.prompt([{
    type: 'list',
    name: 'choice',
    message: 'Which data file do you want to generate?',
    choices: Object.keys(dataFilesMap),
  }]).then((answers: Answers) => {
    if (answers.choice in dataFilesMap)
      return dataFilesMap[answers.choice as keyof typeof dataFilesMap]?.();
  });
};

const translateTimelineFunc = () => {
  return inquirer.prompt([
    {
      type: 'fuzzypath',
      name: 'timeline',
      message: 'Input a valid timeline filename: ',
      rootPath: 'ui/raidboss/data',
    },
    {
      type: 'list',
      name: 'locale',
      message: 'Select a locale: ',
      choices: languages,
    },
  ]).then((answers: Answers) => {
    if (answers.timeline && answers.locale)
      return translateTimeline(answers as { timeline: string; locale: Lang });
  });
};

const findMissingTranslationsFunc = () => {
  return inquirer.prompt([
    {
      type: 'fuzzypath',
      name: 'filter',
      message: 'Input a valid trigger JavaScript filename: ',
      rootPath: 'ui/raidboss/data',
    },
    {
      type: 'list',
      name: 'locale',
      message: 'Select a locale: ',
      choices: languages,
    },
  ]).then((answers: Answers) => {
    if (answers.filter && answers.locale)
      return findMissingTranslations(answers);
  });
};

run();
