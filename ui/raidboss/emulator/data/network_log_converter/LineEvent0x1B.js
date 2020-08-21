'use strict';

// Head marker event
class LineEvent0x1B extends LineEvent {
  constructor(repo, line, parts) {
    super(repo, line, parts);

    this.id = parts[2].toUpperCase();
    this.name = parts[3];
  }
}

class LineEvent27 extends LineEvent0x1B {}
