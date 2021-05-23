import LineEvent from './LineEvent';
import LogRepository from './LogRepository';

// Ability hit single target event
export class LineEvent0x15 extends LineEvent {
  private fieldOffset = 0;

  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);

    if (this.flags === '3F')
      this.fieldOffset = 2;

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

  public get damage(): number {
    return LineEvent.calculateDamage(this.parts[9 + this.fieldOffset] ?? '');
  }

  public get id(): string {
    return this.parts[2]?.toUpperCase() ?? '';
  }

  public get name(): string {
    return this.parts[3] ?? '';
  }

  public get abilityId(): string {
    return this.parts[4]?.toUpperCase() ?? '';
  }

  public get abilityName(): string {
    return this.parts[5] ?? '';
  }

  public get targetId(): string {
    return this.parts[6]?.toUpperCase() ?? '';
  }

  public get targetName(): string {
    return this.parts[7] ?? '';
  }

  public get flags(): string {
    return this.parts[8] ?? '';
  }

  public get targetHp(): string {
    return this.parts[24 + this.fieldOffset] ?? '';
  }

  public get targetMaxHp(): string {
    return this.parts[25 + this.fieldOffset] ?? '';
  }

  public get targetMp(): string {
    return this.parts[26 + this.fieldOffset] ?? '';
  }

  public get targetMaxMp(): string {
    return this.parts[27 + this.fieldOffset] ?? '';
  }

  public get targetX(): string {
    return this.parts[30 + this.fieldOffset] ?? '';
  }

  public get targetY(): string {
    return this.parts[31 + this.fieldOffset] ?? '';
  }

  public get targetZ(): string {
    return this.parts[32 + this.fieldOffset] ?? '';
  }

  public get targetHeading(): string {
    return this.parts[33 + this.fieldOffset] ?? '';
  }

  public get sourceHp(): string {
    return this.parts[34 + this.fieldOffset] ?? '';
  }

  public get sourceMaxHp(): string {
    return this.parts[35 + this.fieldOffset] ?? '';
  }

  public get sourceMp(): string {
    return this.parts[36 + this.fieldOffset] ?? '';
  }

  public get sourceMaxMp(): string {
    return this.parts[37 + this.fieldOffset] ?? '';
  }

  public get x(): string {
    return this.parts[40 + this.fieldOffset] ?? '';
  }

  public get y(): string {
    return this.parts[41 + this.fieldOffset] ?? '';
  }

  public get z(): string {
    return this.parts[42 + this.fieldOffset] ?? '';
  }

  public get heading(): string {
    return this.parts[43 + this.fieldOffset] ?? '';
  }
}

export class LineEvent21 extends LineEvent0x15 {}
