import LineEvent from './LineEvent';
import { LogRepository } from './LogRepository';

export type LineEvent0x1BParts = [
  string, // 0: ID
  string, // 1: Timestamp
  string, // 2: Target ID
  string, // 3: Target Name
  string, // 4: Unknown?
  string, // 5: Unknown?
  string, // 6: Headmarker ID
  string, // 7: 0000
  string, // 8: 0000
  string, // 9: 0000
  string, // 10: Unknown/Blank?
  string, // 11: Checksum
];

// Head marker event
export class LineEvent0x1B extends LineEvent {
  targetId: string;
  targetName: string;
  constructor(repo: LogRepository, line: string, public parts: LineEvent0x1BParts) {
    super(repo, line, parts);

    this.targetId = parts[2].toUpperCase();
    this.targetName = parts[3];
  }
}

export class LineEvent27 extends LineEvent0x1B {}
