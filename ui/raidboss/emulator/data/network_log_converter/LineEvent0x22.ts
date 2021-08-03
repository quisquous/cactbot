import logDefinitions from '../../../../../resources/netlog_defs';

import LineEvent, { LineEventSource } from './LineEvent';
import LogRepository from './LogRepository';

const fields = logDefinitions.networkNameToggle.fields;

// Nameplate toggle
export class LineEvent0x22 extends LineEvent implements LineEventSource {
  public readonly id: string;
  public readonly name: string;
  public readonly targetId: string;
  public readonly targetName: string;
  public readonly targetable: boolean;
  public readonly isSource = true;

  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);

    this.id = parts[fields.id]?.toUpperCase() ?? '';
    this.name = parts[fields.name] ?? '';
    this.targetId = parts[fields.targetId]?.toUpperCase() ?? '';
    this.targetName = parts[fields.targetName] ?? '';
    this.targetable = !!parseInt(parts[fields.toggle] ?? '', 16);
  }
}

export class LineEvent34 extends LineEvent0x22 {}
