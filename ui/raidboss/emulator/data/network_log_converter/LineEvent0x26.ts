import LineEvent from './LineEvent';
import EmulatorCommon from '../../EmulatorCommon';
import Util from '../../../../../resources/util';
import LogRepository from './LogRepository';

// Network status effect event
export class LineEvent0x26 extends LineEvent {
  public jobIdHex: string;
  public jobIdDec: number;
  public jobName: string;
  public level: number;

  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);

    const padded = EmulatorCommon.zeroPad(this.jobLevelData, 8);

    this.jobIdHex = padded.substr(6, 2).toUpperCase();
    this.jobIdDec = parseInt(this.jobIdHex, 16);
    this.jobName = Util.jobEnumToJob(this.jobIdDec);

    this.level = parseInt(padded.substr(4, 2), 16);
  }

  public get id(): string {
    return this.parts[2]?.toUpperCase() ?? '';
  }

  public get name(): string {
    return this.parts[3] ?? '';
  }

  public get jobLevelData(): string {
    return this.parts[4] ?? '';
  }

  public get currentHp(): string {
    return this.parts[5] ?? '';
  }

  public get maxHp(): string {
    return this.parts[6] ?? '';
  }

  public get currentMp(): string {
    return this.parts[7] ?? '';
  }

  public get maxMp(): string {
    return this.parts[8] ?? '';
  }

  public get currentTp(): string {
    return this.parts[9] ?? '';
  }

  public get maxTp(): string {
    return this.parts[10] ?? '';
  }

  public get x(): string {
    return this.parts[11] ?? '';
  }

  public get y(): string {
    return this.parts[12] ?? '';
  }

  public get z(): string {
    return this.parts[13] ?? '';
  }

  public get heading(): string {
    return this.parts[14] ?? '';
  }
}

export class LineEvent38 extends LineEvent0x26 {}
