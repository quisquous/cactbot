import LineEvent from './LineEvent';
import { LogRepository } from './LogRepository';

export type LineEvent0x22Parts = [
  string, // 0: ID
  string, // 1: Timestamp
  string, // 2: Target ID
  string, // 3: Target Name
  string, // 4: Source ID
  string, // 5: Source Name
  string, // 6: Enable Flag
  string, // 7: Checksum
];

// Nameplate toggle
export class LineEvent0x22 extends LineEvent {
  id: string;
  name: string;
  targetId: string;
  targetName: string;
  targetable: boolean;
  constructor(repo: LogRepository, line: string, parts: LineEvent0x22Parts) {
    super(repo, line, parts);

    this.id = parts[2].toUpperCase();
    this.name = parts[3];

    this.targetId = parts[4].toUpperCase();
    this.targetName = parts[5];

    this.targetable = !!parseInt(parts[6], 16);
  }
}

export class LineEvent34 extends LineEvent0x22 {}
