'use strict';

// Waymarker
class LineEvent0x1D extends LineEvent {
  constructor(repo, line, parts) {
    super(repo, line, parts);
  }
}

class LineEvent29 extends LineEvent0x1D {}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    LineEvent0x1D: LineEvent0x1D,
    LineEvent29: LineEvent29,
  };
}
