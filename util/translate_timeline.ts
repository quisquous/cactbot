import fs from 'fs';
import path from 'path';

import { Namespace, SubParser } from 'argparse';
import inquirer from 'inquirer';

import { isLang, Lang, languages } from '../resources/languages';
import { UnreachableCode } from '../resources/not_reached';
import { LooseTriggerSet } from '../types/trigger';
import Options from '../ui/raidboss/raidboss_options';
import { TimelineParser } from '../ui/raidboss/timeline_parser';

import { walkDirSync } from './file_utils';
import { findMissing } from './find_missing_timeline_translations';

import { ActionChoiceType } from '.';

const rootDir = 'ui/raidboss/data';

const findTriggersFile = (shortName: string): string | undefined => {
  // strip extensions if provided.
  shortName = shortName.replace(/\.(?:[jt]s|txt)$/, '').split(path.sep).join(path.posix.sep);

  let found = undefined;
  walkDirSync(rootDir, (filename) => {
    if (filename.endsWith(`${shortName}.js`) || filename.endsWith(`${shortName}.ts`))
      found = filename;
  });
  return found;
};

const translateTimeline = async (timelinePath: string, locale: Lang): Promise<void> => {
  const triggersFile = findTriggersFile(timelinePath);
  if (triggersFile === undefined) {
    console.error(`Couldn\'t find '${timelinePath}', aborting.`);
    process.exit(-2);
  }

  const timelineFile = triggersFile.replace(/\.[jt]s$/, '.txt');
  if (!fs.existsSync(timelineFile)) {
    console.error(`Couldn\'t find '${timelineFile}', aborting.`);
    process.exit(-2);
  }

  // Use findMissing to figure out which lines have errors on them.
  const syncErrors: { [lineNumber: number]: boolean } = {};
  const textErrors: { [lineNumber: number]: boolean } = {};
  await findMissing(triggersFile, locale, (filename, lineNumber, label, _message) => {
    if (!filename.endsWith('.txt') || !lineNumber)
      return;
    if (label === 'text')
      textErrors[lineNumber] = true;
    else if (label === 'sync')
      syncErrors[lineNumber] = true;
  });

  // TODO: this block is very duplicated with a number of other scripts.
  const importPath = `../${path.relative(process.cwd(), triggersFile).replace('.ts', '.js')}`;
  // TODO: Fix dynamic imports in TypeScript
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const triggerSet = (await import(importPath))?.default as LooseTriggerSet;
  const replacements = triggerSet.timelineReplace ?? [];
  const timelineText = fs.readFileSync(timelineFile).toString();

  // Use Timeline to figure out what the replacements will look like in game.
  const options = { ...Options, ParserLanguage: locale, TimelineLanguage: locale };
  const timeline = new TimelineParser(timelineText, replacements, [], [], options);

  const translated = TimelineParser.Translate(timeline, timelineText, syncErrors, textErrors);
  for (const line of translated)
    console.log(line);
};

type TranslateTimelineNamespaceInterface = {
  'timeline': string | null;
  'locale': string | null;
};

class TranslateTimelineNamespace extends Namespace implements TranslateTimelineNamespaceInterface {
  'timeline': string | null;
  'locale': string | null;
}

type TranslateTimelineInquirerType = {
  [name in keyof TranslateTimelineNamespaceInterface]: TranslateTimelineNamespaceInterface[name];
};

const translateTimelineFunc = (args: Namespace): Promise<void> => {
  if (!(args instanceof TranslateTimelineNamespace))
    throw new UnreachableCode();
  const questions = [
    {
      type: 'fuzzypath',
      excludeFilter: (path: string) => !path.endsWith('.txt'),
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
      default: args.locale,
      when: () => typeof args.locale !== 'string',
    },
  ] as const;
  return inquirer.prompt<TranslateTimelineInquirerType>(questions)
    .then((answers) => {
      const timeline = answers.timeline ?? args.timeline;
      const locale = answers.locale ?? args.locale;
      if (typeof timeline === 'string' && typeof locale === 'string' && isLang(locale))
        return translateTimeline(timeline, locale);
    });
};

export const registerTranslateTimeline = (
  actionChoices: ActionChoiceType,
  subparsers: SubParser,
): void => {
  actionChoices.translateTimeline = {
    name: 'Translate Raidboss timeline',
    callback: translateTimelineFunc,
    namespace: TranslateTimelineNamespace,
  };
  const translateParser = subparsers.addParser('translateTimeline', {
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
};
