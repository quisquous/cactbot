import LineEvent from './LineEvent';
import LogRepository from './LogRepository';

// Floor waymarker event
export class LineEvent0x1C extends LineEvent {
  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);
  }

  public get operation(): string {
    return this.parts[2] ?? '';
  }

  public get waymark(): string {
    return this.parts[3] ?? '';
  }

  public get id(): string {
    return this.parts[4]?.toUpperCase() ?? '';
  }

  public get name(): string {
    return this.parts[5] ?? '';
  }

  public get x(): string {
    return this.parts[6] ?? '';
  }

  public get y(): string {
    return this.parts[7] ?? '';
  }

  public get z(): string {
    return this.parts[8] ?? '';
  }
}

export class LineEvent28 extends LineEvent0x1C {}
