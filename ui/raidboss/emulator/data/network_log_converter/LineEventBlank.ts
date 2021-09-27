import LineEvent from './LineEvent';
import LogRepository from './LogRepository';

// Any line where the ACT log line is blank, e.g. Map. or PacketDump.
export class LineEventBlank extends LineEvent {
  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);

    this.convertedLine = this.prefix();
  }
}
