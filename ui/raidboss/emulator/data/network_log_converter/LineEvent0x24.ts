import logDefinitions from '../../../../../resources/netlog_defs';

import LineEvent from './LineEvent';
import LogRepository from './LogRepository';

const fields = logDefinitions.LimitBreak.fields;

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
  }
}

export class LineEvent36 extends LineEvent0x24 {}
