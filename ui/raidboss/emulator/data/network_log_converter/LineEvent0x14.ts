import LineEvent from './LineEvent';
import EmulatorCommon from '../../EmulatorCommon';
import LogRepository from './LogRepository';

// Ability use event
export class LineEvent0x14 extends LineEvent {
  public properCaseConvertedLine = '';

  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);

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

  public get duration(): string {
    return this.parts[8] ?? '';
  }

  convert(_: LogRepository): void {
    const target = this.targetName.length === 0 ? 'Unknown' : this.targetName;

    this.convertedLine = this.prefix() + this.abilityId +
      ':' + this.name +
      ' starts using ' + this.abilityName +
      ' on ' + target + '.';
    this.convertedLine = this.prefix() + this.abilityId +
      ':' + EmulatorCommon.properCase(this.name) +
      ' starts using ' + this.abilityName +
      ' on ' + EmulatorCommon.properCase(target) + '.';
  }
}

export class LineEvent20 extends LineEvent0x14 { }
