'use strict';

const logDefinitions = require('./netlog_defs.js');

class Splitter {
  // startLine and stopLine are both inclusive.
  constructor(startLine, stopLine) {
    this.logTypes = logDefinitions;

    this.startLine = startLine;
    this.stopLine = stopLine;
    this.haveStarted = false;
    this.haveStopped = false;

    this.haveFoundFirstNonIncludeLine = false;

    this.globalLines = [];
    // log type => line
    this.lastInclude = {};
  }

  // Can return string, array of strings, or undefined (i.e. skip).
  process(line) {
    if (this.haveStopped)
      return;

    if (line === this.stopLine)
      this.haveStopped = true;

    // Normal operation; emit lines between start and stop.
    if (this.haveFoundFirstNonIncludeLine)
      return line;

    const splitLine = line.split('|');
    const typeField = splitLine[0];
    const type = this.logTypes[typeField];
    // Hang onto every globalInclude line, and the last instance of each lastInclude line.
    if (type.globalInclude)
      this.globalLines.push(line);
    else if (type.lastInclude)
      this.lastInclude[typeField] = line;

    if (!this.haveStarted && line !== this.startLine)
      return;

    // We have found the start line, but haven't necessarily started printing yet.
    // Emit all the include lines as soon as we find a non-include line.
    // By waiting until we find the first non-include line, we avoid weird corner cases
    // around the startLine being an include line (ordering issues, redundant lines).
    this.haveStarted = true;
    if (type.globalInclude || type.lastInclude)
      return;

    // At this point we've found a real line that's not
    this.haveFoundFirstNonIncludeLine = true;

    let lines = this.globalLines;

    for (const typeField in this.lastInclude)
      lines.push(this.lastInclude[typeField]);

    lines.push(line);

    // These should be unused from here on out.
    this.globalLines = null;
    this.lastInclude = null;

    return lines;
  }

  // Call callback with any emitted line.
  processWithCallback(line, callback) {
    const result = this.process(line);
    if (typeof result === 'undefined') {
      return;
    } else if (typeof result === 'string') {
      callback(line);
    } else if (typeof result === 'object') {
      for (let resultLine of result)
        callback(resultLine);
    }
  }

  isDone() {
    return this.haveStopped;
  }

  wasStarted() {
    return this.haveStarted;
  }
}

if (typeof module !== 'undefined' && module.exports)
  module.exports = Splitter;
