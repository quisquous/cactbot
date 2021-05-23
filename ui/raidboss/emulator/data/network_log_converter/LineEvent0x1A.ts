import LineEvent from './LineEvent';
import EmulatorCommon from '../../EmulatorCommon';
import LogRepository from './LogRepository';

// Gain status effect event
export class LineEvent0x1A extends LineEvent {
  public resolvedName: string;
  public resolvedTargetName: string;
  public fallbackResolvedTargetName: string;
  public properCaseConvertedLine = '';

  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);

    repo.updateCombatant(this.id, {
      name: this.name,
      spawn: this.timestamp,
      despawn: this.timestamp,
      job: undefined,
    });

    repo.updateCombatant(this.targetId, {
      name: this.targetName,
      spawn: this.timestamp,
      despawn: this.timestamp,
      job: undefined,
    });

    this.resolvedName = repo.resolveName(this.id, this.name);
    this.resolvedTargetName = repo.resolveName(this.targetId, this.targetName);

    this.fallbackResolvedTargetName =
      repo.resolveName(this.id, this.name, this.targetId, this.targetName);
  }

  public get abilityId(): string {
    return this.parts[2]?.toUpperCase() ?? '';
  }

  public get abilityName(): string {
    return this.parts[3] ?? '';
  }

  public get durationFloat(): number {
    return parseFloat(this.durationString);
  }

  public get durationString(): string {
    return this.parts[4] ?? '';
  }

  public get id(): string {
    return this.parts[5]?.toUpperCase() ?? '';
  }

  public get name(): string {
    return this.parts[6] ?? '';
  }

  public get targetId(): string {
    return this.parts[7]?.toUpperCase() ?? '';
  }

  public get targetName(): string {
    return this.parts[8] ?? '';
  }

  public get stacks(): number {
    return parseInt(this.parts[9] ?? '0');
  }

  public get targetHp(): string {
    return this.parts[10] ?? '';
  }

  public get sourceHp(): string {
    return this.parts[11] ?? '';
  }

  convert(_: LogRepository): void {
    let stackCountText = '';
    if (this.stacks > 0 && this.stacks < 20 &&
      LineEvent0x1A.showStackCountFor.includes(this.abilityId))
      stackCountText = ' (' + this.stacks.toString() + ')';

    this.convertedLine = this.prefix() + this.targetId +
    ':' + this.targetName +
    ' gains the effect of ' + this.abilityName +
    ' from ' + this.fallbackResolvedTargetName +
    ' for ' + this.durationString + ' Seconds.' + stackCountText;

    this.convertedLine = this.prefix() + this.targetId +
    ':' + EmulatorCommon.properCase(this.targetName) +
    ' gains the effect of ' + this.abilityName +
    ' from ' + EmulatorCommon.properCase(this.fallbackResolvedTargetName) +
    ' for ' + this.durationString + ' Seconds.' + stackCountText;
  }

  static showStackCountFor: readonly string[] = [
    '130', // Aetherflow
    '196', // Vulnerability Down
    '15e', // Vulnerability Down
    '2ca', // Vulnerability Up
    '1f9', // Damage Up
    '4d7', // Embolden
    '511', // Embolden
  ] as const;
}

export class LineEvent26 extends LineEvent0x1A {}
