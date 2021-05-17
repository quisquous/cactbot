import LineEvent from './LineEvent';
import EmulatorCommon from '../../EmulatorCommon';
import { LogRepository } from './LogRepository';

export type LineEvent0x14Parts = [
  string, // 0: ID
  string, // 1: Timestamp
  string, // 2: Source ID
  string, // 3: Source Name
  string, // 4: Ability ID
  string, // 5: Ability Name
  string, // 6: Target ID
  string, // 7: Target Name
  string, // 8: Duration
  string, // 9: Unknown/Blank?
  string, // 10: Checksum
];

// Ability use event
export class LineEvent0x14 extends LineEvent {
  id: string;
  name: string;
  abilityId: string;
  abilityName: string;
  targetId: string;
  targetName: string;
  castTime: string;
  properCaseConvertedLine = '';
  constructor(repo: LogRepository, line: string, public parts: LineEvent0x14Parts) {
    super(repo, line, parts);

    this.id = parts[2].toUpperCase();
    this.name = parts[3];
    repo.updateCombatant(this.id, {
      job: undefined,
      name: this.name,
      spawn: this.timestamp,
      despawn: this.timestamp,
    });

    this.abilityId = parts[4].toUpperCase();
    this.abilityName = parts[5];

    this.targetId = parts[6].toUpperCase();
    this.targetName = parts[7];
    repo.updateCombatant(this.targetId, {
      job: undefined,
      name: this.targetName,
      spawn: this.timestamp,
      despawn: this.timestamp,
    });

    this.castTime = parts[8];
  }

  convert(): void {
    const target = this.targetName.length === 0 ? 'Unknown' : this.targetName;

    this.convertedLine = `\
${this.prefix()}${this.abilityId}:\
${this.name} \
starts using ${this.abilityName} \
on ${target}.`;
    this.properCaseConvertedLine = `\
${this.prefix()}${this.abilityId}:\
${EmulatorCommon.properCase(this.name) as string} \
starts using ${this.abilityName} \
on ${EmulatorCommon.properCase(target) as string}.`;
  }
}

export class LineEvent20 extends LineEvent0x14 {}
