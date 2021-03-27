import LineEvent from './LineEvent';
import EmulatorCommon from '../../EmulatorCommon';

// Zone change event
export class LineEvent0x01 extends LineEvent {
  constructor(repo, line, parts) {
    super(repo, line, parts);
    this.zoneId = parts[2].toUpperCase();
    this.zoneName = parts[3];
    this.zoneNameProperCase = EmulatorCommon.properCase(this.zoneName);
  }

  convert() {
    this.convertedLine = this.prefix() +
      'Changed Zone to ' + this.zoneName + '.';
    this.properCaseConvertedLine = this.prefix() +
      'Changed Zone to ' + this.zoneNameProperCase + '.';
  }
}

export class LineEvent01 extends LineEvent0x01 {}
