'use strict';

let fs = require('fs');
let Anonymizer = require('./anonymizer.js');

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

let lines = [];
lineReader.on('line', (line) => {
  const anonLine = anonymizer.process(line, notifier);
  if (typeof anonLine === 'undefined')
    return;

  lines.push(anonLine);
  console.log(anonLine);
});

lineReader.on('close', () => {
  anonymizer.validateIds();
  for (let line of lines)
    anonymizer.validateLine(line);

  process.exit(exitCode);
});
