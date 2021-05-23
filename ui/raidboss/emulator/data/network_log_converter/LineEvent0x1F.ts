import LineEvent from './LineEvent';
import EmulatorCommon from '../../EmulatorCommon';
import LogRepository from './LogRepository';

// Job gauge event
export class LineEvent0x1F extends LineEvent {
  public jobGaugeBytes: string[];
  public name = '';
  public properCaseConvertedLine = '';

  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);

    const splitFunc = (s: string) => [
      s.substr(6, 2),
      s.substr(4, 2),
      s.substr(2, 2),
      s.substr(0, 2),
    ];

    this.jobGaugeBytes = [
      ...splitFunc(this.dataBytes1),
      ...splitFunc(this.dataBytes2),
      ...splitFunc(this.dataBytes3),
      ...splitFunc(this.dataBytes4),
    ];

    repo.updateCombatant(this.id, {
      name: undefined,
      spawn: this.timestamp,
      despawn: this.timestamp,
      job: this.jobGaugeBytes[0]?.toUpperCase(),
    });
  }

  public get id(): string {
    return this.parts[2]?.toUpperCase() ?? '';
  }

  public get dataBytes1(): string {
    return EmulatorCommon.zeroPad(this.parts[3] ?? '');
  }

  public get dataBytes2(): string {
    return EmulatorCommon.zeroPad(this.parts[4] ?? '');
  }

  public get dataBytes3(): string {
    return EmulatorCommon.zeroPad(this.parts[5] ?? '');
  }

  public get dataBytes4(): string {
    return EmulatorCommon.zeroPad(this.parts[6] ?? '');
  }

  convert(repo: LogRepository): void {
    this.name = repo.Combatants[this.id]?.name || '';
    this.convertedLine = this.prefix() +
      this.id + ':' + this.name +
      ':' + this.dataBytes1 +
      ':' + this.dataBytes2 +
      ':' + this.dataBytes3 +
      ':' + this.dataBytes4;
    this.properCaseConvertedLine = this.prefix() +
      this.id + ':' + (EmulatorCommon.properCase(this.name)) +
      ':' + this.dataBytes1 +
      ':' + this.dataBytes2 +
      ':' + this.dataBytes3 +
      ':' + this.dataBytes4;
  }
}

export class LineEvent31 extends LineEvent0x1F {}
