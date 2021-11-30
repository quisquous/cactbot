import logDefinitions from '../../../../../resources/netlog_defs';

import LineEvent from './LineEvent';
import LogRepository from './LogRepository';

const fields = logDefinitions.Map.fields;

// ChangeMap event
export class LineEvent0x28 extends LineEvent {
  public readonly id: string;
  public readonly regionName: string;
  public readonly placeName: string;
  public readonly placeNameSub: string;

  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);

    this.id = parts[fields.id] ?? '';
    this.regionName = parts[fields.regionName] ?? '';
    this.placeName = parts[fields.placeName] ?? '';
    this.placeNameSub = parts[fields.placeNameSub] ?? '';
  }
}

export class LineEvent40 extends LineEvent0x28 {}
