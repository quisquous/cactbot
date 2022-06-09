import logDefinitions, { LogDefinition } from '../../resources/netlog_defs';

import { Notifier } from './notifier';

export default class Splitter {
  private logTypes: { [type: string]: LogDefinition } = {};
  private haveStarted = false;
  private haveStopped = false;
  private haveFoundFirstNonIncludeLine = false;
  private globalLines: string[] = [];
  // log type => line
  private lastInclude: { [type: string]: string } = {};
  // id -> line
  private addedCombatants: { [id: string]: string } = {};

  // startLine and stopLine are both inclusive.
  constructor(
    private startLine: string,
    private stopLine: string,
    private notifier: Notifier,
    private includeGlobals: boolean,
  ) {
    // Remap logDefinitions from log type (instead of name) to definition.
    for (const def of Object.values(logDefinitions))
      this.logTypes[def.type] = def;
  }

  process(line: string): string | string[] | undefined {
    if (this.haveStopped)
      return;

    if (line === this.stopLine)
      this.haveStopped = true;

    // Normal operation; emit lines between start and stop.
    if (this.haveFoundFirstNonIncludeLine)
      return line;

    const splitLine = line.split('|');
    const typeField = splitLine[0];
    if (typeField === undefined)
      return;
    const type = this.logTypes[typeField];
    if (type === undefined) {
      this.notifier.error(`Unknown type: ${typeField}: ${line}`);
      return;
    }

    // Hang onto every globalInclude line, and the last instance of each lastInclude line.
    if (type.globalInclude && this.includeGlobals)
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
      const combatantId = splitLine[idIdx]?.toUpperCase();
      if (combatantId !== undefined)
        this.addedCombatants[combatantId] = line;
    } else if (typeField === '04') {
      const idIdx = 2;
      const combatantId = splitLine[idIdx]?.toUpperCase();
      if (combatantId !== undefined)
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

    for (const line of Object.values(this.lastInclude))
      lines.push(line);
    for (const line of Object.values(this.addedCombatants))
      lines.push(line);
    lines.push(line);

    lines = lines.sort((a, b) => {
      // Sort by earliest time first, then by earliest log id.
      // This makes the log a little bit fake but maybe it's good enough.
      const aStr = a.slice(3, 36) + a.slice(0, 3);
      const bStr = b.slice(3, 36) + b.slice(0, 3);
      return aStr.localeCompare(bStr);
    });

    // These should be unused from here on out.
    this.globalLines = [];
    this.lastInclude = {};
    this.addedCombatants = {};

    return lines;
  }

  // Call callback with any emitted line.
  public processWithCallback(line: string, callback: (str: string) => void): void {
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

  public isDone(): boolean {
    return this.haveStopped;
  }

  public wasStarted(): boolean {
    return this.haveStarted;
  }
}
