import LineEvent from './LineEvent';
import LogRepository from './LogRepository';

const fields = {
  operation: 2,
  waymark: 3,
  id: 4,
  name: 5,
  x: 6,
  y: 7,
  z: 8,
} as const;

// Floor waymarker event
export class LineEvent0x1C extends LineEvent {
  public readonly operation: string;
  public readonly waymark: string;
  public readonly id: string;
  public readonly name: string;
  public readonly x: string;
  public readonly y: string;
  public readonly z: string;

  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);

    this.operation = parts[fields.operation] ?? '';
    this.waymark = parts[fields.waymark] ?? '';
    this.id = parts[fields.id]?.toUpperCase() ?? '';
    this.name = parts[fields.name] ?? '';
    this.x = parts[fields.x] ?? '';
    this.y = parts[fields.y] ?? '';
    this.z = parts[fields.z] ?? '';
  }
}

export class LineEvent28 extends LineEvent0x1C {}
