import LineEvent from './LineEvent';
import LogRepository from './LogRepository';

const fields = {
  valueHex: 2,
  bars: 3,
} as const;

// Limit gauge event
export class LineEvent0x24 extends LineEvent {
  public readonly valueHex: string;
  public readonly valueDec: number;
  public readonly bars: string;

  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);

    this.valueHex = parts[fields.valueHex] ?? '';
    this.valueDec = parseInt(this.valueHex, 16);
    this.bars = parts[fields.bars] ?? '';

    this.convertedLine = this.prefix() + 'Limit Break: ' + this.valueHex;
  }
}

export class LineEvent36 extends LineEvent0x24 {}
