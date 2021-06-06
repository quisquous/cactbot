import LineEvent, { LineEventAbility, LineEventSource, LineEventTarget } from './LineEvent';
import LogRepository from './LogRepository';

const fields = {
  id: 2,
  name: 3,
  flags: 8,
  damage: 9,
  abilityId: 4,
  abilityName: 5,
  targetId: 6,
  targetName: 7,
  targetHp: 24,
  targetMaxHp: 25,
  targetMp: 26,
  targetMaxMp: 27,
  targetX: 30,
  targetY: 31,
  targetZ: 32,
  targetHeading: 33,
  sourceHp: 34,
  sourceMaxHp: 35,
  sourceMp: 36,
  sourceMaxMp: 37,
  x: 40,
  y: 41,
  z: 42,
  heading: 43,
} as const;

// Ability hit single target event
export class LineEvent0x15 extends LineEvent
  implements LineEventSource, LineEventTarget, LineEventAbility {
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

    this.id = parts[fields.id]?.toUpperCase() ?? '';
    this.name = parts[fields.name] ?? '';

    this.flags = parts[fields.flags] ?? '';

    const fieldOffset = this.flags === '3F' ? 2 : 0;

    this.damage = LineEvent.calculateDamage(parts[fields.damage + fieldOffset] ?? '');
    this.abilityId = parseInt(parts[fields.abilityId]?.toUpperCase() ?? '');
    this.abilityName = parts[fields.abilityName] ?? '';
    this.targetId = parts[fields.targetId]?.toUpperCase() ?? '';
    this.targetName = parts[fields.targetName] ?? '';

    this.targetHp = parseInt(parts[fields.targetHp + fieldOffset] ?? '');
    this.targetMaxHp = parseInt(parts[fields.targetMaxHp + fieldOffset] ?? '');
    this.targetMp = parseInt(parts[fields.targetMp + fieldOffset] ?? '');
    this.targetMaxMp = parseInt(parts[fields.targetMaxMp + fieldOffset] ?? '');
    this.targetX = parseFloat(parts[fields.targetX + fieldOffset] ?? '');
    this.targetY = parseFloat(parts[fields.targetY + fieldOffset] ?? '');
    this.targetZ = parseFloat(parts[fields.targetZ + fieldOffset] ?? '');
    this.targetHeading = parseFloat(parts[fields.targetHeading + fieldOffset] ?? '');

    this.hp = parseInt(parts[fields.sourceHp + fieldOffset] ?? '');
    this.maxHp = parseInt(parts[fields.sourceMaxHp + fieldOffset] ?? '');
    this.mp = parseInt(parts[fields.sourceMp + fieldOffset] ?? '');
    this.maxMp = parseInt(parts[fields.sourceMaxMp + fieldOffset] ?? '');
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
