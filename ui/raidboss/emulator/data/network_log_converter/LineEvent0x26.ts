import logDefinitions from '../../../../../resources/netlog_defs';
import Util from '../../../../../resources/util';
import { Job } from '../../../../../types/job';
import EmulatorCommon from '../../EmulatorCommon';

import LineEvent, { LineEventJobLevel, LineEventSource } from './LineEvent';
import LogRepository from './LogRepository';

const fields = logDefinitions.StatusEffect.fields;

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
  public readonly x: number;
  public readonly y: number;
  public readonly z: number;
  public readonly heading: number;
  public readonly isSource = true;
  public readonly isJobLevel = true;

  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);

    this.id = parts[fields.targetId]?.toUpperCase() ?? '';
    this.name = parts[fields.target] ?? '';

    this.jobLevelData = parts[fields.jobLevelData] ?? '';

    this.hp = parseInt(parts[fields.hp] ?? '');
    this.maxHp = parseInt(parts[fields.maxHp] ?? '');
    this.mp = parseInt(parts[fields.mp] ?? '');
    this.maxMp = parseInt(parts[fields.maxMp] ?? '');
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
