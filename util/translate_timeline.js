import fs from 'fs';
import path from 'path';
import { ArgumentParser } from 'argparse';
import { findMissing } from './find_missing_timeline_translations';
import { Timeline } from '../ui/raidboss/timeline';

const parser = new ArgumentParser({
  addHelp: true,
  description: 'Prints out a translated timeline, with annotatations on missing texts and syncs',
});
parser.addArgument(['-l', '--locale'], {
  required: true,
  help: 'The locale to translate the timeline for, e.g. de',
});
parser.addArgument(['-t', '--timeline'], {
  required: true,
  type: 'string',
  help: 'The timeline file to match, e.g. "a12s"',
});

const rootDir = 'ui/raidboss/data';

// TODO: this is duplicated from find_missing_translations.js
// Do we need a util util? <_<
const walkDir = (dir, callback) => {
  if (fs.statSync(dir).isFile()) {
    callback(path.join(dir));
    return;
  }
  fs.readdirSync(dir).forEach((f) => {
    const dirPath = path.posix.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
};

const findTriggersFile = (shortName) => {
  // strip extensions if provided.
  shortName = shortName.replace(/\.(?:js|txt)$/, '');

  let found = undefined;
  walkDir(rootDir, (filename) => {
    if (filename.endsWith(`${shortName}.js`))
      found = filename;
  });
  return found;
};

const run = async (args) => {
  process.chdir(path.join(path.dirname(process.argv[1]), '..'));

  const triggersFile = findTriggersFile(args.timeline);
  if (!triggersFile) {
    console.error(`Couldn\'t find '${args.timeline}', aborting.`);
    process.exit(-2);
    return;
  }

  const timelineFile = triggersFile.replace(/\.js$/, '.txt');
  if (!fs.existsSync(timelineFile)) {
    console.error(`Couldn\'t find '${timelineFile}', aborting.`);
    process.exit(-2);
    return;
  }

  const locale = args.locale;

  // Use findMissing to figure out which lines have errors on them.
  const syncErrors = {};
  const textErrors = {};
  await findMissing(triggersFile, locale, (filename, lineNumber, label, message) => {
    if (!filename.endsWith('.txt') || !lineNumber)
      return;
    if (label === 'text')
      textErrors[lineNumber] = true;
    else if (label === 'sync')
      syncErrors[linenumber] = true;
  });

  // TODO: this block is very duplicated with a number of other scripts.
  const importPath = '../' + path.relative(process.cwd(), triggersFile).replace(/\\/g, '/');
  const triggerSet = (await import(importPath)).default;
  const replacements = triggerSet.timelineReplace;
  const timelineText = fs.readFileSync(timelineFile).toString();

  // Use Timeline to figure out what the replacements will look like in game.
  const options = { ParserLanguage: locale, TimelineLanguage: locale };
  const timeline = new Timeline(timelineText, replacements, undefined, undefined, options);
  const lineToText = {};
  const lineToSync = {};
  for (const event of timeline.events)
    lineToText[event.lineNumber] = event;
  for (const event of timeline.syncStarts)
    lineToSync[event.lineNumber] = event;

  // Combine replaced lines with errors.
  const timelineLines = timelineText.split(/\n/);
  for (let i = 0; i < timelineLines.length; ++i) {
    const lineNumber = i + 1;
    let line = timelineLines[i].trim();

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
  }
};

const args = parser.parseArgs();
void run(args);
