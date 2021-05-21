import LineEvent from './LineEvent';
import EmulatorCommon from '../../EmulatorCommon';
import LogRepository from './LogRepository';

// Zone change event
export class LineEvent0x01 extends LineEvent {
  public properCaseConvertedLine = '';

  public get zoneID(): string {
    return this.parts[2] ?? '';
  }

  public get zoneName(): string {
    return this.parts[3] ?? '';
  }

  public get zoneNameProperCase(): string {
    return EmulatorCommon.properCase(this.zoneName);
  }

  convert(_: LogRepository): void {
    this.convertedLine = this.prefix() +
      'Changed Zone to ' + this.zoneName + '.';
    this.properCaseConvertedLine = this.prefix() +
      'Changed Zone to ' + this.zoneNameProperCase + '.';
  }
}

export class LineEvent01 extends LineEvent0x01 {}
