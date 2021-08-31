import logDefinitions from '../../../../../resources/netlog_defs';
import EmulatorCommon from '../../EmulatorCommon';

import LineEvent from './LineEvent';
import LogRepository from './LogRepository';

const fields = logDefinitions.WasDefeated.fields;

// Combatant defeated event
export class LineEvent0x19 extends LineEvent {
  public readonly targetId: string;
  public readonly targetName: string;
  public readonly sourceId: string;
  public readonly sourceName: string;

  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);

    this.targetId = parts[fields.targetId]?.toUpperCase() ?? '';
    this.targetName = parts[fields.target] ?? '';
    this.sourceId = parts[fields.sourceId]?.toUpperCase() ?? '';
    this.sourceName = parts[fields.source] ?? '';

    repo.updateCombatant(this.sourceId, {
      job: undefined,
      name: this.sourceName,
      spawn: this.timestamp,
      despawn: this.timestamp,
    });

    repo.updateCombatant(this.targetId, {
      job: undefined,
      name: this.targetName,
      spawn: this.timestamp,
      despawn: this.timestamp,
    });

    let resolvedSourceName: string | undefined;
    let resolvedTargetName: string | undefined;

    if (this.sourceId !== '00')
      resolvedSourceName = repo.resolveName(this.sourceId, this.sourceName);

    if (this.targetId !== '00')
      resolvedTargetName = repo.resolveName(this.targetId, this.targetName);

    const defeatedName = (resolvedTargetName ?? this.sourceName);
    const killerName = (resolvedSourceName ?? this.sourceName);
    this.convertedLine = this.prefix() + EmulatorCommon.properCase(defeatedName) +
      ' was defeated by ' + EmulatorCommon.properCase(killerName) + '.';
  }
}

export class LineEvent25 extends LineEvent0x19 {}
