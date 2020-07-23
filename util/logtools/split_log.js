'use strict';

let fs = require('fs');
let Anonymizer = require('./anonymizer.js');
let Splitter = require('./splitter.js');
let encounterTools = require('./encounter_tools.js');
let EncounterCollector = encounterTools.EncounterCollector;
let ZoneId = require('../../resources/zone_id.js');
let argparse = require('argparse');

// TODO: add options for not splitting / not anonymizing.
let parser = new argparse.ArgumentParser({
  addHelp: true,
});
parser.addArgument(['-f', '--file'], {
  required: true,
  help: 'File to analyze',
});
parser.addArgument(['-lf', '--search-fights'], {
  nargs: '?',
  defaultValue: '-1',
  type: 'int',
  help: 'Fight in log to use, e.g. \'1\'. ' +
    'If no number is specified, returns a list of fights.',
});
parser.addArgument(['-lz', '--search-zones'], {
  nargs: '?',
  defaultValue: '-1',
  type: 'int',
  help: 'Zone in log to use, e.g. \'1\'. ' +
    'If no number is specified, returns a list of zones.',
});

const args = parser.parseArgs();

// -1 implies not included
// null implies included but no value
if (args['search_fights'] === -1 && args['search_zones'] === -1) {
  console.error('Error: Must specify one of -lf or -lz\n');
  parser.printHelp();
  process.exit(-1);
}
if (args['search_fights'] !== -1 && args['search_zones'] !== -1) {
  console.error('Error: Must specify exactly one of -lf or -lz\n');
  parser.printHelp();
  process.exit(-1);
}

const logFileName = args.file;
let exitCode = 0;
const errorFunc = (str) => {
  console.error(str);
  exitCode = 1;
};

const timeFromDate = (date) => {
  return date.toISOString().slice(11, 19);
};

const dayFromDate = (date) => {
  return date.toISOString().slice(0, 10);
};

const durationFromDates = (start, end) => {
  const ms = end - start;
  const totalSeconds = Math.round(ms / 1000);

  let str = '';
  const totalMinutes = Math.floor(totalSeconds / 60);
  if (totalMinutes > 0)
    str += totalMinutes + 'm';
  str += (totalSeconds % 60) + 's';
  return str;
};

const toProperCase = (str) => {
  return str.split(' ').map((str) => {
    return str[0].toUpperCase() + str.slice(1);
  }).join(' ');
};

const generateFileName = (fightOrZone) => {
  const zoneId = parseInt(fightOrZone.zoneId, 16);
  const dateStr = dayFromDate(fightOrZone.startTime).replace(/-/g, '');
  const timeStr = timeFromDate(fightOrZone.startTime).replace(/:/g, '');
  const duration = durationFromDates(fightOrZone.startTime, fightOrZone.endTime);
  let seal = fightOrZone.sealName;
  if (seal)
    seal = '_' + toProperCase(seal).replace(/[^A-z0-9]/g, '');
  else
    seal = '';

  let idToZoneName = {};
  for (let zoneName in ZoneId)
    idToZoneName[ZoneId[zoneName]] = zoneName;
  const zoneName = idToZoneName[zoneId];

  const wipeStr = fightOrZone.endType === 'Wipe' ? '_wipe' : '';
  return `${zoneName}${seal}_${dateStr}_${timeStr}_${duration}${wipeStr}.log`;
};

// For an array of arrays, return an array where each value is the max length at that index
// among all of the inner arrays, e.g. find the max length per field of an array of rows.
const maxLengthPerIndex = (outputRows) => {
  const outputSizes = outputRows.map((row) => row.map((field) => field.length));
  return outputSizes.reduce((max, row) => {
    return max.map((val, idx) => Math.max(val, row[idx]));
  });
};

const leftExtendStr = (row, lengths, idx) => {
  let str = row[idx];
  while (str.length < lengths[idx])
    str = ' ' + str;
  return str;
};

const rightExtendStr = (row, lengths, idx) => {
  let str = row[idx];
  while (str.length < lengths[idx])
    str += ' ';
  return str;
};

