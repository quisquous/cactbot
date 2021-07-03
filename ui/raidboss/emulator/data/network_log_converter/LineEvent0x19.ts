import EmulatorCommon from '../../EmulatorCommon';

import LineEvent from './LineEvent';
import LogRepository from './LogRepository';

const fields = {
  id: 2,
  name: 3,
  targetId: 4,
  targetName: 5,
} as const;

// Combatant defeated event
export class LineEvent0x19 extends LineEvent {
  public readonly properCaseConvertedLine: string;
  public readonly id: string;
  public readonly name: string;
  public readonly targetId: string;
  public readonly targetName: string;

  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);

    this.id = parts[fields.id]?.toUpperCase() ?? '';
    this.name = parts[fields.name] ?? '';
    this.targetId = parts[fields.targetId]?.toUpperCase() ?? '';
    this.targetName = parts[fields.targetName] ?? '';

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

    let resolvedName: string | undefined = undefined;
    let resolvedTargetName: string | undefined = undefined;

    if (this.id !== '00')
      resolvedName = repo.resolveName(this.id, this.name);

    if (this.targetId !== '00')
      resolvedTargetName = repo.resolveName(this.targetId, this.targetName);

    const defeatedName = (resolvedName ?? this.name);
    const killerName = (resolvedTargetName ?? this.targetName);
    this.convertedLine = this.prefix() + defeatedName +
      ' was defeated by ' + killerName + '.';
    this.properCaseConvertedLine = this.prefix() + EmulatorCommon.properCase(defeatedName) +
      ' was defeated by ' + EmulatorCommon.properCase(killerName) + '.';
  }
}

export class LineEvent25 extends LineEvent0x19 { }
