import LineEvent from './LineEvent';
import EmulatorCommon from '../../EmulatorCommon';
import Util from '../../../../../resources/util';
import { LogRepository } from './LogRepository';

export type LineEvent0x26Parts = [
  string, // 0: ID
  string, // 1: Timestamp
  string, // 2: Source ID
  string, // 3: Source Name
  string, // 4: Job/Level Data
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
  string, // 18: Unknown/Blank?
  string, // 19: Checksum
];

// Network status effect event
export class LineEvent0x26 extends LineEvent {
  id: string;
  name: string;
  jobIdHex: string;
  jobIdDec: number;
  jobName: string;
  level: number;
  hp: string;
  maxHp: string;
  mp: string;
  maxMp: string;
  x: string;
  y: string;
  z: string;
  heading: string;
  constructor(repo: LogRepository, line: string, parts: LineEvent0x26Parts) {
    super(repo, line, parts);

    this.id = parts[2].toUpperCase();
    this.name = parts[3];

    const padded = EmulatorCommon.zeroPad(parts[4], 8);

    this.jobIdHex = padded.substr(6, 2).toUpperCase();
    this.jobIdDec = parseInt(this.jobIdHex, 16);
    this.jobName = Util.jobEnumToJob(this.jobIdDec);

    this.level = parseInt(padded.substr(4, 2), 16);

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

export class LineEvent38 extends LineEvent0x26 {}
