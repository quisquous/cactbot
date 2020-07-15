'use strict';

let fs = require('fs');
let Anonymizer = require('./anonymizer.js');
let Splitter = require('./splitter.js');

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

let lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(logFileName),
});

// TOOD: add a JavaScript version of encounter_tools.find_fights_in_file <_<
let startLine = '01|2020-05-11T19:21:36.6480000-07:00|213|Alexander - The Arm of the Son (Savage)|a7a5be3a0d25548f95086ca00b98e610';
let stopLine = '01|2020-05-11T19:21:54.3240000-07:00|153|Mist|a6798291af6520138519e4d38a028545';
let splitter = new Splitter(startLine, stopLine);

let lines = [];
lineReader.on('line', (line) => {
  splitter.processWithCallback(line, (line) => {
    const anonLine = anonymizer.process(line, notifier);
    if (typeof anonLine === 'undefined')
      return;

    lines.push(anonLine);
    console.log(anonLine);
  });

  if (splitter.isDone())
    lineReader.close();
});

lineReader.on('close', () => {
  anonymizer.validateIds();
  for (let line of lines)
    anonymizer.validateLine(line);

  process.exit(exitCode);
});
