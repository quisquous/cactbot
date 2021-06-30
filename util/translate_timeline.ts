import fs from 'fs';
import path from 'path';

import { ArgumentParser } from 'argparse';

import { Lang } from '../resources/languages';
import { LooseTriggerSet } from '../types/trigger';
import Options from '../ui/raidboss/raidboss_options';
import { Event, Sync, Timeline } from '../ui/raidboss/timeline';

import { walkDirSync } from './file_utils';
import { findMissing } from './find_missing_timeline_translations';

const parser = new ArgumentParser({
  addHelp: true,
  description: 'Prints out a translated timeline, with annotations on missing texts and syncs',
});
parser.addArgument(['-l', '--locale'], {
  required: true,
  type: 'string',
  help: 'The locale to translate the timeline for, e.g. de',
});
parser.addArgument(['-t', '--timeline'], {
  required: true,
  type: 'string',
  help: 'The timeline file to match, e.g. "a12s"',
});

const rootDir = 'ui/raidboss/data';

const findTriggersFile = (shortName: string): string | undefined => {
  // strip extensions if provided.
  shortName = shortName.replace(/\.(?:[jt]s|txt)$/, '');

  let found = undefined;
  walkDirSync(rootDir, (filename) => {
    if (filename.endsWith(`${shortName}.js`) || filename.endsWith(`${shortName}.ts`))
      found = filename;
  });
  return found;
};

const run = async (args: { locale: Lang; timeline: string }) => {
  if (!process.argv[1]) {
    console.error('Unable to determine current process filepath, aborting.');
    process.exit(-2);
  }
  process.chdir(path.join(path.dirname(process.argv[1]), '..'));

  const triggersFile = findTriggersFile(args.timeline);
  if (!triggersFile) {
    console.error(`Couldn\'t find '${args.timeline}', aborting.`);
    process.exit(-2);
  }

  const timelineFile = triggersFile.replace(/\.[jt]s$/, '.txt');
  if (!fs.existsSync(timelineFile)) {
    console.error(`Couldn\'t find '${timelineFile}', aborting.`);
    process.exit(-2);
  }

  const locale = args.locale;

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
  const timeline = new Timeline(timelineText, replacements, [], [], options);
  const lineToText: { [lineNumber: number]: Event } = {};
  const lineToSync: { [lineNumber: number]: Sync } = {};
  for (const event of timeline.events) {
    if (!event.lineNumber)
      continue;
    lineToText[event.lineNumber] = event;
  }
  for (const event of timeline.syncStarts)
    lineToSync[event.lineNumber] = event;

  // Combine replaced lines with errors.
  const timelineLines = timelineText.split(/\n/);
  timelineLines.forEach((timelineLine, idx) => {
    const lineNumber = idx + 1;
    let line = timelineLine.trim();

    const lineText = lineToText[lineNumber];
    if (lineText)
      line = line.replace(` "${lineText.name}"`, ` "${lineText.text}"`);
    const lineSync = lineToSync[lineNumber];
    if (lineSync)
      line = line.replace(`sync /${lineSync.origRegexStr}/`, `sync /${lineSync.regex.source}/`);

    if (syncErrors[lineNumber])
      line += ' #MISSINGSYNC';
    if (textErrors[lineNumber])
      line += ' #MISSINGTEXT';
    console.log(line);
  });
};

const args = parser.parseArgs() as { locale: Lang; timeline: string };
void run(args);
