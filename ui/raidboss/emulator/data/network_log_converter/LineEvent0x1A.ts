import LineEvent from './LineEvent';
import EmulatorCommon from '../../EmulatorCommon';
import { LogRepository } from './LogRepository';

export type LineEvent0x1AParts = [
  string, // 0: ID
  string, // 1: Timestamp
  string, // 2: Ability ID
  string, // 3: Ability Name
  string, // 4: Duration
  string, // 5: Source ID
  string, // 6: Source Name
  string, // 7: Target ID
  string, // 8: Target Name
  string, // 9: Stacks
  string, // 10: Target HP???
  string, // 11: Source HP???
  string, // 12: Unknown?
  string, // 13: Checksum
];

// Gain status effect event
export class LineEvent0x1A extends LineEvent {
  abilityId: string;
  abilityName: string;
  duration: number;
  stacks: number;
  id: string;
  name: string;
  targetId: string;
  targetName: string;
  resolvedName: string;
  resolvedTargetName: string;
  fallbackResolvedTargetName: string;
  properCaseConvertedLine = '';
  constructor(repo: LogRepository, line: string, public parts: LineEvent0x1AParts) {
    super(repo, line, parts);

    this.abilityId = parts[2].toUpperCase();
    this.abilityName = parts[3];

    this.duration = parseFloat(parts[4]);
    this.stacks = parseInt(parts[9], 16);

    this.id = parts[5].toUpperCase();
    this.name = parts[6];
    repo.updateCombatant(this.id, {
      name: this.name,
      spawn: this.timestamp,
      despawn: this.timestamp,
      job: undefined,
    });

    this.targetId = parts[7].toUpperCase();
    this.targetName = parts[8];
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

  convert(): void {
    let stackCountText = '';
    if (this.stacks > 0 && this.stacks < 20 &&
      LineEvent0x1A.showStackCountFor.includes(this.abilityId))
      stackCountText = ` (${this.stacks})`;

    this.convertedLine = `\
${this.prefix()}${this.targetId}:${this.targetName} \
gains the effect of ${this.abilityName} \
from ${this.fallbackResolvedTargetName} \
for ${this.parts[4]} Seconds.${stackCountText}`;

    this.properCaseConvertedLine = `\
${this.prefix()}${this.targetId}:${EmulatorCommon.properCase(this.targetName) as string} \
gains the effect of ${this.abilityName} \
from ${EmulatorCommon.properCase(this.fallbackResolvedTargetName) as string} \
for ${this.parts[4]} Seconds.${stackCountText}`;
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
