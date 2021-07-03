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

const dataFilesMap: { readonly [filename: string]: Promise<void> } = {
  'effect_id.ts': generateEffectIds,
};

inquirer.registerPrompt('fuzzypath', inquirerFuzzyPath);

const run = () => {
  inquirer.prompt([{
    type: 'list',
    name: 'action',
    message: 'What do you want to do?',
    choices: [
      { name: 'Generate common data files', value: 'generate' },
      { name: 'Translate Raidboss timeline', value: 'translateTimeline' },
      { name: 'Find missing translations', value: 'findTranslations' },
    ],
  }]).then((answer: Answers) => {
    if (answer.action === 'generate')
      return generateDataFiles();
    if (answer.action === 'translateTimeline')
      return translateTimelineFunc();
    if (answer.action === 'findTranslations')
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
      return dataFilesMap[answers.choice]?.();
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
