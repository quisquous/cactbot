import LineEvent from './LineEvent';
import EmulatorCommon from '../../EmulatorCommon';
import { LogRepository } from './LogRepository';

export type LineEvent0x1FParts = [
  string, // 0: ID
  string, // 1: Timestamp
  string, // 2: Source ID
  string, // 3: Data Bytes 1
  string, // 4: Data Bytes 2
  string, // 5: Data Bytes 3
  string, // 6: Data Bytes 4
  string, // 7: Checksum
];

// Job gauge event
export class LineEvent0x1F extends LineEvent {
  id: string;
  jobGaugeBytes: string[];
  name = '';
  properCaseConvertedLine = '';
  constructor(repo: LogRepository, line: string, public parts: LineEvent0x1FParts) {
    super(repo, line, parts);

    this.id = parts[2].toUpperCase();

    const bytes1 = EmulatorCommon.zeroPad(parts[3], 8);
    const bytes2 = EmulatorCommon.zeroPad(parts[4], 8);
    const bytes3 = EmulatorCommon.zeroPad(parts[5], 8);
    const bytes4 = EmulatorCommon.zeroPad(parts[6], 8);

    const splitFunc = (s: string) => [
      s.substr(6, 2),
      s.substr(4, 2),
      s.substr(2, 2),
      s.substr(0, 2),
    ];

    this.jobGaugeBytes = [
      ...splitFunc(bytes1),
      ...splitFunc(bytes2),
      ...splitFunc(bytes3),
      ...splitFunc(bytes4),
    ];

    repo.updateCombatant(this.id, {
      name: undefined,
      spawn: this.timestamp,
      despawn: this.timestamp,
      job: this.jobGaugeBytes[0]?.toUpperCase(),
    });
  }

  convert(repo: LogRepository): void {
    this.name = repo.Combatants[this.id]?.name || '';
    this.convertedLine = this.prefix() +
      this.id + ':' + this.name +
      ':' + this.parts[3] +
      ':' + this.parts[4] +
      ':' + this.parts[5] +
      ':' + this.parts[6];
    this.properCaseConvertedLine = this.prefix() +
      this.id + ':' + (EmulatorCommon.properCase(this.name) as string) +
      ':' + this.parts[3] +
      ':' + this.parts[4] +
      ':' + this.parts[5] +
      ':' + this.parts[6];
  }
}

export class LineEvent31 extends LineEvent0x1F {}
