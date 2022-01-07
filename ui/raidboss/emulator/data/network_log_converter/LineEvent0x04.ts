import { LineEvent0x03 } from './LineEvent0x03';
import LogRepository from './LogRepository';

// Removed combatant event
// Extend the add combatant event to reduce duplicate code since they're
// the same from a data perspective
export class LineEvent0x04 extends LineEvent0x03 {
  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);
  }
}

export class LineEvent04 extends LineEvent0x04 {}
