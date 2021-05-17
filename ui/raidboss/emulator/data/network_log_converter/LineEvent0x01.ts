import LineEvent from './LineEvent';
import EmulatorCommon from '../../EmulatorCommon';
import { LogRepository } from './LogRepository';

export type LineEvent0x01Parts = [
  string, // 0: ID
  string, // 1: Timestamp
  string, // 2: Zone ID
  string, // 3: Zone Name
  string, // 4: Checksum
];

// Zone change event
export class LineEvent0x01 extends LineEvent {
  zoneId: string;
  zoneName: string;
  zoneNameProperCase: string;
  properCaseConvertedLine = '';
  constructor(repo: LogRepository, line: string, public parts: LineEvent0x01Parts) {
    super(repo, line, parts);
    this.zoneId = parts[2].toUpperCase();
    this.zoneName = parts[3];
    // @TODO: Remove `as string` after converting EmulatorCommon
    this.zoneNameProperCase = EmulatorCommon.properCase(this.zoneName) as string;
  }

  convert(): void {
    this.convertedLine = this.prefix() +
      'Changed Zone to ' + this.zoneName + '.';
    this.properCaseConvertedLine = this.prefix() +
      'Changed Zone to ' + this.zoneNameProperCase + '.';
  }
}

export class LineEvent01 extends LineEvent0x01 {}
