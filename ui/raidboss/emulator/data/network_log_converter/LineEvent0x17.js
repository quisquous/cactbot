import LineEvent from './LineEvent.js';

// Cancel ability event
export class LineEvent0x17 extends LineEvent {
  constructor(repo, line, parts) {
    super(repo, line, parts);

    this.id = parts[2].toUpperCase();
    this.name = parts[3];

    this.abilityId = parts[4].toUpperCase();
    this.abilityName = parts[5];
  }
}

export class LineEvent23 extends LineEvent0x17 {}
