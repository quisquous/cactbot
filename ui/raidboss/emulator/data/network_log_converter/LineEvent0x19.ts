import LineEvent from './LineEvent';
import EmulatorCommon from '../../EmulatorCommon';
import { LogRepository } from './LogRepository';

export type LineEvent0x19Parts = [
  string, // 0: ID
  string, // 1: Timestamp
  string, // 2: Target ID
  string, // 3: Target Name
  string, // 4: Source ID
  string, // 5: Source Name
  string, // 6: Unknown/Blank?
  string, // 7: Checksum
];

// Combatant defeated event
export class LineEvent0x19 extends LineEvent {
  id: string;
  name: string;
  targetId: string;
  targetName: string;
  resolvedName: string | false;
  resolvedTargetName: string | false;
  properCaseConvertedLine = '';
  constructor(repo: LogRepository, line: string, parts: LineEvent0x19Parts) {
    super(repo, line, parts);

    this.id = parts[2].toUpperCase();
    this.name = parts[3];
    repo.updateCombatant(this.id, {
      job: undefined,
      name: this.name,
      spawn: this.timestamp,
      despawn: this.timestamp,
    });

    this.targetId = parts[4].toUpperCase();
    this.targetName = parts[5];
    repo.updateCombatant(this.targetId, {
      job: undefined,
      name: this.targetName,
      spawn: this.timestamp,
      despawn: this.timestamp,
    });

    this.resolvedName = false;
    if (this.id !== '00')
      this.resolvedName = repo.resolveName(this.id, this.name);

    this.resolvedTargetName = false;
    if (this.targetId !== '00')
      this.resolvedTargetName = repo.resolveName(this.targetId, this.targetName);
  }

  convert(): void {
    this.convertedLine = `\
${this.prefix()}\
${this.resolvedName || this.name} \
was defeated by ${this.resolvedTargetName || this.targetName}.`;

    this.properCaseConvertedLine = `\
${this.prefix()}\
${EmulatorCommon.properCase(this.resolvedName || this.name) as string} \
was defeated by ${EmulatorCommon.properCase(this.resolvedTargetName || this.targetName) as string}.`;
  }
}

export class LineEvent25 extends LineEvent0x19 {}
