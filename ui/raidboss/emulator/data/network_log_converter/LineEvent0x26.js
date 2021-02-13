import LineEvent from './LineEvent.js';
import EmulatorCommon from '../../EmulatorCommon.js';
import { Util } from '../../../../../resources/common.js';

// Network status effect event
export class LineEvent0x26 extends LineEvent {
  constructor(repo, line, parts) {
    super(repo, line, parts);

    this.id = parts[2].toUpperCase();
    this.name = parts[3];

    const padded = EmulatorCommon.zeroPad(parts[4], 8);

    this.jobIdHex = padded.substr(6, 2).toUpperCase();
    this.jobIdDec = parseInt(this.jobIdHex, 16);
    this.jobName = Util.jobEnumToJob(this.jobIdDec);

    this.level = parseInt(padded.substr(4, 2), 16);

    this.hp = parts[5];
    this.maxHp = parts[6];

    this.mp = parts[7];
    this.maxMp = parts[8];

    this.x = parts[11];
    this.y = parts[12];
    this.z = parts[13];
    this.heading = parts[14];
  }
}

export class LineEvent38 extends LineEvent0x26 {}
