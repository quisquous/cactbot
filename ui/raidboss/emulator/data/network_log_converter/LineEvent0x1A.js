'use strict';

// Gain status effect event
class LineEvent0x1A extends LineEvent {
  constructor(repo, line, parts) {
    super(repo, line, parts);

    this.abilityId = parts[2].toUpperCase();
    this.abilityName = parts[3];

    this.duration = parseFloat(parts[4]);
    this.stacks = parseInt(parts[9], 16);

    this.id = parts[5].toUpperCase();
    this.name = parts[6];
    repo.updateCombatant(this.id, {
      name: this.name,
      spawn: this.timestamp,
      despawn: this.timestamp,
    });

    this.targetId = parts[7].toUpperCase();
    this.targetName = parts[8];
    repo.updateCombatant(this.targetId, {
      name: this.targetName,
      spawn: this.timestamp,
      despawn: this.timestamp,
    });

    this.resolvedName = repo.resolveName(this.id, this.name);
    this.resolvedTargetName = repo.resolveName(this.targetId, this.targetName);

    this.fallbackResolvedTargetName =
      repo.resolveName(this.id, this.name, this.targetId, this.targetName);
  }

  convert() {
    let stackCountText = '';
    if (this.stacks > 0 && this.stacks < 20 &&
      LineEvent0x1A.showStackCountFor.includes(this.abilityId))
      stackCountText = ' (' + this.stacks + ')';

    this.convertedLine = this.prefix() +
      this.targetId + ':' + this.targetName +
      ' gains the effect of ' + this.abilityName +
      ' from ' + this.fallbackResolvedTargetName +
      ' for ' + this.parts[4] + ' Seconds.' + stackCountText;

    this.properCaseConvertedLine = this.prefix() +
      this.targetId + ':' + EmulatorCommon.properCase(this.targetName) +
      ' gains the effect of ' + this.abilityName +
      ' from ' + EmulatorCommon.properCase(this.fallbackResolvedTargetName) +
      ' for ' + this.parts[4] + ' Seconds.' + stackCountText;
  }
}

class LineEvent26 extends LineEvent0x1A {}

LineEvent0x1A.showStackCountFor = [
  '130', // Aetherflow
  '196', // Vulnerability Down
  '15e', // Vulnerability Down
  '2ca', // Vulnerability Up
  '1f9', // Damage Up
  '4d7', // Embolden
  '511', // Embolden
];
