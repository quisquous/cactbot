import { LineEvent0x15, LineEvent0x15Parts } from './LineEvent0x15';
import { LogRepository } from './LogRepository';

export type LineEvent0x16Parts = LineEvent0x15Parts;

// Ability hit multiple/no target event
// Duplicate of 0x15 as far as data
export class LineEvent0x16 extends LineEvent0x15 {
  constructor(repo: LogRepository, line: string, public parts: LineEvent0x16Parts) {
    super(repo, line, parts);
  }
}

export class LineEvent22 extends LineEvent0x16 {}
