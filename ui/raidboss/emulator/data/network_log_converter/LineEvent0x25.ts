import LineEvent, { LineEventSource } from './LineEvent';
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
export class LineEvent0x25 extends LineEvent implements LineEventSource {
  public readonly id: string;
  public readonly name: string;
  public readonly sequenceId: string;
  public readonly hp: number;
  public readonly maxHp: number;
  public readonly mp: number;
  public readonly maxMp: number;
  public readonly tp: number;
  public readonly maxTp: number;
  public readonly x: number;
  public readonly y: number;
  public readonly z: number;
  public readonly heading: number;
  public readonly isSource = true;

  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);

    this.id = parts[fields.id]?.toUpperCase() ?? '';
    this.name = parts[fields.name] ?? '';
    this.sequenceId = parts[fields.sequenceId] ?? '';
    this.hp = parseInt(parts[fields.currentHp] ?? '');
    this.maxHp = parseInt(parts[fields.maxHp] ?? '');
    this.mp = parseInt(parts[fields.currentMp] ?? '');
    this.maxMp = parseInt(parts[fields.maxMp] ?? '');
    this.tp = parseInt(parts[fields.currentTp] ?? '');
    this.maxTp = parseInt(parts[fields.maxTp] ?? '');
    this.x = parseFloat(parts[fields.x] ?? '');
    this.y = parseFloat(parts[fields.y] ?? '');
    this.z = parseFloat(parts[fields.z] ?? '');
    this.heading = parseFloat(parts[fields.heading] ?? '');
  }
}

export class LineEvent37 extends LineEvent0x25 {}
