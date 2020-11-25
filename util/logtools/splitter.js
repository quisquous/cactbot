import logDefinitions from './netlog_defs.js';

export default class Splitter {
  // startLine and stopLine are both inclusive.
  constructor(startLine, stopLine, notifier) {
    this.logTypes = logDefinitions;

    this.startLine = startLine;
    this.stopLine = stopLine;
    this.notifier = notifier;

    this.haveStarted = false;
    this.haveStopped = false;
    this.haveFoundFirstNonIncludeLine = false;

    this.globalLines = [];
    // log type => line
    this.lastInclude = {};

    // id -> line
    this.addedCombatants = {};
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
    if (!type) {
      this.notifier.error(`Unknown type: ${typeField}: ${line}`);
      return;
    }

    // Hang onto every globalInclude line, and the last instance of each lastInclude line.
    if (type.globalInclude)
      this.globalLines.push(line);
    else if (type.lastInclude)
      this.lastInclude[typeField] = line;

    // Combatant special case:
    if (typeField === '01') {
      // When changing zones, reset all combatants.
      // They will get re-added again.
      this.addedCombatants = {};
    } else if (typeField === '03') {
      const idIdx = 2;
      const combatantId = splitLine[idIdx].toUpperCase();
      this.addedCombatants[combatantId] = line;
    } else if (typeField === '04') {
      const idIdx = 2;
      const combatantId = splitLine[idIdx].toUpperCase();
      delete this.addedCombatants[combatantId];
    }

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
    for (const key in this.addedCombatants)
      lines.push(this.addedCombatants[key]);
    lines.push(line);

    lines = lines.sort((a, b) => {
      // Sort by earliest time first, then by earliest log id.
      // This makes the log a little bit fake but maybe it's good enough.
      const aStr = a.slice(3, 36) + a.slice(0, 3);
      const bStr = b.slice(3, 36) + b.slice(0, 3);
      return aStr.localeCompare(bStr);
    });

    // These should be unused from here on out.
    this.globalLines = null;
    this.lastInclude = null;
    this.addedCombatants = null;

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
      for (const resultLine of result)
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
