import LineEvent from './LineEvent';
import LogRepository from './LogRepository';

// Limit gauge event
export class LineEvent0x24 extends LineEvent {
  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);
  }

  public get valueHex(): string {
    return this.parts[2] ?? '';
  }

  public get valueDec(): number {
    return parseInt(this.valueHex, 16);
  }

  public get bars(): string {
    return this.parts[3] ?? '';
  }

  convert(_: LogRepository): void {
    this.convertedLine = this.prefix() + 'Limit Break: ' + this.valueHex;
  }
}

export class LineEvent36 extends LineEvent0x24 {}
