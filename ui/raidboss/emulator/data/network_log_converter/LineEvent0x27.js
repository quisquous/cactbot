import LineEvent from './LineEvent.js';

// Network update hp event
export class LineEvent0x27 extends LineEvent {
  constructor(repo, line, parts) {
    super(repo, line, parts);

    this.id = parts[2].toUpperCase();
    this.name = parts[3];

    this.hp = parts[4];
    this.maxHp = parts[5];

    this.mp = parts[6];
    this.maxMp = parts[7];

    this.x = parts[10];
    this.y = parts[11];
    this.z = parts[12];
    this.heading = parts[13];
  }
}

export class LineEvent39 extends LineEvent0x27 {}
