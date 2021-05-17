import LineEvent from './LineEvent';
import EmulatorCommon from '../../EmulatorCommon';
import Util from '../../../../../resources/util';
import { LogRepository } from './LogRepository';

export type LineEvent0x03Parts = [
  string, // 0: ID
  string, // 1: Timestamp
  string, // 2: ID
  string, // 3: Name
  string, // 4: Job ID
  string, // 5: Level
  string, // 6: Owner ID
  string, // 7: World ID
  string, // 8: World Name
  string, // 9: NPC Name ID
  string, // 10: NPC Base ID
  string, // 11: Current HP
  string, // 12: Max HP
  string, // 13: Current MP
  string, // 14: Max MP
  string, // 15: Current TP
  string, // 16: Max TP
  string, // 17: X
  string, // 18: Y
  string, // 19: Z
  string, // 20: Heading
  string, // 21: Unknown/Blank?
  string, // 22: Checksum
];

// Added combatant event
export class LineEvent0x03 extends LineEvent {
  id: string;
  name: string;
  server: string;
  jobIdHex: string;
  jobIdDec: number;
  jobName: string;
  level: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  x: number;
  y: number;
  z: number;
  heading: number;
  constructor(repo: LogRepository, line: string, public parts: LineEvent0x03Parts) {
    super(repo, line, parts);

    this.id = parts[2].toUpperCase();
    this.name = parts[3];
    this.server = parts[8];

    this.jobIdHex = parts[4].toUpperCase();
    this.jobIdDec = parseInt(this.jobIdHex, 16);
    this.jobName = Util.jobEnumToJob(this.jobIdDec);

    this.level = parseInt(parts[5], 16);

    this.hp = parseInt(parts[11]);
    this.maxHp = parseInt(parts[12]);

    this.mp = parseInt(parts[13]);
    this.maxMp = parseInt(parts[14]);

    this.x = parseFloat(parts[17]);
    this.y = parseFloat(parts[18]);
    this.z = parseFloat(parts[19]);
    this.heading = parseFloat(parts[20]);

    repo.updateCombatant(this.id, {
      name: this.name,
      spawn: this.timestamp,
      despawn: this.timestamp,
      job: this.jobIdHex,
    });
  }

  convert(): void {
    let CombatantName = this.name;
    if (this.server !== '')
      CombatantName = CombatantName + '(' + this.server + ')';

    this.convertedLine = `\
${this.prefix()}${this.id.toUpperCase()}:\
Added new combatant ${CombatantName}.\
  Job: ${this.jobName}\
 Level: ${this.level}\
 Max HP: ${this.maxHp}\
 Max MP: ${this.maxMp}\
 Pos: (${this.parts[17]},${this.parts[18]},${this.parts[19]})`;

    // This last part is guesswork for the area between 9 and 10.
    const UnknownValue = this.parts[9] +
      EmulatorCommon.zeroPad(this.parts[10], 8 + Math.max(0, 6 - this.parts[9].length));

    if (UnknownValue !== '00000000000000')
      this.convertedLine += ' (' + UnknownValue + ')';

    this.convertedLine += '.';
  }
}

export class LineEvent03 extends LineEvent0x03 {}
