import LineEvent from './LineEvent';
import EmulatorCommon from '../../EmulatorCommon';
import Util from '../../../../../resources/util';
import LogRepository from './LogRepository';

const fields = {
  id: 2,
  name: 3,
  jobLevelData: 4,
  currentHp: 5,
  maxHp: 6,
  currentMp: 7,
  maxMp: 8,
  currentTp: 9,
  maxTp: 10,
  x: 11,
  y: 12,
  z: 13,
  heading: 14,
} as const;

// Network status effect event
export class LineEvent0x26 extends LineEvent {
  public readonly jobIdHex: string;
  public readonly jobIdDec: number;
  public readonly jobName: string;
  public readonly level: number;
  public readonly id: string;
  public readonly name: string;
  public readonly jobLevelData: string;
  public readonly currentHp: string;
  public readonly maxHp: string;
  public readonly currentMp: string;
  public readonly maxMp: string;
  public readonly currentTp: string;
  public readonly maxTp: string;
  public readonly x: string;
  public readonly y: string;
  public readonly z: string;
  public readonly heading: string;

  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);

    this.id = parts[fields.id]?.toUpperCase() ?? '';
    this.name = parts[fields.name] ?? '';

    this.jobLevelData = parts[fields.jobLevelData] ?? '';

    this.currentHp = parts[fields.currentHp] ?? '';
    this.maxHp = parts[fields.maxHp] ?? '';
    this.currentMp = parts[fields.currentMp] ?? '';
    this.maxMp = parts[fields.maxMp] ?? '';
    this.currentTp = parts[fields.currentTp] ?? '';
    this.maxTp = parts[fields.maxTp] ?? '';
    this.x = parts[fields.x] ?? '';
    this.y = parts[fields.y] ?? '';
    this.z = parts[fields.z] ?? '';
    this.heading = parts[fields.heading] ?? '';

    const padded = EmulatorCommon.zeroPad(this.jobLevelData, 8);

    this.jobIdHex = padded.substr(6, 2).toUpperCase();
    this.jobIdDec = parseInt(this.jobIdHex, 16);
    this.jobName = Util.jobEnumToJob(this.jobIdDec);

    this.level = parseInt(padded.substr(4, 2), 16);
  }
}

export class LineEvent38 extends LineEvent0x26 {}
