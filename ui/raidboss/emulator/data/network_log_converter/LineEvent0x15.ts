import LineEvent from './LineEvent';
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
export class LineEvent0x15 extends LineEvent {
  public readonly damage: number;
  public readonly id: string;
  public readonly name: string;
  public readonly abilityId: string;
  public readonly abilityName: string;
  public readonly targetId: string;
  public readonly targetName: string;
  public readonly flags: string;
  public readonly targetHp: string;
  public readonly targetMaxHp: string;
  public readonly targetMp: string;
  public readonly targetMaxMp: string;
  public readonly targetX: string;
  public readonly targetY: string;
  public readonly targetZ: string;
  public readonly targetHeading: string;
  public readonly sourceHp: string;
  public readonly sourceMaxHp: string;
  public readonly sourceMp: string;
  public readonly sourceMaxMp: string;
  public readonly x: string;
  public readonly y: string;
  public readonly z: string;
  public readonly heading: string;

  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);

    this.id = parts[fields.id]?.toUpperCase() ?? '';
    this.name = parts[fields.name] ?? '';

    this.flags = parts[fields.flags] ?? '';

    const fieldOffset = this.flags === '3F' ? 2 : 0;

    this.damage = LineEvent.calculateDamage(parts[fields.damage + fieldOffset] ?? '');
    this.abilityId = parts[fields.abilityId]?.toUpperCase() ?? '';
    this.abilityName = parts[fields.abilityName] ?? '';
    this.targetId = parts[fields.targetId]?.toUpperCase() ?? '';
    this.targetName = parts[fields.targetName] ?? '';

    this.targetHp = parts[fields.targetHp + fieldOffset] ?? '';
    this.targetMaxHp = parts[fields.targetMaxHp + fieldOffset] ?? '';
    this.targetMp = parts[fields.targetMp + fieldOffset] ?? '';
    this.targetMaxMp = parts[fields.targetMaxMp + fieldOffset] ?? '';
    this.targetX = parts[fields.targetX + fieldOffset] ?? '';
    this.targetY = parts[fields.targetY + fieldOffset] ?? '';
    this.targetZ = parts[fields.targetZ + fieldOffset] ?? '';
    this.targetHeading = parts[fields.targetHeading + fieldOffset] ?? '';

    this.sourceHp = parts[fields.sourceHp + fieldOffset] ?? '';
    this.sourceMaxHp = parts[fields.sourceMaxHp + fieldOffset] ?? '';
    this.sourceMp = parts[fields.sourceMp + fieldOffset] ?? '';
    this.sourceMaxMp = parts[fields.sourceMaxMp + fieldOffset] ?? '';
    this.x = parts[fields.x + fieldOffset] ?? '';
    this.y = parts[fields.y + fieldOffset] ?? '';
    this.z = parts[fields.z + fieldOffset] ?? '';
    this.heading = parts[fields.heading + fieldOffset] ?? '';


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
