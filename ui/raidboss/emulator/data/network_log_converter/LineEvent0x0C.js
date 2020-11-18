import LineEvent from './LineEvent.js';

// Player stats event
export class LineEvent0x0C extends LineEvent {
  constructor(repo, line, parts) {
    super(repo, line, parts);
  }

  convert() {
    this.convertedLine = this.prefix() +
      'Player Stats: ' + this.parts.slice(2, this.parts.length - 1).join(':').replace(/\|/g, ':');
  }
}

export class LineEvent12 extends LineEvent0x0C {}
