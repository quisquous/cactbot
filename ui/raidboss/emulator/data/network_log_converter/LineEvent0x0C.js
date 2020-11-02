'use strict';

// Player stats event
class LineEvent0x0C extends LineEvent {
  constructor(repo, line, parts) {
    super(repo, line, parts);
  }

  convert() {
    this.convertedLine = this.prefix() +
      'Player Stats: ' + this.parts.slice(2, this.parts.length - 1).join(':').replace(/\|/g, ':');
  }
}

class LineEvent12 extends LineEvent0x0C {}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    LineEvent0x0C: LineEvent0x0C,
    LineEvent12: LineEvent12,
  };
}
