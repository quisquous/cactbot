'use strict';

// Combatant defeated event
class LineEvent0x19 extends LineEvent {
  constructor(repo, line, parts) {
    super(repo, line, parts);

    this.id = parts[2].toUpperCase();
    this.name = parts[3];
    repo.updateCombatant(this.id, {
      name: this.name,
      spawn: this.timestamp,
      despawn: this.timestamp,
    });

    this.targetId = parts[4].toUpperCase();
    this.targetName = parts[5];
    repo.updateCombatant(this.targetId, {
      name: this.targetName,
      spawn: this.timestamp,
      despawn: this.timestamp,
    });

    this.resolvedName = false;
    if (this.id !== '00')
      this.resolvedName = repo.resolveName(this.id, this.name);

    this.resolvedTargetName = false;
    if (this.targetId !== '00')
      this.resolvedTargetName = repo.resolveName(this.targetId, this.targetName);
  }

  convert() {
    this.convertedLine = this.prefix() +
      this.resolvedName || this.name +
      ' was defeated by ' + this.resolvedTargetName || this.targetName + '.';

    this.properCaseConvertedLine = this.prefix() +
      EmulatorCommon.properCase(this.resolvedName || this.name) +
      ' was defeated by ' + EmulatorCommon.properCase(this.resolvedTargetName || this.targetName) + '.';
  }
}

class LineEvent25 extends LineEvent0x19 {}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    LineEvent0x19: LineEvent0x19,
    LineEvent25: LineEvent25,
  };
}
