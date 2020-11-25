import LineEvent from './LineEvent.js';
import EmulatorCommon from '../../EmulatorCommon.js';
import { Util } from '../../../../../resources/common.js';

// Added combatant event
export class LineEvent0x03 extends LineEvent {
  constructor(repo, line, parts) {
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

  convert() {
    let CombatantName = this.name;
    if (this.server !== '')
      CombatantName = CombatantName + '(' + this.server + ')';

    this.convertedLine = this.prefix() +
      this.id.toUpperCase() + ':' +
      'Added new combatant ' + CombatantName +
      '.  Job: ' + this.jobName +
      ' Level: ' + this.level +
      ' Max HP: ' + this.maxHp +
      ' Max MP: ' + this.maxMp +
      ' Pos: (' + this.parts[17] + ',' + this.parts[18] + ',' + this.parts[19] + ')';

    // This last part is guesswork for the area between 9 and 10.
    const UnknownValue = this.parts[9] +
      EmulatorCommon.zeroPad(this.parts[10], 8 + Math.max(0, 6 - this.parts[9].length));

    if (UnknownValue !== '00000000000000')
      this.convertedLine += ' (' + UnknownValue + ')';

    this.convertedLine += '.';
  }
}

export class LineEvent03 extends LineEvent0x03 {}
