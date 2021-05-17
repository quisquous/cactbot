import LineEvent from './LineEvent';
import { LogRepository } from './LogRepository';

export type LineEvent0x17Parts = [
  string, // 0: ID
  string, // 1: Timestamp
  string, // 2: Source ID
  string, // 3: Source Name
  string, // 4: Ability ID
  string, // 5: Ability Name
  string, // 6: Reason
  string, // 7: Unknown/Blank?
  string, // 8: Checksum
];

// Cancel ability event
export class LineEvent0x17 extends LineEvent {
  id: string;
  name: string;
  abilityId: string;
  abilityName: string;
  constructor(repo: LogRepository, line: string, public parts: LineEvent0x17Parts) {
    super(repo, line, parts);

    this.id = parts[2].toUpperCase();
    this.name = parts[3];

    this.abilityId = parts[4].toUpperCase();
    this.abilityName = parts[5];
  }
}

export class LineEvent23 extends LineEvent0x17 {}
