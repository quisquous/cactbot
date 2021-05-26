import LineEvent from './LineEvent';
import LogRepository from './LogRepository';

const fields = {
  id: 2,
  name: 3,
  targetId: 4,
  targetName: 5,
  tetherId: 8,
} as const;

// Tether event
export class LineEvent0x23 extends LineEvent {
  public readonly id: string;
  public readonly name: string;
  public readonly targetId: string;
  public readonly targetName: string;
  public readonly tetherId: string;

  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);

    this.id = parts[fields.id]?.toUpperCase() ?? '';
    this.name = parts[fields.name] ?? '';
    this.targetId = parts[fields.targetId]?.toUpperCase() ?? '';
    this.targetName = parts[fields.targetName] ?? '';
    this.tetherId = parts[fields.tetherId] ?? '';
  }
}

export class LineEvent35 extends LineEvent0x23 {}
