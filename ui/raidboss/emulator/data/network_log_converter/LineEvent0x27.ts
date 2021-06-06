import LineEvent, { LineEventSource } from './LineEvent';
import LogRepository from './LogRepository';

const fields = {
  id: 2,
  name: 3,
  currentHp: 4,
  maxHp: 5,
  currentMp: 6,
  maxMp: 7,
  currentTp: 8,
  maxTp: 9,
  x: 10,
  y: 11,
  z: 12,
  heading: 13,
} as const;

// Network update hp event
export class LineEvent0x27 extends LineEvent implements LineEventSource {
  public readonly id: string;
  public readonly name: string;
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

export class LineEvent39 extends LineEvent0x27 {}
