'use strict';

// Removed combatant event
// Extend the add combatant event to reduce duplicate code since they're
// the same from a data perspective
class LineEvent0x04 extends LineEvent0x03 {
  constructor(repo, line, parts) {
    super(repo, line, parts);
  }

  convert() {
    this.convertedLine = this.prefix() +
      this.id.toUpperCase() + ':' +
      'Removing combatant ' + this.name +
      '.  Max HP: ' + this.maxHp +
      '. Pos: (' + this.parts[17] + ',' + this.parts[18] + ',' + this.parts[19] + ').';
  }
}

class LineEvent04 extends LineEvent0x04 {}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    LineEvent0x04: LineEvent0x04,
    LineEvent04: LineEvent04,
  };
}
