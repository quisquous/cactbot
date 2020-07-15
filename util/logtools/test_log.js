'use strict';

let fs = require('fs');
let Anonymizer = require('./anonymizer.js');
let Splitter = require('./splitter.js');
let encounterTools = require('./encounter_tools.js');
let EncounterCollector = encounterTools.EncounterCollector;

const logFileName = process.argv[2];

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
}

let notifier = new ConsoleNotifier();
let anonymizer = new Anonymizer();
let collector = new EncounterCollector();

let lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(logFileName),
});

// TOOD: add a JavaScript version of encounter_tools.find_fights_in_file <_<
let startLine = '01|2020-05-11T19:21:36.6480000-07:00|213|Alexander - The Arm of the Son (Savage)|a7a5be3a0d25548f95086ca00b98e610';
let stopLine = '01|2020-05-11T19:21:54.3240000-07:00|153|Mist|a6798291af6520138519e4d38a028545';
let splitter = new Splitter(startLine, stopLine);

let lines = [];
lineReader.on('line', (line) => {
  try {
    collector.process(line);
  } catch (e) {
    console.error(e);
  }

  splitter.processWithCallback(line, (line) => {
    const anonLine = anonymizer.process(line, notifier);
    if (typeof anonLine === 'undefined')
      return;

    lines.push(anonLine);
    // console.log(anonLine);
  });

  if (splitter.isDone())
    lineReader.close();
});

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
  for (const fight of collector.fights) {
    outputRows.push([
      idx.toString(),
      dayFromDate(fight.startTime),
      timeFromDate(fight.startTime),
      durationFromDates(fight.startTime, fight.endTime),
      fight.name,
      fight.endType,
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
      rightExtendStr(row, lengths, 4) + ' ' +
      '[' + row[5] + ']');
  }
};

lineReader.on('close', () => {
  anonymizer.validateIds();
  for (const line of lines)
    anonymizer.validateLine(line);

  printCollectedZones(collector);
  printCollectedFights(collector);

  process.exit(exitCode);
});
