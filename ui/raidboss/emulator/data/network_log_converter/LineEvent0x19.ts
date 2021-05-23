import LineEvent from './LineEvent';
import EmulatorCommon from '../../EmulatorCommon';
import LogRepository from './LogRepository';

// Combatant defeated event
export class LineEvent0x19 extends LineEvent {
  public resolvedName?: string;
  public resolvedTargetName?: string;
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

    if (this.id !== '00')
      this.resolvedName = repo.resolveName(this.id, this.name);

    if (this.targetId !== '00')
      this.resolvedTargetName = repo.resolveName(this.targetId, this.targetName);
  }

  public get id(): string {
    return this.parts[2]?.toUpperCase() ?? '';
  }

  public get name(): string {
    return this.parts[3] ?? '';
  }

  public get targetId(): string {
    return this.parts[4]?.toUpperCase() ?? '';
  }

  public get targetName(): string {
    return this.parts[5] ?? '';
  }

  convert(_: LogRepository): void {
    const defeatedName = (this.resolvedName ?? this.name);
    const killerName = (this.resolvedTargetName ?? this.targetName);
    this.convertedLine = this.prefix() + defeatedName +
      ' was defeated by ' + killerName + '.';
    this.properCaseConvertedLine = this.prefix() + EmulatorCommon.properCase(defeatedName) +
      ' was defeated by ' + EmulatorCommon.properCase(killerName) + '.';
  }
}

export class LineEvent25 extends LineEvent0x19 { }
