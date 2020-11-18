import LineEvent from './LineEvent.js';

// Limit gauge event
export class LineEvent0x24 extends LineEvent {
  constructor(repo, line, parts) {
    super(repo, line, parts);
    this.value = parseInt(parts[2], 16);
    this.bars = parts[3];
  }

  convert() {
    this.convertedLine = this.prefix() +
      'Limit Break: ' + this.parts[2];
  }
}

export class LineEvent36 extends LineEvent0x24 {}
