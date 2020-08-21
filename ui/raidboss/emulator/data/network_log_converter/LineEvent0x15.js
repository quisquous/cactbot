'use strict';

// Ability hit single target event
class LineEvent0x15 extends LineEvent {
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
    repo.updateAbility(this.abilityId, this.abilityName);

    this.targetId = parts[6].toUpperCase();
    this.targetName = parts[7];
    repo.updateCombatant(this.targetId, {
      name: this.targetName,
      spawn: this.timestamp,
      despawn: this.timestamp,
    });

    this.flags = parts[8];

    let offset = 0;

    if (this.flags === '3F')
      offset = 2;

    this.damage = LineEvent.calculateDamage(parts[9 + offset]);

    this.targetHp = parts[24 + offset];
    this.targetMaxHp = parts[25 + offset];

    this.targetMp = parts[26 + offset];
    this.targetMaxMp = parts[27 + offset];

    this.targetX = parts[30 + offset];
    this.targetY = parts[31 + offset];
    this.targetZ = parts[32 + offset];
    this.targetHeading = parts[33 + offset];

    this.targetHp = parts[34 + offset];
    this.targetMaxHp = parts[35 + offset];

    this.targetMp = parts[36 + offset];
    this.targetMaxMp = parts[37 + offset];

    this.targetX = parts[40 + offset];
    this.targetY = parts[41 + offset];
    this.targetZ = parts[42 + offset];
    this.targetHeading = parts[43 + offset];
  }
}

class LineEvent21 extends LineEvent0x15 {}
