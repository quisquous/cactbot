import LineEvent from './LineEvent';
import EmulatorCommon from '../../EmulatorCommon';
import LogRepository from './LogRepository';

const fields = {
  abilityId: 2,
  abilityName: 3,
  durationString: 4,
  id: 5,
  name: 6,
  targetId: 7,
  targetName: 8,
  stacks: 9,
  targetHp: 10,
  sourceHp: 11,
} as const;

// Gain status effect event
export class LineEvent0x1A extends LineEvent {
  public readonly resolvedName: string;
  public readonly resolvedTargetName: string;
  public readonly fallbackResolvedTargetName: string;
  public readonly properCaseConvertedLine: string;

  public readonly abilityId: string;
  public readonly abilityName: string;
  public readonly durationFloat: number;
  public readonly durationString: string;
  public readonly id: string;
  public readonly name: string;
  public readonly targetId: string;
  public readonly targetName: string;
  public readonly stacks: number;
  public readonly targetHp: string;
  public readonly sourceHp: string;

  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);

    this.abilityId = parts[fields.abilityId]?.toUpperCase() ?? '';
    this.abilityName = parts[fields.abilityName] ?? '';
    this.durationString = parts[fields.durationString] ?? '';
    this.durationFloat = parseFloat(this.durationString);
    this.id = parts[fields.id]?.toUpperCase() ?? '';
    this.name = parts[fields.name] ?? '';
    this.targetId = parts[fields.targetId]?.toUpperCase() ?? '';
    this.targetName = parts[fields.targetName] ?? '';
    this.stacks = parseInt(parts[fields.stacks] ?? '0');
    this.targetHp = parts[fields.targetHp] ?? '';
    this.sourceHp = parts[fields.sourceHp] ?? '';

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

    let stackCountText = '';
    if (this.stacks > 0 && this.stacks < 20 &&
      LineEvent0x1A.showStackCountFor.includes(this.abilityId))
      stackCountText = ' (' + this.stacks.toString() + ')';

    this.convertedLine = this.prefix() + this.targetId +
      ':' + this.targetName +
      ' gains the effect of ' + this.abilityName +
      ' from ' + this.fallbackResolvedTargetName +
      ' for ' + this.durationString + ' Seconds.' + stackCountText;

    this.properCaseConvertedLine = this.prefix() + this.targetId +
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
