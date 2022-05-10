import fs from 'fs';
import readline from 'readline';
import Anonymizer from './anonymizer';
import Splitter from './splitter';
import { EncounterCollector, TLFuncs } from './encounter_tools';
import ZoneId from '../../resources/zone_id';
import argparse from 'argparse';
import { LogUtilArgParse } from './arg_parser';

// TODO: add options for not splitting / not anonymizing.
const timelineParse = new LogUtilArgParse();
const args = timelineParse.parser.parseArgs();

const printHelpAndExit = (errString) => {
  console.error(errString);
  timelineParse.parser.printHelp();
  process.exit(-1);
};

if (args.file === null && args.timeline === null)
  printHelpAndExit('Error: Must specify at least one of -f, -t\n');
let numExclusiveArgs = 0;
for (const opt of ['search_fights', 'search_zones', 'fight_regex', 'zone_regex']) {
  if (args[opt] !== null)
    numExclusiveArgs++;
}
if (numExclusiveArgs !== 1)
  printHelpAndExit('Error: Must specify exactly one of -lf, -lz, or -fr\n');
if (args['fight_regex'] === -1)
  printHelpAndExit('Error: -fr must specify a regex\n');
if (args['zone_regex'] === -1)
  printHelpAndExit('Error: -zr must specify a regex\n');

const logFileName = args.file;
let exitCode = 0;
const errorFunc = (str) => {
  console.error(str);
  exitCode = 1;
};

class ConsoleNotifier {
  warn(reason, splitLine) {
    if (typeof splitLine === 'undefined')
      errorFunc(this.fileName + ': ' + reason);
    else
      errorFunc(this.fileName + ': ' + reason + ': ' + splitLine.join('|'));
  }

  error(reason, splitLine) {
    if (typeof splitLine === 'undefined')
      errorFunc(this.fileName + ': ' + reason);
    else
      errorFunc(this.fileName + ': ' + reason + ': ' + splitLine.join('|'));
  }
}

const writeFile = (outputFile, startLine, endLine) => {
  return new Promise((resolve, reject) => {
    const notifier = new ConsoleNotifier();
    const anonymizer = new Anonymizer();

    const lineReader = readline.createInterface({
      input: fs.createReadStream(logFileName),
    });

    // If --force is not passed, this will fail if the file already exists.
    const flags = args.force === null ? 'wx' : 'w';
    const writer = fs.createWriteStream(outputFile, { flags: flags });
    writer.on('error', (err) => {
      errorFunc(err);
      process.exit(-1);
      reject();
    });

    const splitter = new Splitter(startLine, endLine, notifier);

    const lines = [];
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
(async function() {
  const makeCollectorFromPrepass = async (filename) => {
    const collector = new EncounterCollector();
    const lineReader = readline.createInterface({
      input: fs.createReadStream(filename),
    });
    for await (const line of lineReader) {
      // TODO: this could be more efficient if it stopped when it found the requested encounter.
      collector.process(line);
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
    await writeFile(TLFuncs.generateFileName(fight), fight.startLine, fight.endLine);
    process.exit(exitCode);
  } else if (args['search_zones']) {
    const zone = collector.zones[args['search_zones'] - 1];
    await writeFile(TLFuncs.generateFileName(zone), zone.startLine, zone.endLine);
    process.exit(exitCode);
  } else if (args['fight_regex']) {
    const regex = new RegExp(args['fight_regex'], 'i');
    for (const fight of collector.fights) {
      if (fight.sealName) {
        if (!fight.sealName.match(regex))
          continue;
      } else if (!fight.name.match(regex)) {
        continue;
      }
      await writeFile(TLFuncs.generateFileName(fight), fight.startLine, fight.endLine);
    }
    process.exit(exitCode);
  } else if (args['zone_regex']) {
    const regex = new RegExp(args['zone_regex'], 'i');
    for (const zone of collector.zones) {
      if (!zone.name.match(regex))
        continue;
      await writeFile(TLFuncs.generateFileName(zone), zone.startLine, zone.endLine);
    }
    process.exit(exitCode);
  } else {
    console.error('Internal error');
    process.exit(-1);
  }
}());
