import { Namespace, SubParser } from 'argparse';
import inquirer from 'inquirer';

import { UnreachableCode } from '../resources/not_reached';

import { default as generateEffectIds } from './gen_effect_id';
import { default as generatePetNames } from './gen_pet_names';

import { ActionChoiceType } from '.';

const genKeys = ['effect_id', 'pet_names'] as const;
type GenKeysType = typeof genKeys[number];

const dataFilesMap: { [filename in GenKeysType]: () => Promise<void> } = {
  'effect_id': generateEffectIds,
  'pet_names': generatePetNames,
} as const;

type GenerateDataFilesNamespaceInterface = {
  'choice': GenKeysType | null;
};

class GenerateDataFilesNamespace extends Namespace implements GenerateDataFilesNamespaceInterface {
  'choice': GenKeysType | null;
}

type GenerateDataFilesInquirerType = {
  [name in keyof GenerateDataFilesNamespaceInterface]: GenerateDataFilesNamespaceInterface[name];
};

const generateDataFilesFunc = async (args: Namespace): Promise<void> => {
  if (!(args instanceof GenerateDataFilesNamespace))
    throw new UnreachableCode();
  const questions = [
    {
      type: 'list',
      name: 'choice',
      message: 'Which data file do you want to generate?',
      choices: Object.keys(dataFilesMap),
      default: args.choice,
      when: () => typeof args.choice !== 'string',
    },
  ] as const;
  return inquirer.prompt<GenerateDataFilesInquirerType>(questions)
    .then((answers) => {
      if (typeof answers.choice === 'string' && answers.choice in dataFilesMap)
        return dataFilesMap[answers.choice]?.();
    });
};

export const registerGenerateDataFiles = (
  actionChoices: ActionChoiceType,
  subparsers: SubParser,
): void => {
  actionChoices.generate = {
    name: 'Generate common data files',
    callback: generateDataFilesFunc,
    namespace: GenerateDataFilesNamespace,
  };
  const generateParser = subparsers.addParser('generate', {
    description: actionChoices.generate.name,
  });

  generateParser.addArgument(['-c', '--choice'], {
    choices: Object.keys(dataFilesMap),
  });
};
