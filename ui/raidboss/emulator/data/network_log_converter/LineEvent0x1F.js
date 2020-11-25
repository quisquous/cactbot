import LineEvent from './LineEvent.js';
import EmulatorCommon from '../../EmulatorCommon.js';

// Job gauge event
export class LineEvent0x1F extends LineEvent {
  constructor(repo, line, parts) {
    super(repo, line, parts);

    this.id = parts[2].toUpperCase();

    const bytes1 = EmulatorCommon.zeroPad(parts[3], 8);
    const bytes2 = EmulatorCommon.zeroPad(parts[4], 8);
    const bytes3 = EmulatorCommon.zeroPad(parts[5], 8);
    const bytes4 = EmulatorCommon.zeroPad(parts[6], 8);

    const splitFunc = (s) => [
      s.substr(6, 2),
      s.substr(4, 2),
      s.substr(2, 2),
      s.substr(0, 2),
    ];

    this.jobGaugeBytes = [
      ...splitFunc(bytes1),
      ...splitFunc(bytes2),
      ...splitFunc(bytes3),
      ...splitFunc(bytes4),
    ];

    repo.updateCombatant(this.id, {
      spawn: this.timestamp,
      despawn: this.timestamp,
      job: this.jobGaugeBytes[0].toUpperCase(),
    });
  }

  convert(repo) {
    this.name = repo.Combatants[this.id].name;
    this.convertedLine = this.prefix() +
      this.id + ':' + this.name +
      ':' + this.parts[3] +
      ':' + this.parts[4] +
      ':' + this.parts[5] +
      ':' + this.parts[6];
    this.properCaseConvertedLine = this.prefix() +
      this.id + ':' + EmulatorCommon.properCase(this.name) +
      ':' + this.parts[3] +
      ':' + this.parts[4] +
      ':' + this.parts[5] +
      ':' + this.parts[6];
  }
}

export class LineEvent31 extends LineEvent0x1F {}
