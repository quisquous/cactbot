import LineEvent from './LineEvent';
import { LogRepository } from './LogRepository';

export type LineEvent0x25Parts = [
  string, // 0: ID
  string, // 1: Timestamp
  string, // 2: Source ID
  string, // 3: Source Name
  string, // 4: Sequence ID
  string, // 5: Current HP
  string, // 6: Max HP
  string, // 7: Current MP
  string, // 8: Max MP
  string, // 9: Current TP
  string, // 10: Max TP
  string, // 11: X
  string, // 12: Y
  string, // 13: Z
  string, // 14: Heading
  string, // 15: Unknown?
  string, // 16: Unknown?
  string, // 17: Unknown?
  string, // 18: Unknown?
  string, // 19: Unknown/Blank?
  string, // 20: Checksum
];

// Action sync event
export class LineEvent0x25 extends LineEvent {
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
  constructor(repo: LogRepository, line: string, parts: LineEvent0x25Parts) {
    super(repo, line, parts);

    this.id = parts[2].toUpperCase();
    this.name = parts[3];

    this.hp = parts[5];
    this.maxHp = parts[6];

    this.mp = parts[7];
    this.maxMp = parts[8];

    this.x = parts[11];
    this.y = parts[12];
    this.z = parts[13];
    this.heading = parts[14];
  }
}

export class LineEvent37 extends LineEvent0x25 {}
