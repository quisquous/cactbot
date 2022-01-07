import logDefinitions from '../../../../../resources/netlog_defs';

import LineEvent, { LineEventAbility, LineEventSource } from './LineEvent';
import LogRepository from './LogRepository';

const fields = logDefinitions.NetworkCancelAbility.fields;

// Cancel ability event
export class LineEvent0x17 extends LineEvent implements LineEventSource, LineEventAbility {
  public readonly id: string;
  public readonly name: string;
  public readonly abilityId: number;
  public readonly abilityName: string;
  public readonly reason: string;
  public readonly isSource = true;
  public readonly isAbility = true;

  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);

    this.id = parts[fields.sourceId]?.toUpperCase() ?? '';
    this.name = parts[fields.name] ?? '';
    this.abilityId = parseInt(parts[fields.id]?.toUpperCase() ?? '');
    this.abilityName = parts[fields.name] ?? '';
    this.reason = parts[fields.reason] ?? '';
  }
}

export class LineEvent23 extends LineEvent0x17 {}
