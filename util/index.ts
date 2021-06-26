import inquirer, { Answers } from 'inquirer';
import inquirerFuzzyPath, { FuzzyPathQuestionOptions } from 'inquirer-fuzzy-path';

import { Lang } from '../resources/languages';

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
      'Generate data files',
      'Translate timeline',
    ],
  }]).then((answer: Answers) => {
    if (answer.action === 'Generate data files')
      return generateDataFiles();
    if (answer.action === 'Translate timeline')
      return translateTimelineFunc();
  }).catch(console.error);
};

const generateDataFiles = async () => {
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

const translateTimelineFunc = async () => {
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
      choices: [
        'de',
        'fr',
        'ja',
        'cn',
        'ko',
      ],
    },
  ]).then((answers: Answers) => {
    if (answers.timeline && answers.locale)
      return translateTimeline(answers as { timeline: string; locale: Lang });
  });
};

run();
