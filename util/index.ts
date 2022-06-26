import { ArgumentParser, Namespace } from 'argparse';
import inquirer from 'inquirer';
import inquirerFuzzyPath, { FuzzyPathQuestionOptions } from 'inquirer-fuzzy-path';

import { registerFindMissingTranslations } from './find_missing_translations';
import { registerGenerateDataFiles } from './generate_data_files';
import { registerTestTimeline } from './test_timeline';
import { registerTranslateTimeline } from './translate_timeline';

declare module 'inquirer' {
  interface QuestionMap<T> {
    fuzzypath: FuzzyPathQuestionOptions<T>;
  }
}

export type ActionChoiceType = {
  [key: string]: {
    name: string;
    callback: (args: Namespace) => Promise<void> | void;
    namespace: typeof Namespace;
  };
};

const actionChoices: ActionChoiceType = {};

const argumentParser = new ArgumentParser({
  description: 'A collection of common util functions for developing cactbot.',
});
const subparsers = argumentParser.addSubparsers({
  title: 'action',
  help: 'sub-command help',
  dest: 'action',
});

registerTranslateTimeline(actionChoices, subparsers);
registerGenerateDataFiles(actionChoices, subparsers);
registerFindMissingTranslations(actionChoices, subparsers);
registerTestTimeline(actionChoices, subparsers);

inquirer.registerPrompt('fuzzypath', inquirerFuzzyPath);

type UtilNamespaceInterface = {
  'action': string | null;
};

class UtilNamespace extends Namespace implements UtilNamespaceInterface {
  'action': string | null;
}

type UtilInquirerType = {
  [name in keyof UtilNamespaceInterface]: UtilNamespaceInterface[name];
};

const utilArgs = new UtilNamespace({});

const run = (args: UtilNamespace): Promise<unknown> => {
  const questions = [
    {
      type: 'list',
      name: 'action',
      message: 'What do you want to do?',
      choices: Object.entries(actionChoices).map((e) => {
        const [key, value] = e;
        return {
          name: value.name,
          value: key,
        };
      }),
      default: args.action,
      when: () => typeof args.action !== 'string',
    },
  ] as const;
  return inquirer.prompt<UtilInquirerType>(questions).then((answer) => {
    const action = answer.action ?? args.action;
    if (action === null)
      return;
    const actionMap = actionChoices[action];
    if (actionMap === undefined)
      return;
    const reparsedArgs = new actionMap.namespace({});
    if (process.argv.length > 2)
      argumentParser.parseArgs(undefined, reparsedArgs);
    return actionMap.callback(reparsedArgs);
  }).catch(console.error);
};

if (process.argv.length > 2)
  argumentParser.parseArgs(undefined, utilArgs);

void run(utilArgs);
