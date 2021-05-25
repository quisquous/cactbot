import LineEvent from './LineEvent';
import LogRepository from './LogRepository';

const fields = {
  operation: 2,
  waymark: 3,
  id: 4,
  name: 5,
  targetId: 6,
  targetName: 7,
} as const;

// Waymarker
export class LineEvent0x1D extends LineEvent {
  public readonly operation: string;
  public readonly waymark: string;
  public readonly id: string;
  public readonly name: string;
  public readonly targetId: string;
  public readonly targetName: string;

  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);

    this.operation = parts[fields.operation] ?? '';
    this.waymark = parts[fields.waymark] ?? '';
    this.id = parts[fields.id]?.toUpperCase() ?? '';
    this.name = parts[fields.name] ?? '';
    this.targetId = parts[fields.targetId]?.toUpperCase() ?? '';
    this.targetName = parts[fields.targetName] ?? '';
  }
}

export class LineEvent29 extends LineEvent0x1D {}
