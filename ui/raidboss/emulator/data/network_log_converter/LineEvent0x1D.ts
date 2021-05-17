import LineEvent from './LineEvent';
import { LogRepository } from './LogRepository';

export type LineEvent0x1DParts = [
  string, // 0: ID
  string, // 1: Timestamp
  string, // 2: Operation
  string, // 3: Waymark
  string, // 4: Source ID
  string, // 5: Source Name
  string, // 6: Target ID
  string, // 7: Target Name
  string, // 8: Unknown/Blank?
  string, // 9: Checksum
];

// Waymarker
export class LineEvent0x1D extends LineEvent {
  constructor(repo: LogRepository, line: string, public parts: LineEvent0x1DParts) {
    super(repo, line, parts);
  }
}

export class LineEvent29 extends LineEvent0x1D {}
