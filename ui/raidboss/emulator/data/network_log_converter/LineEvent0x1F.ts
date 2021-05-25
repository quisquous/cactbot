import LineEvent from './LineEvent';
import EmulatorCommon from '../../EmulatorCommon';
import LogRepository from './LogRepository';

const splitFunc = (s: string) => [
  s.substr(6, 2),
  s.substr(4, 2),
  s.substr(2, 2),
  s.substr(0, 2),
];

const fields = {
  id: 2,
  dataBytes1: 3,
  dataBytes2: 4,
  dataBytes3: 5,
  dataBytes4: 6,
} as const;

// Job gauge event
export class LineEvent0x1F extends LineEvent {
  public readonly jobGaugeBytes: string[];
  public readonly name: string;
  public readonly properCaseConvertedLine: string;

  public readonly id: string;
  public readonly dataBytes1: string;
  public readonly dataBytes2: string;
  public readonly dataBytes3: string;
  public readonly dataBytes4: string;

  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);

    this.id = parts[fields.id]?.toUpperCase() ?? '';
    this.dataBytes1 = EmulatorCommon.zeroPad(parts[fields.dataBytes1] ?? '');
    this.dataBytes2 = EmulatorCommon.zeroPad(parts[fields.dataBytes2] ?? '');
    this.dataBytes3 = EmulatorCommon.zeroPad(parts[fields.dataBytes3] ?? '');
    this.dataBytes4 = EmulatorCommon.zeroPad(parts[fields.dataBytes4] ?? '');

    this.jobGaugeBytes = [
      ...splitFunc(this.dataBytes1),
      ...splitFunc(this.dataBytes2),
      ...splitFunc(this.dataBytes3),
      ...splitFunc(this.dataBytes4),
    ];

    this.name = repo.Combatants[this.id]?.name || '';

    repo.updateCombatant(this.id, {
      name: repo.Combatants[this.id]?.name,
      spawn: this.timestamp,
      despawn: this.timestamp,
      job: this.jobGaugeBytes[0]?.toUpperCase(),
    });

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
