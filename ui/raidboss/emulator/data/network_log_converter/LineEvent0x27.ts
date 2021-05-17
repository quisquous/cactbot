import LineEvent from './LineEvent';
import { LogRepository } from './LogRepository';

export type LineEvent0x27Parts = [
  string, // 0: ID
  string, // 1: Timestamp
  string, // 2: Source ID
  string, // 3: Source Name
  string, // 4: Current HP
  string, // 5: Max HP
  string, // 6: Current MP
  string, // 7: Max MP
  string, // 8: Current TP
  string, // 9: Max TP
  string, // 10: X
  string, // 11: Y
  string, // 12: Z
  string, // 13: Heading
  string, // 14: Unknown/Blank?
  string, // 15: Checksum
];

// Network update hp event
export class LineEvent0x27 extends LineEvent {
  id: string;
  name: string;
  hp: string;
  maxHp: string;
  mp: string;
  maxMp: string;
  x: string;
  y: string;
  z: string;
  heading: string;
  constructor(repo: LogRepository, line: string, parts: LineEvent0x27Parts) {
    super(repo, line, parts);

    this.id = parts[2].toUpperCase();
    this.name = parts[3];

    this.hp = parts[4];
    this.maxHp = parts[5];

    this.mp = parts[6];
    this.maxMp = parts[7];

    this.x = parts[10];
    this.y = parts[11];
    this.z = parts[12];
    this.heading = parts[13];
  }
}

export class LineEvent39 extends LineEvent0x27 {}
