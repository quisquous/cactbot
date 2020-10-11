'use strict';

// Ability hit multiple/no target event
// Duplicate of 0x15 as far as data
class LineEvent0x16 extends LineEvent0x15 {
  constructor(repo, line, parts) {
    super(repo, line, parts);
  }
}

class LineEvent22 extends LineEvent0x16 {}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    LineEvent0x16: LineEvent0x16,
    LineEvent22: LineEvent22,
  };
}
