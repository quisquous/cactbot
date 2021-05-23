import LineEvent from './LineEvent';
import LogRepository from './LogRepository';

// Player change event
export class LineEvent0x02 extends LineEvent {
  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);
  }

  public get id(): string {
    return this.parts[2]?.toUpperCase() ?? '';
  }

  public get name(): string {
    return this.parts[3] ?? '';
  }

  convert(_: LogRepository): void {
    this.convertedLine = this.prefix() + 'Changed primary player to ' + this.name + '.';
  }
}

export class LineEvent02 extends LineEvent0x02 {}
