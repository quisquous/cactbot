import LineEvent from './LineEvent.js';

// Head marker event
export class LineEvent0x1B extends LineEvent {
  constructor(repo, line, parts) {
    super(repo, line, parts);

    this.targetId = parts[2].toUpperCase();
    this.targetName = parts[3];
  }
}

export class LineEvent27 extends LineEvent0x1B {}
