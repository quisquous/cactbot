'use strict';

// Player change event
class LineEvent0x02 extends LineEvent {
  constructor(repo, line, parts) {
    super(repo, line, parts);

    this.id = parts[2].toUpperCase();
    this.name = parts[3];
  }

  convert() {
    this.convertedLine = this.prefix() + 'Changed primary player to ' + this.name + '.';
  }
}

class LineEvent02 extends LineEvent0x02 {}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    LineEvent0x02: LineEvent0x02,
    LineEvent02: LineEvent02,
  };
}
