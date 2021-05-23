import { LineEvent0x15 } from './LineEvent0x15';
import LogRepository from './LogRepository';

// Ability hit multiple/no target event
// Duplicate of 0x15 as far as data
export class LineEvent0x16 extends LineEvent0x15 {
  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);
  }
}

export class LineEvent22 extends LineEvent0x16 {}
