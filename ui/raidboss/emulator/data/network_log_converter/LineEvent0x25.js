import LineEvent from './LineEvent.js';
import { LineEvent0x1E } from './LineEvent0x1E.js';

// Action sync event
export class LineEvent0x25 extends LineEvent {
  constructor(repo, line, parts) {
    super(repo, line, parts);

    this.id = parts[2].toUpperCase();
    this.name = parts[3];

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

export class LineEvent37 extends LineEvent0x25 {}
