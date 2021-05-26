import LineEvent from './LineEvent';
import EmulatorCommon from '../../EmulatorCommon';
import LogRepository from './LogRepository';

const fields = {
  id: 2,
  name: 3,
  abilityId: 4,
  abilityName: 5,
  targetId: 6,
  targetName: 7,
  duration: 8,
} as const;

// Ability use event
export class LineEvent0x14 extends LineEvent {
  public readonly properCaseConvertedLine: string;

  public readonly id: string;
  public readonly name: string;
  public readonly abilityId: string;
  public readonly abilityName: string;
  public readonly targetId: string;
  public readonly targetName: string;
  public readonly duration: string;

  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);

    this.id = parts[fields.id]?.toUpperCase() ?? '';
    this.name = parts[fields.name] ?? '';
    this.abilityId = parts[fields.abilityId]?.toUpperCase() ?? '';
    this.abilityName = parts[fields.abilityName] ?? '';
    this.targetId = parts[fields.targetId]?.toUpperCase() ?? '';
    this.targetName = parts[fields.targetName] ?? '';
    this.duration = parts[fields.duration] ?? '';

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

    const target = this.targetName.length === 0 ? 'Unknown' : this.targetName;

    this.convertedLine = this.prefix() + this.abilityId +
      ':' + this.name +
      ' starts using ' + this.abilityName +
      ' on ' + target + '.';
    this.properCaseConvertedLine = this.prefix() + this.abilityId +
      ':' + EmulatorCommon.properCase(this.name) +
      ' starts using ' + this.abilityName +
      ' on ' + EmulatorCommon.properCase(target) + '.';
  }
}

export class LineEvent20 extends LineEvent0x14 { }
