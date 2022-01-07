import logDefinitions from '../../../../../resources/netlog_defs';

import LineEvent, { LineEventSource } from './LineEvent';
import LogRepository from './LogRepository';

const fields = logDefinitions.NetworkDoT.fields;

// DoT/HoT event
export class LineEvent0x18 extends LineEvent implements LineEventSource {
  public readonly id: string;
  public readonly name: string;
  public readonly which: string;
  public readonly effectId: string;
  public readonly damage: number;
  public readonly hp: number;
  public readonly maxHp: number;
  public readonly mp: number;
  public readonly maxMp: number;
  public readonly x: number;
  public readonly y: number;
  public readonly z: number;
  public readonly heading: number;
  public readonly isSource = true;

  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);

    this.id = parts[fields.id]?.toUpperCase() ?? '';
    this.name = parts[fields.name] ?? '';

    this.which = parts[fields.which] ?? '';
    this.effectId = parts[fields.effectId]?.toUpperCase() ?? '';
    const damageString = parts[fields.damage] ?? '';
    this.damage = parseInt(damageString, 16);

    this.hp = parseInt(parts[fields.currentHp] ?? '');
    this.maxHp = parseInt(parts[fields.maxHp] ?? '');
    this.mp = parseInt(parts[fields.currentMp] ?? '');
    this.maxMp = parseInt(parts[fields.maxMp] ?? '');
    this.x = parseFloat(parts[fields.x] ?? '');
    this.y = parseFloat(parts[fields.y] ?? '');
    this.z = parseFloat(parts[fields.z] ?? '');
    this.heading = parseFloat(parts[fields.heading] ?? '');

    repo.updateCombatant(this.id, {
      job: undefined,
      name: this.name,
      spawn: this.timestamp,
      despawn: this.timestamp,
    });
  }
}

export class LineEvent24 extends LineEvent0x18 {}
