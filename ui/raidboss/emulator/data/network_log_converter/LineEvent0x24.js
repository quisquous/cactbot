'use strict';

// Limit gauge event
class LineEvent0x24 extends LineEvent {
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

class LineEvent36 extends LineEvent0x24 {}
