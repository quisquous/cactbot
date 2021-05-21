import LineEvent from './LineEvent';
import LogRepository from './LogRepository';

// Head marker event
export class LineEvent0x1B extends LineEvent {
  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);
  }

  public get targetId(): string {
    return this.parts[2]?.toUpperCase() ?? '';
  }

  public get targetName(): string {
    return this.parts[3] ?? '';
  }

  public get headmarkerId(): string {
    return this.parts[6] ?? '';
  }
}

export class LineEvent27 extends LineEvent0x1B {}
