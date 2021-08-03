import logDefinitions from '../../../../../resources/netlog_defs';
import EmulatorCommon from '../../EmulatorCommon';

import LineEvent from './LineEvent';
import LogRepository from './LogRepository';

const fields = logDefinitions.ChangeZone.fields;

// Zone change event
export class LineEvent0x01 extends LineEvent {
  public override readonly properCaseConvertedLine: string;

  public readonly zoneId: string;
  public readonly zoneName: string;
  public readonly zoneNameProperCase: string;

  constructor(repo: LogRepository, networkLine: string, parts: string[]) {
    super(repo, networkLine, parts);

    this.zoneId = parts[fields.id] ?? '';
    this.zoneName = parts[fields.name] ?? '';
    this.zoneNameProperCase = EmulatorCommon.properCase(this.zoneName);

    this.convertedLine = this.prefix() +
      'Changed Zone to ' + this.zoneName + '.';
    this.properCaseConvertedLine = this.prefix() +
      'Changed Zone to ' + this.zoneNameProperCase + '.';
  }
}

export class LineEvent01 extends LineEvent0x01 {}
