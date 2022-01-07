import logDefinitions from '../../../../../resources/netlog_defs';

import LineEvent from './LineEvent';
import LogRepository from './LogRepository';

const fields = logDefinitions.SystemLogMessage.fields;

// SystemLogMessage event
export class LineEvent0x29 extends LineEvent {
  public readonly id: string;
  public readonly param0: string;
  public readonly param1: string;
  public readonly param2: string;

  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);

    this.id = parts[fields.id] ?? '';
    this.param0 = parts[fields.param0] ?? '';
    this.param1 = parts[fields.param1] ?? '';
    this.param2 = parts[fields.param2] ?? '';
  }
}

export class LineEvent41 extends LineEvent0x29 {}
