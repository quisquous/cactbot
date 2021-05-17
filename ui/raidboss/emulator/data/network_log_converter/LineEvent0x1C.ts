import LineEvent from './LineEvent';
import { LogRepository } from './LogRepository';

export type LineEvent0x1CParts = [
  string, // 0: ID
  string, // 1: Timestamp
  string, // 2: Operation
  string, // 3: Waymark
  string, // 4: Source ID
  string, // 5: Source Name
  string, // 6: X
  string, // 7: Y
  string, // 8: Z?
  string, // 9: Checksum
];

// Floor waymarker event
export class LineEvent0x1C extends LineEvent {
  id: string;
  name: string;
  constructor(repo: LogRepository, line: string, public parts: LineEvent0x1CParts) {
    super(repo, line, parts);

    this.id = parts[4].toUpperCase();
    this.name = parts[5];
  }
}

export class LineEvent28 extends LineEvent0x1C {}
