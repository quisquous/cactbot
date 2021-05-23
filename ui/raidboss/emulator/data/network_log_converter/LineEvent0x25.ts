import LineEvent from './LineEvent';
import LogRepository from './LogRepository';

// Action sync event
export class LineEvent0x25 extends LineEvent {
  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);
  }

  public get id(): string {
    return this.parts[2]?.toUpperCase() ?? '';
  }

  public get name(): string {
    return this.parts[3] ?? '';
  }

  public get sequenceId(): string {
    return this.parts[4] ?? '';
  }

  public get currentHp(): string {
    return this.parts[5] ?? '';
  }

  public get maxHp(): string {
    return this.parts[6] ?? '';
  }

  public get currentMp(): string {
    return this.parts[7] ?? '';
  }

  public get maxMp(): string {
    return this.parts[8] ?? '';
  }

  public get currentTp(): string {
    return this.parts[9] ?? '';
  }

  public get maxTp(): string {
    return this.parts[10] ?? '';
  }

  public get x(): string {
    return this.parts[11] ?? '';
  }

  public get y(): string {
    return this.parts[12] ?? '';
  }

  public get z(): string {
    return this.parts[13] ?? '';
  }

  public get heading(): string {
    return this.parts[14] ?? '';
  }
}

export class LineEvent37 extends LineEvent0x25 {}
