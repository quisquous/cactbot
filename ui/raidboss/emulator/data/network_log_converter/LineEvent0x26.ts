import Util from '../../../../../resources/util';
import { Job } from '../../../../../types/job';
import EmulatorCommon from '../../EmulatorCommon';

import LineEvent, { LineEventJobLevel, LineEventSource } from './LineEvent';
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
export class LineEvent0x26 extends LineEvent implements LineEventSource, LineEventJobLevel {
  public readonly jobIdHex: string;
  public readonly jobId: number;
  public readonly job: Job;
  public readonly level: number;
  public readonly id: string;
  public readonly name: string;
  public readonly jobLevelData: string;
  public readonly hp: number;
  public readonly maxHp: number;
  public readonly mp: number;
  public readonly maxMp: number;
  public readonly tp: number;
  public readonly maxTp: number;
  public readonly x: number;
  public readonly y: number;
  public readonly z: number;
  public readonly heading: number;
  public readonly isSource = true;
  public readonly isJobLevel = true;

  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);

    this.id = parts[fields.id]?.toUpperCase() ?? '';
    this.name = parts[fields.name] ?? '';

    this.jobLevelData = parts[fields.jobLevelData] ?? '';

    this.hp = parseInt(parts[fields.currentHp] ?? '');
    this.maxHp = parseInt(parts[fields.maxHp] ?? '');
    this.mp = parseInt(parts[fields.currentMp] ?? '');
    this.maxMp = parseInt(parts[fields.maxMp] ?? '');
    this.tp = parseInt(parts[fields.currentTp] ?? '');
    this.maxTp = parseInt(parts[fields.maxTp] ?? '');
    this.x = parseFloat(parts[fields.x] ?? '');
    this.y = parseFloat(parts[fields.y] ?? '');
    this.z = parseFloat(parts[fields.z] ?? '');
    this.heading = parseFloat(parts[fields.heading] ?? '');

    const padded = EmulatorCommon.zeroPad(this.jobLevelData, 8);

    this.jobIdHex = padded.substr(6, 2).toUpperCase();
    this.jobId = parseInt(this.jobIdHex, 16);
    this.job = Util.jobEnumToJob(this.jobId);

    this.level = parseInt(padded.substr(4, 2), 16);
  }
}

export class LineEvent38 extends LineEvent0x26 {}
