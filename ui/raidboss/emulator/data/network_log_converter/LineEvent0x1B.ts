import LineEvent from './LineEvent';
import LogRepository from './LogRepository';

const fields = {
  targetId: 2,
  targetName: 3,
  headmarkerId: 6,
} as const;

// Head marker event
export class LineEvent0x1B extends LineEvent {
  public readonly targetId: string;
  public readonly targetName: string;
  public readonly headmarkerId: string;

  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);

    this.targetId = parts[fields.targetId]?.toUpperCase() ?? '';
    this.targetName = parts[fields.targetName] ?? '';
    this.headmarkerId = parts[fields.headmarkerId] ?? '';
  }
}

export class LineEvent27 extends LineEvent0x1B {}
