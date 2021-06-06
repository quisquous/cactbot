import LineEvent, { LineEventSource } from './LineEvent';
import LogRepository from './LogRepository';

const fields = {
  targetId: 2,
  targetName: 3,
  headmarkerId: 6,
} as const;

// Head marker event
export class LineEvent0x1B extends LineEvent implements LineEventSource {
  public readonly id: string;
  public readonly name: string;
  public readonly headmarkerId: string;
  public readonly isSource = true;

  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);

    this.id = parts[fields.targetId]?.toUpperCase() ?? '';
    this.name = parts[fields.targetName] ?? '';
    this.headmarkerId = parts[fields.headmarkerId] ?? '';
  }
}

export class LineEvent27 extends LineEvent0x1B {}
