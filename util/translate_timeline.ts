import fs from 'fs';
import path from 'path';

import { Lang } from '../resources/languages';
import { LooseTriggerSet } from '../types/trigger';
import Options from '../ui/raidboss/raidboss_options';
import { TimelineParser } from '../ui/raidboss/timeline_parser';

import { walkDirSync } from './file_utils';
import { findMissing } from './find_missing_timeline_translations';

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

export default async (timelinePath: string, locale: Lang): Promise<void> => {
  const triggersFile = findTriggersFile(timelinePath);
  if (!triggersFile) {
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
  await findMissing(triggersFile, locale, (filename: string, lineNumber: number, label: string) => {
    if (!filename.endsWith('.txt') || !lineNumber)
      return;
    if (label === 'text')
      textErrors[lineNumber] = true;
    else if (label === 'sync')
      syncErrors[lineNumber] = true;
  });

  // TODO: this block is very duplicated with a number of other scripts.
  const importPath = '../' + path.relative(process.cwd(), triggersFile).replace('.ts', '.js');
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
