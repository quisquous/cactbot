import LineEvent from './LineEvent';
import LogRepository from './LogRepository';

const fields = {
  id: 2,
  name: 3,
  abilityId: 4,
  abilityName: 5,
  reason: 6,
} as const;

// Cancel ability event
export class LineEvent0x17 extends LineEvent {
  public readonly id: string;
  public readonly name: string;
  public readonly abilityId: string;
  public readonly abilityName: string;
  public readonly reason: string;

  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);

    this.id = parts[fields.id]?.toUpperCase() ?? '';
    this.name = parts[fields.name] ?? '';
    this.abilityId = parts[fields.abilityId]?.toUpperCase() ?? '';
    this.abilityName = parts[fields.abilityName] ?? '';
    this.reason = parts[fields.reason] ?? '';
  }
}

export class LineEvent23 extends LineEvent0x17 {}
