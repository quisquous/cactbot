import LineEvent from './LineEvent';
import { LogRepository } from './LogRepository';

export type LineEvent0x24Parts = [
  string, // 0: ID
  string, // 1: Timestamp
  string, // 2: Value
  string, // 3: Bars
  string, // 4: Checksum
];

// Limit gauge event
export class LineEvent0x24 extends LineEvent {
  valueDec: number;
  valueHex: string;
  bars: string;
  constructor(repo: LogRepository, line: string, parts: LineEvent0x24Parts) {
    super(repo, line, parts);
    this.valueHex = parts[2];
    this.valueDec = parseInt(this.valueHex, 16);
    this.bars = parts[3];
  }

  convert(): void {
    this.convertedLine = `${this.prefix()}Limit Break: ${this.valueHex}`;
  }
}

export class LineEvent36 extends LineEvent0x24 {}
