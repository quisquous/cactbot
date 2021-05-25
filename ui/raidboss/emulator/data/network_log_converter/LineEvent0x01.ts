import LineEvent from './LineEvent';
import EmulatorCommon from '../../EmulatorCommon';
import LogRepository from './LogRepository';

const fields = {
  zoneId: 2,
  zoneName: 3,
} as const;

// Zone change event
export class LineEvent0x01 extends LineEvent {
  public readonly properCaseConvertedLine: string;

  public readonly zoneId: string;
  public readonly zoneName: string;
  public readonly zoneNameProperCase: string;

  constructor(repo: LogRepository, networkLine: string, parts: string[]) {
    super(repo, networkLine, parts);

    this.zoneId = parts[fields.zoneId] ?? '';
    this.zoneName = parts[fields.zoneName] ?? '';
    this.zoneNameProperCase = EmulatorCommon.properCase(this.zoneName);

    this.convertedLine = this.prefix() +
      'Changed Zone to ' + this.zoneName + '.';
    this.properCaseConvertedLine = this.prefix() +
      'Changed Zone to ' + this.zoneNameProperCase + '.';
  }
}

export class LineEvent01 extends LineEvent0x01 {}
