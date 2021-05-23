import LineEvent from './LineEvent';
import LogRepository from './LogRepository';

// Network update hp event
export class LineEvent0x27 extends LineEvent {
  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);
  }

  public get id(): string {
    return this.parts[2]?.toUpperCase() ?? '';
  }

  public get name(): string {
    return this.parts[3] ?? '';
  }

  public get currentHp(): number {
    return parseInt(this.parts[4] ?? '');
  }

  public get maxHp(): number {
    return parseInt(this.parts[5] ?? '');
  }

  public get currentMp(): number {
    return parseInt(this.parts[6] ?? '');
  }

  public get maxMp(): number {
    return parseInt(this.parts[7] ?? '');
  }

  public get currentTp(): number {
    return parseInt(this.parts[8] ?? '');
  }

  public get maxTp(): number {
    return parseInt(this.parts[9] ?? '');
  }

  public get x(): number {
    return parseFloat(this.parts[10] ?? '');
  }

  public get y(): number {
    return parseFloat(this.parts[11] ?? '');
  }

  public get z(): number {
    return parseFloat(this.parts[12] ?? '');
  }

  public get heading(): number {
    return parseFloat(this.parts[13] ?? '');
  }
}

export class LineEvent39 extends LineEvent0x27 {}
