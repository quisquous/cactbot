import logDefinitions from '../../../../../resources/netlog_defs';

import LineEvent from './LineEvent';
import LogRepository from './LogRepository';

const fields = logDefinitions.Tether.fields;

// Tether event
export class LineEvent0x23 extends LineEvent {
  public readonly id: string;
  public readonly name: string;
  public readonly targetId: string;
  public readonly targetName: string;
  public readonly tetherId: string;

  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);

    this.id = parts[fields.sourceId]?.toUpperCase() ?? '';
    this.name = parts[fields.source] ?? '';
    this.targetId = parts[fields.targetId]?.toUpperCase() ?? '';
    this.targetName = parts[fields.target] ?? '';
    this.tetherId = parts[fields.id] ?? '';
  }
}

export class LineEvent35 extends LineEvent0x23 {}
