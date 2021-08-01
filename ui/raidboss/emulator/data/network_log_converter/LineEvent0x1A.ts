import logDefinitions from '../../../../../resources/netlog_defs';
import EmulatorCommon from '../../EmulatorCommon';

import LineEvent from './LineEvent';
import LogRepository from './LogRepository';

const fields = logDefinitions.networkBuff.fields;

// Gain status effect event
// Deliberately don't flag this as LineEventSource or LineEventTarget
// because 0x1A line values aren't accurate
export class LineEvent0x1A extends LineEvent {
  public readonly resolvedName: string;
  public readonly resolvedTargetName: string;
  public readonly fallbackResolvedTargetName: string;
  public override readonly properCaseConvertedLine: string;

  public readonly effectId: number;
  public readonly effect: string;
  public readonly durationFloat: number;
  public readonly durationString: string;
  public readonly id: string;
  public readonly name: string;
  public readonly targetId: string;
  public readonly targetName: string;
  public readonly stacks: number;
  public readonly targetHp: number;
  public readonly hp: number;

  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);

    this.effectId = parseInt(parts[fields.effectId]?.toUpperCase() ?? '');
    this.effect = parts[fields.effect] ?? '';
    this.durationString = parts[fields.duration] ?? '';
    this.durationFloat = parseFloat(this.durationString);
    this.id = parts[fields.sourceId]?.toUpperCase() ?? '';
    this.name = parts[fields.source] ?? '';
    this.targetId = parts[fields.targetId]?.toUpperCase() ?? '';
    this.targetName = parts[fields.target] ?? '';
    this.stacks = parseInt(parts[fields.count] ?? '0');
    this.targetHp = parseInt(parts[fields.targetHp] ?? '');
    this.hp = parseInt(parts[fields.hp] ?? '');

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
      LineEvent0x1A.showStackCountFor.includes(this.effectId))
      stackCountText = ' (' + this.stacks.toString() + ')';

    this.convertedLine = this.prefix() + this.targetId +
      ':' + this.targetName +
      ' gains the effect of ' + this.effect +
      ' from ' + this.fallbackResolvedTargetName +
      ' for ' + this.durationString + ' Seconds.' + stackCountText;

    this.properCaseConvertedLine = this.prefix() + this.targetId +
      ':' + EmulatorCommon.properCase(this.targetName) +
      ' gains the effect of ' + this.effect +
      ' from ' + EmulatorCommon.properCase(this.fallbackResolvedTargetName) +
      ' for ' + this.durationString + ' Seconds.' + stackCountText;
  }

  static showStackCountFor: readonly number[] = [
    304, // Aetherflow
    406, // Vulnerability Down
    350, // Vulnerability Down
    714, // Vulnerability Up
    505, // Damage Up
    1239, // Embolden
    1297, // Embolden
  ] as const;
}

export class LineEvent26 extends LineEvent0x1A {}
