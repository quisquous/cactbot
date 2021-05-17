import LineEvent from './LineEvent';
import { LogRepository } from './LogRepository';

export type LineEvent0x23Parts = [
  string, // 0: ID
  string, // 1: Timestamp
  string, // 2: Source ID
  string, // 3: Source Name
  string, // 4: Target ID
  string, // 5: Target Name
  string, // 6: Unknown?
  string, // 7: Unknown?
  string, // 8: Tether ID
  string, // 9: Unknown?
  string, // 10: Unknown?
  string, // 11: Unknown?
  string, // 12: Unknown/Blank?
  string, // 13: Checksum
];

// Tether event
export class LineEvent0x23 extends LineEvent {
  id: string;
  name: string;
  targetId: string;
  targetName: string;
  constructor(repo: LogRepository, line: string, parts: LineEvent0x23Parts) {
    super(repo, line, parts);

    this.id = parts[2].toUpperCase();
    this.name = parts[3];

    this.targetId = parts[4].toUpperCase();
    this.targetName = parts[5];
  }
}

export class LineEvent35 extends LineEvent0x23 {}
