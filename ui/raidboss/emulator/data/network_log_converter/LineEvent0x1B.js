'use strict';

// Head marker event
class LineEvent0x1B extends LineEvent {
  constructor(repo, line, parts) {
    super(repo, line, parts);

    this.targetId = parts[2].toUpperCase();
    this.targetName = parts[3];
  }
}

class LineEvent27 extends LineEvent0x1B {}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    LineEvent0x1B: LineEvent0x1B,
    LineEvent27: LineEvent27,
  };
}
