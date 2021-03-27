import LineEvent from './LineEvent';

// Tether event
export class LineEvent0x23 extends LineEvent {
  constructor(repo, line, parts) {
    super(repo, line, parts);

    this.id = parts[2].toUpperCase();
    this.name = parts[3];

    this.targetId = parts[4].toUpperCase();
    this.targetName = parts[5];
  }
}

export class LineEvent35 extends LineEvent0x23 {}
