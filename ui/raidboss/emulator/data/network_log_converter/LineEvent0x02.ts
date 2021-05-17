import LineEvent from './LineEvent';
import { LogRepository } from './LogRepository';

export type LineEvent0x02Parts = [
  string, // 0: ID
  string, // 1: Timestamp
  string, // 2: ID
  string, // 3: Name
  string, // 4: Checksum
];

// Player change event
export class LineEvent0x02 extends LineEvent {
  id: string;
  name: string;
  constructor(repo: LogRepository, line: string, public parts: LineEvent0x02Parts) {
    super(repo, line, parts);

    this.id = parts[2].toUpperCase();
    this.name = parts[3];
  }

  convert(): void {
    this.convertedLine = this.prefix() + 'Changed primary player to ' + this.name + '.';
  }
}

export class LineEvent02 extends LineEvent0x02 {}
