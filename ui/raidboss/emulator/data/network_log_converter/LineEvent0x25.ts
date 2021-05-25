import LineEvent from './LineEvent';
import LogRepository from './LogRepository';

const fields = {
  id: 2,
  name: 3,
  sequenceId: 4,
  currentHp: 5,
  maxHp: 6,
  currentMp: 7,
  maxMp: 8,
  currentTp: 9,
  maxTp: 10,
  x: 11,
  y: 12,
  z: 13,
  heading: 14,
} as const;

// Action sync event
export class LineEvent0x25 extends LineEvent {
  public readonly id: string;
  public readonly name: string;
  public readonly sequenceId: string;
  public readonly currentHp: string;
  public readonly maxHp: string;
  public readonly currentMp: string;
  public readonly maxMp: string;
  public readonly currentTp: string;
  public readonly maxTp: string;
  public readonly x: string;
  public readonly y: string;
  public readonly z: string;
  public readonly heading: string;

  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);

    this.id = parts[fields.id]?.toUpperCase() ?? '';
    this.name = parts[fields.name] ?? '';
    this.sequenceId = parts[fields.sequenceId] ?? '';
    this.currentHp = parts[fields.currentHp] ?? '';
    this.maxHp = parts[fields.maxHp] ?? '';
    this.currentMp = parts[fields.currentMp] ?? '';
    this.maxMp = parts[fields.maxMp] ?? '';
    this.currentTp = parts[fields.currentTp] ?? '';
    this.maxTp = parts[fields.maxTp] ?? '';
    this.x = parts[fields.x] ?? '';
    this.y = parts[fields.y] ?? '';
    this.z = parts[fields.z] ?? '';
    this.heading = parts[fields.heading] ?? '';
  }
}

export class LineEvent37 extends LineEvent0x25 {}