const printCollectedZones = (collector) => {
  let idx = 1;
  let outputRows = [];
  for (const zone of collector.zones) {
    outputRows.push([
      idx.toString(),
      dayFromDate(zone.startTime),
      timeFromDate(zone.startTime),
      durationFromDates(zone.startTime, zone.endTime),
      zone.name,
    ]);
    idx++;
  }

  const lengths = maxLengthPerIndex(outputRows);

  const dateIdx = 1;
  let lastDate = null;
  for (const row of outputRows) {
    if (row[dateIdx] !== lastDate) {
      lastDate = row[dateIdx];
      console.log(lastDate);
    }

    console.log('  ' +
      leftExtendStr(row, lengths, 0) + ') ' +
      leftExtendStr(row, lengths, 2) + ' ' +
      leftExtendStr(row, lengths, 3) + ' ' +
      rightExtendStr(row, lengths, 4));
  }
};

const printCollectedFights = (collector) => {
  let idx = 1;
  let outputRows = [];
  let seenSeal = false;
  let lastDate = null;
  for (const fight of collector.fights) {
    // Add a zone name row when there's seal messages for clarity.
    if (!seenSeal && fight.sealName) {
      outputRows.push(['', '', '', '', '~' + fight.name + '~', '']);
      seenSeal = true;
    } else if (seenSeal && !fight.sealName) {
      seenSeal = false;
    }
    if (!lastDate)
      lastDate = dayFromDate(fight.startTime);
    outputRows.push([
      idx.toString(),
      dayFromDate(fight.startTime),
      timeFromDate(fight.startTime),
      durationFromDates(fight.startTime, fight.endTime),
      fight.sealName ? fight.sealName : fight.name,
      fight.endType,
    ]);
    idx++;
  }

  const lengths = maxLengthPerIndex(outputRows);

  const dateIdx = 1;
  console.log(lastDate);

  for (const row of outputRows) {
    if (row[dateIdx] && row[dateIdx] !== lastDate) {
      lastDate = row[dateIdx];
      console.log(lastDate);
    }

    console.log('  ' +
      leftExtendStr(row, lengths, 0) + (row[0] ? ') ' : '  ') +
      leftExtendStr(row, lengths, 2) + ' ' +
      leftExtendStr(row, lengths, 3) + ' ' +
      rightExtendStr(row, lengths, 4) +
      (row[5] ? (' ' + '[' + row[5] + ']') : ''));
  }
};

// No top-level await, so wrap everything an async function.  <_<
(async function() {
  const makeCollectorFromPrepass = async (filename) => {
    let collector = new EncounterCollector();
    let lineReader = require('readline').createInterface({
      input: fs.createReadStream(filename),
    });
    for await (const line of lineReader) {
      // TODO: this could be more efficient if it stopped when it found the requested encounter.
      collector.process(line);
    }
    return collector;
  };

  const collector = await makeCollectorFromPrepass(logFileName);

  if (args['search_fights'] === null) {
    printCollectedFights(collector);
    process.exit(0);
  }
  if (args['search_zones'] === null) {
    printCollectedZones(collector);
    process.exit(0);
  }

  class ConsoleNotifier {
    warn(reason, splitLine) {
      if (typeof splitLine === 'undefined')
        errorFunc(this.fileName + ': ' + reason);
      else
        errorFunc(this.fileName + ': ' + reason + ': ' + splitLine.join('|'));
    }
  }

  let notifier = new ConsoleNotifier();
  let anonymizer = new Anonymizer();

  let lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(logFileName),
  });

  let startLine = null;
  let endLine = null;
  let outputFile = null;
  // This utility prints 1-indexed fights and zones, so adjust - 1.
  if (args['search_fights'] !== -1) {
    let fight = collector.fights[args['search_fights'] - 1];
    startLine = fight.startLine;
    endLine = fight.endLine;
    outputFile = generateFileName(fight);
  } else {
    let zone = collector.zones[args['search_zones'] - 1];
    startLine = zone.startLine;
    endLine = zone.endLine;
    outputFile = generateFileName(zone);
  }

  // This will fail if the file already exists.
  let writer = fs.createWriteStream(outputFile, { flags: 'wx' });
  writer.on('error', (err) => {
    errorFunc(err);
    process.exit(-1);
  });

  let splitter = new Splitter(startLine, endLine);

  let lines = [];
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

    anonymizer.validateIds();
    for (const line of lines)
      anonymizer.validateLine(line);

    process.exit(exitCode);
  });
}());
