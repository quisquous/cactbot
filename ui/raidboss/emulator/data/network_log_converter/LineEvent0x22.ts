import LineEvent from './LineEvent';
import LogRepository from './LogRepository';

// Nameplate toggle
export class LineEvent0x22 extends LineEvent {
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

  public get targetable(): boolean {
    return !!parseInt(this.parts[6] ?? '', 16);
  }
}

export class LineEvent34 extends LineEvent0x22 {}
