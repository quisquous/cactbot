import { LineEvent0x1A } from './LineEvent0x1A';
import LogRepository from './LogRepository';

// Lose status effect event
// Extend the gain status event to reduce duplicate code since they're
// the same from a data perspective
export class LineEvent0x1E extends LineEvent0x1A {
  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);
  }
}

export class LineEvent30 extends LineEvent0x1E {}
