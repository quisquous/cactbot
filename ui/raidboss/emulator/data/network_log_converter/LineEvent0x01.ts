import logDefinitions from '../../../../../resources/netlog_defs';
import SFuncs from '../../../../../resources/stringhandlers';

import LineEvent from './LineEvent';
import LogRepository from './LogRepository';

const fields = logDefinitions.ChangeZone.fields;

// Zone change event
export class LineEvent0x01 extends LineEvent {
  public readonly zoneId: string;
  public readonly zoneName: string;
  public readonly zoneNameProperCase: string;

  constructor(repo: LogRepository, networkLine: string, parts: string[]) {
    super(repo, networkLine, parts);

    this.zoneId = parts[fields.id] ?? '';
    this.zoneName = parts[fields.name] ?? '';
    this.zoneNameProperCase = SFuncs.toProperCase(this.zoneName);
  }
}

export class LineEvent01 extends LineEvent0x01 {}
