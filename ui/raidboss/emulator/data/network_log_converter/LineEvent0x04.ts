import { LineEvent0x03, LineEvent0x03Parts } from './LineEvent0x03';
import { LogRepository } from './LogRepository';

export type LineEvent0x04Parts = LineEvent0x03Parts;

// Removed combatant event
// Extend the add combatant event to reduce duplicate code since they're
// the same from a data perspective
export class LineEvent0x04 extends LineEvent0x03 {
  constructor(repo: LogRepository, line: string, public parts: LineEvent0x04Parts) {
    super(repo, line, parts);
  }

  convert(): void {
    this.convertedLine = `\
${this.prefix()}\
${this.id.toUpperCase()}:\
Removing combatant ${this.name}\
.  Max HP: ${this.maxHp}\
. Pos: (${this.parts[17]},${this.parts[18]},${this.parts[19]}).`;
  }
}

export class LineEvent04 extends LineEvent0x04 {}
