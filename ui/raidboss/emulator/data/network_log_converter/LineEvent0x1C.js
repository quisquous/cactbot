import LineEvent from './LineEvent.js';

// Floor waymarker event
export class LineEvent0x1C extends LineEvent {
  constructor(repo, line, parts) {
    super(repo, line, parts);

    this.id = parts[4].toUpperCase();
    this.name = parts[5];
  }
}

export class LineEvent28 extends LineEvent0x1C {}
