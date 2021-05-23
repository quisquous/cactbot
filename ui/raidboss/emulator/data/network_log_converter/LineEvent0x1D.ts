import LineEvent from './LineEvent';
import LogRepository from './LogRepository';

// Waymarker
export class LineEvent0x1D extends LineEvent {
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

  public get targetId(): string {
    return this.parts[6]?.toUpperCase() ?? '';
  }

  public get targetName(): string {
    return this.parts[7] ?? '';
  }
}

export class LineEvent29 extends LineEvent0x1D {}
