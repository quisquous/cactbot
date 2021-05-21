import LineEvent from './LineEvent';
import LogRepository from './LogRepository';

// Tether event
export class LineEvent0x23 extends LineEvent {
  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);
  }

  public get id(): string {
    return this.parts[2]?.toUpperCase() ?? '';
  }

  public get name(): string {
    return this.parts[3] ?? '';
  }

  public get targetId(): string {
    return this.parts[4]?.toUpperCase() ?? '';
  }

  public get targetName(): string {
    return this.parts[5] ?? '';
  }

  public get tetherId(): string {
    return this.parts[8] ?? '';
  }
}

export class LineEvent35 extends LineEvent0x23 {}
