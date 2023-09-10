import logDefinitions, { LogDefinition, LogDefinitionMap } from '../../resources/netlog_defs';

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
  // rsvKey -> line
  private rsvLines: { [key: string]: string } = {};
  // log type => field #s that may contain rsv data
  private rsvLinesReceived = false;
  private rsvTypeToFieldMap: { [type: string]: readonly number[] } = {};
  private rsvSubstitutionMap: { [key: string]: string } = {};

  // startLine and stopLine are both inclusive.
  constructor(
    private startLine: string,
    private stopLine: string,
    private notifier: Notifier,
    private includeGlobals: boolean,
  ) {
    const defs: LogDefinitionMap = logDefinitions;
    for (const def of Object.values(defs)) {
      // Remap logDefinitions from log type (instead of name) to definition.
      this.logTypes[def.type] = def;
      // Populate rsvTypeToFieldMap
      const possibleRsvFields = def.possibleRsvFields;
      if (possibleRsvFields !== undefined)
        this.rsvTypeToFieldMap[def.type] = possibleRsvFields;
    }
  }

  decodeRsv(line: string): string {
    const splitLine = line.split('|');
    const typeField = splitLine[0];
    if (typeField === undefined)
      return line;
    const fieldsToSubstitute = this.rsvTypeToFieldMap[typeField];
    if (fieldsToSubstitute === undefined)
      return line;

    for (const idx of fieldsToSubstitute) {
      const origValue = splitLine[idx];
      if (origValue === undefined)
        continue;
      if (Object.hasOwn(this.rsvSubstitutionMap, origValue))
        splitLine[idx] = this.rsvSubstitutionMap[origValue] ?? origValue;
    }
    return splitLine.join('|');
  }

  process(line: string): string | string[] | undefined {
    if (this.haveStopped)
      return;

    if (line === this.stopLine)
      this.haveStopped = true;

    const splitLine = line.split('|');
    const typeField = splitLine[0];

    // if this line type has possible RSV keys, decode it first
    const typesToDecode = Object.keys(this.rsvTypeToFieldMap);
    if (typeField !== undefined && typesToDecode.includes(typeField))
      line = this.decodeRsv(line);

    // Normal operation; emit lines between start and stop.
    if (this.haveFoundFirstNonIncludeLine)
      return line;

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

    // Combatant & rsv special cases:
    if (typeField === '01') {
      // When changing zones, reset all combatants.
      // They will get re-added again.
      this.addedCombatants = {};
      // rsv lines arrive before zone change, so mark rsv lines as completed
      this.rsvLinesReceived = true;
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
    } else if (typeField === '262') {
      // if we receive a 262 line after the 01 line, this means a new zone change is occurring
      // so reset rsvLines/rsvSubstitutionMap and recollect
      if (this.rsvLinesReceived) {
        this.rsvLinesReceived = false;
        this.rsvLines = {};
        this.rsvSubstitutionMap = {};
      }
      // All RSVs are handled identically regardless of namespace (ability, effect, etc.)
      // At some point, we could separate rsv keys into namespace-specific objects for substitution
      // But there's virtually no risk of collision right now,
      // and we also haven't yet determined how to map a 262 line to a particular namespace.
      const idIdx = 4;
      const valueIdx = 5;
      const rsvId = splitLine[idIdx];
      const rsvValue = splitLine[valueIdx];
      if (rsvId !== undefined && rsvValue !== undefined) {
        this.rsvLines[rsvId] = line;
        this.rsvSubstitutionMap[rsvId] = rsvValue;
      }
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

    // At this point we've found a real line that's not an include line
    this.haveFoundFirstNonIncludeLine = true;

    let lines = this.globalLines;

    for (const line of Object.values(this.lastInclude))
      lines.push(line);
    for (const line of Object.values(this.addedCombatants))
      lines.push(line);
    for (const line of Object.values(this.rsvLines))
      lines.push(line);
    lines.push(line);

    lines = lines.sort((a, b) => {
      // Sort by earliest time first, then by the lowest-numbered type.
      // This makes the log a little bit fake but maybe it's good enough.
      const aStr = (a.split('|')[1] ?? '') + (a.split('|')[0] ?? '');
      const bStr = (b.split('|')[1] ?? '') + (b.split('|')[0] ?? '');
      return aStr.localeCompare(bStr);
    });

    // These should be unused from here on out.
    this.globalLines = [];
    this.lastInclude = {};
    this.addedCombatants = {};
    this.rsvLines = {};

    return lines;
  }

  // Call callback with any emitted line.
  public processWithCallback(line: string, callback: (str: string) => void): void {
    const result = this.process(line);
    if (typeof result === 'undefined') {
      return;
    } else if (typeof result === 'string') {
      callback(result);
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
