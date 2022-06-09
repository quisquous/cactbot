import fs from 'fs';
import readline from 'readline';

import { Namespace } from 'argparse';

import Anonymizer from './anonymizer';
import { LogUtilArgParse, TimelineArgs } from './arg_parser';
import { EncounterCollector, TLFuncs } from './encounter_tools';
import { ConsoleNotifier } from './notifier';
import Splitter from './splitter';

class SplitLogArgs extends Namespace implements TimelineArgs {
  'file': string | null;
  'force': boolean | null;
  'search_fights': number | null;
  'search_zones': number | null;
  'fight_regex': string | null;
  'zone_regex': string | null;
}

// TODO: add options for not splitting / not anonymizing.
const timelineParse = new LogUtilArgParse();

const args = new SplitLogArgs({});
timelineParse.parser.parseArgs(undefined, args);

const printHelpAndError = (errString: string): void => {
  console.error(errString);
  timelineParse.parser.printHelp();
};

if (args.file === null) {
  printHelpAndError('Error: Must specify -f\n');
  process.exit(-1);
}

let numExclusiveArgs = 0;
const exclusiveArgs: (keyof SplitLogArgs)[] = [
  'search_fights',
  'search_zones',
  'fight_regex',
  'zone_regex',
];
for (const opt of exclusiveArgs) {
  if (args[opt] !== null)
    numExclusiveArgs++;
}
if (numExclusiveArgs !== 1) {
  printHelpAndError('Error: Must specify exactly one of -lf, -lz, or -fr\n');
  process.exit(-2);
}

const logFileName = args.file;
let exitCode = 0;
const errorFunc = (str: string) => {
  console.error(str);
  exitCode = 1;
};

const writeFile = (
  outputFile: string,
  startLine: string | undefined,
  endLine: string | undefined,
) => {
  if (startLine === undefined) {
    errorFunc(`Error: missing startLine`);
    process.exit(-4);
  }
  if (endLine === undefined) {
    errorFunc(`Error: missing endLine`);
    process.exit(-4);
  }
  return new Promise((resolve: (value?: unknown) => void, reject) => {
    const notifier = new ConsoleNotifier(logFileName, errorFunc);
    const anonymizer = new Anonymizer();

    const lineReader = readline.createInterface({
      input: fs.createReadStream(logFileName),
    });

    // If --force is not passed, this will fail if the file already exists.
    const flags = args.force === null ? 'wx' : 'w';
    const writer = fs.createWriteStream(outputFile, { flags: flags });
    writer.on('error', (err: string) => {
      errorFunc(err);
      process.exit(-1);
      reject();
    });

    const splitter = new Splitter(startLine, endLine, notifier);

    const lines: string[] = [];
    lineReader.on('line', (line) => {
      splitter.processWithCallback(line, (line) => {
        const anonLine = anonymizer.process(line, notifier);
        if (typeof anonLine === 'undefined')
          return;

        lines.push(anonLine);
        writer.write(anonLine);
        writer.write('\n');
      });

      if (splitter.isDone())
        lineReader.close();
    });

    lineReader.on('close', () => {
      writer.end();
      console.log('Wrote: ' + outputFile);

      anonymizer.validateIds(notifier);
      for (const line of lines)
        anonymizer.validateLine(line, notifier);

      resolve();
    });
  });
};

// No top-level await, so wrap everything an async function.  <_<
void (async function() {
  const makeCollectorFromPrepass = async (filename: string) => {
    const collector = new EncounterCollector();
    const lineReader = readline.createInterface({
      input: fs.createReadStream(filename),
    });
    for await (const line of lineReader) {
      // TODO: this could be more efficient if it stopped when it found the requested encounter.
      collector.process(line, false);
    }
    return collector;
  };

  const collector = await makeCollectorFromPrepass(logFileName);

  if (args['search_fights'] === -1) {
    TLFuncs.printCollectedFights(collector);
    process.exit(0);
  }
  if (args['search_zones'] === -1) {
    TLFuncs.printCollectedZones(collector);
    process.exit(0);
  }

  // This utility prints 1-indexed fights and zones, so adjust - 1.
  if (args['search_fights']) {
    const fight = collector.fights[args['search_fights'] - 1];
    if (fight === undefined) {
      errorFunc(`Error: missing fight: ${args['search_fights']}`);
      process.exit(-3);
    }
    await writeFile(TLFuncs.generateFileName(fight), fight.startLine, fight.endLine);
    process.exit(exitCode);
  }

  if (args['search_zones']) {
    const zone = collector.zones[args['search_zones'] - 1];
    if (zone === undefined) {
      errorFunc(`Error: missing zone: ${args['search_zones']}`);
      process.exit(-4);
    }
    await writeFile(TLFuncs.generateFileName(zone), zone.startLine, zone.endLine);
    process.exit(exitCode);
  }

  if (args['fight_regex']) {
    const regex = new RegExp(args['fight_regex'], 'i');
    for (const fight of collector.fights) {
      if (fight.sealName) {
        if (!fight.sealName.match(regex))
          continue;
      } else if (!fight.fightName?.match(regex)) {
        continue;
      }
      await writeFile(TLFuncs.generateFileName(fight), fight.startLine, fight.endLine);
    }
    process.exit(exitCode);
  } else if (args['zone_regex']) {
    const regex = new RegExp(args['zone_regex'], 'i');
    for (const zone of collector.zones) {
      if (!zone.zoneName?.match(regex))
        continue;
      await writeFile(TLFuncs.generateFileName(zone), zone.startLine, zone.endLine);
    }
    process.exit(exitCode);
  } else {
    console.error('Internal error');
    process.exit(-1);
  }
}());
