import logDefinitions from '../../../../../resources/netlog_defs';

import LineEvent, { LineEventAbility, LineEventSource, LineEventTarget } from './LineEvent';
import LogRepository from './LogRepository';

const fields = logDefinitions.AbilityFull.fields;

// Shorten a few types so dprint doesn't complain when the line gets too long.
type LESource = LineEventSource;
type LETarget = LineEventTarget;
type LEAbility = LineEventAbility;

// Ability hit single target event
export class LineEvent0x15 extends LineEvent implements LESource, LETarget, LEAbility {
  public readonly damage: number;
  public readonly id: string;
  public readonly name: string;
  public readonly abilityId: number;
  public readonly abilityName: string;
  public readonly targetId: string;
  public readonly targetName: string;
  public readonly flags: string;
  public readonly targetHp: number;
  public readonly targetMaxHp: number;
  public readonly targetMp: number;
  public readonly targetMaxMp: number;
  public readonly targetX: number;
  public readonly targetY: number;
  public readonly targetZ: number;
  public readonly targetHeading: number;
  public readonly hp: number;
  public readonly maxHp: number;
  public readonly mp: number;
  public readonly maxMp: number;
  public readonly x: number;
  public readonly y: number;
  public readonly z: number;
  public readonly heading: number;
  public readonly isSource = true;
  public readonly isTarget = true;
  public readonly isAbility = true;

  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);

    this.id = parts[fields.sourceId]?.toUpperCase() ?? '';
    this.name = parts[fields.source] ?? '';

    this.flags = parts[fields.flags] ?? '';

    const fieldOffset = this.flags === '3F' ? 2 : 0;

    this.damage = LineEvent.calculateDamage(parts[fields.damage + fieldOffset] ?? '');
    this.abilityId = parseInt(parts[fields.id]?.toUpperCase() ?? '');
    this.abilityName = parts[fields.ability] ?? '';
    this.targetId = parts[fields.targetId]?.toUpperCase() ?? '';
    this.targetName = parts[fields.target] ?? '';

    this.targetHp = parseInt(parts[fields.targetCurrentHp + fieldOffset] ?? '');
    this.targetMaxHp = parseInt(parts[fields.targetMaxHp + fieldOffset] ?? '');
    this.targetMp = parseInt(parts[fields.targetCurrentMp + fieldOffset] ?? '');
    this.targetMaxMp = parseInt(parts[fields.targetMaxMp + fieldOffset] ?? '');
    this.targetX = parseFloat(parts[fields.targetX + fieldOffset] ?? '');
    this.targetY = parseFloat(parts[fields.targetY + fieldOffset] ?? '');
    this.targetZ = parseFloat(parts[fields.targetZ + fieldOffset] ?? '');
    this.targetHeading = parseFloat(parts[fields.targetHeading + fieldOffset] ?? '');

    this.hp = parseInt(parts[fields.currentHp + fieldOffset] ?? '');
    this.maxHp = parseInt(parts[fields.maxHp + fieldOffset] ?? '');
    this.mp = parseInt(parts[fields.currentMp + fieldOffset] ?? '');
    this.maxMp = parseInt(parts[fields.maxMp + fieldOffset] ?? '');
    this.x = parseFloat(parts[fields.x + fieldOffset] ?? '');
    this.y = parseFloat(parts[fields.y + fieldOffset] ?? '');
    this.z = parseFloat(parts[fields.z + fieldOffset] ?? '');
    this.heading = parseFloat(parts[fields.heading + fieldOffset] ?? '');
    repo.updateCombatant(this.id, {
      job: undefined,
      name: this.name,
      spawn: this.timestamp,
      despawn: this.timestamp,
    });

    repo.updateCombatant(this.targetId, {
      job: undefined,
      name: this.targetName,
      spawn: this.timestamp,
      despawn: this.timestamp,
    });
  }
}

export class LineEvent21 extends LineEvent0x15 {}
