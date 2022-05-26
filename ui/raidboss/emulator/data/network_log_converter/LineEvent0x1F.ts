import logDefinitions from '../../../../../resources/netlog_defs';
import SFuncs from '../../../../../resources/stringhandlers';

import LineEvent from './LineEvent';
import LogRepository from './LogRepository';

const splitFunc = (s: string) => [
  s.substr(6, 2),
  s.substr(4, 2),
  s.substr(2, 2),
  s.substr(0, 2),
];

const fields = logDefinitions.NetworkGauge.fields;

// Job gauge event
export class LineEvent0x1F extends LineEvent {
  public readonly jobGaugeBytes: string[];
  public readonly name: string;

  public readonly id: string;
  public readonly dataBytes1: string;
  public readonly dataBytes2: string;
  public readonly dataBytes3: string;
  public readonly dataBytes4: string;

  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);

    this.id = parts[fields.id]?.toUpperCase() ?? '';
    this.dataBytes1 = SFuncs.zeroPad(parts[fields.data0] ?? '');
    this.dataBytes2 = SFuncs.zeroPad(parts[fields.data1] ?? '');
    this.dataBytes3 = SFuncs.zeroPad(parts[fields.data2] ?? '');
    this.dataBytes4 = SFuncs.zeroPad(parts[fields.data3] ?? '');

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
  }
}

export class LineEvent31 extends LineEvent0x1F {}
