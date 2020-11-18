import LineEvent from './LineEvent.js';

// Player change event
export class LineEvent0x02 extends LineEvent {
  constructor(repo, line, parts) {
    super(repo, line, parts);

    this.id = parts[2].toUpperCase();
    this.name = parts[3];
  }

  convert() {
    this.convertedLine = this.prefix() + 'Changed primary player to ' + this.name + '.';
  }
}

export class LineEvent02 extends LineEvent0x02 {}
