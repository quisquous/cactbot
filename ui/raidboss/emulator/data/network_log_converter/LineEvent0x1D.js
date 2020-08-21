'use strict';

// Head waymarker event
class LineEvent0x1D extends LineEvent {
  constructor(repo, line, parts) {
    super(repo, line, parts);

    this.id = parts[4].toUpperCase();
    this.name = parts[5];

    this.targetId = parts[6].toUpperCase();
    this.targetName = parts[7];
  }
}

class LineEvent29 extends LineEvent0x1D {}
