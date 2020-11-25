import LineEvent from './LineEvent.js';
import EmulatorCommon from '../../EmulatorCommon.js';

// Ability use event
export class LineEvent0x14 extends LineEvent {
  constructor(repo, line, parts) {
    super(repo, line, parts);

    this.id = parts[2].toUpperCase();
    this.name = parts[3];
    repo.updateCombatant(this.id, {
      name: this.name,
      spawn: this.timestamp,
      despawn: this.timestamp,
    });

    this.abilityId = parts[4].toUpperCase();
    this.abilityName = parts[5];

    this.targetId = parts[6].toUpperCase();
    this.targetName = parts[7];
    repo.updateCombatant(this.targetId, {
      name: this.targetName,
      spawn: this.timestamp,
      despawn: this.timestamp,
    });

    this.castTime = parts[8];
  }

  convert() {
    const target = this.targetName.length === 0 ? 'Unknown' : this.targetName;

    this.convertedLine = this.prefix() +
      this.abilityId + ':' +
      this.name + ' starts using ' + this.abilityName +
      ' on ' + target + '.';
    this.properCaseConvertedLine = this.prefix() +
      this.abilityId + ':' +
      EmulatorCommon.properCase(this.name) + ' starts using ' + this.abilityName +
      ' on ' + EmulatorCommon.properCase(target) + '.';
  }
}

export class LineEvent20 extends LineEvent0x14 {}
