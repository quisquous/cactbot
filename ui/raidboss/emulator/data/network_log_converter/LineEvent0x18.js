'use strict';

// DoT/HoT event
class LineEvent0x18 extends LineEvent {
  constructor(repo, line, parts) {
    super(repo, line, parts);

    this.id = parts[2].toUpperCase();
    this.name = parts[3];
    repo.updateCombatant(this.id, {
      name: this.name,
      spawn: this.timestamp,
      despawn: this.timestamp,
    });

    this.type = parts[4];
    this.abilityId = parts[5].toUpperCase();
    this.damage = parseInt(parts[6], 16);

    this.hp = parseInt(parts[7]);
    this.maxHp = parseInt(parts[8]);

    this.mp = parseInt(parts[9]);
    this.maxMp = parseInt(parts[10]);

    this.x = parseFloat(parts[13]);
    this.y = parseFloat(parts[14]);
    this.z = parseFloat(parts[15]);
    this.heading = parseFloat(parts[16]);

    this.resolvedName = repo.resolveName(this.id, this.name);
  }

  convert(repo) {
    this.abilityName = repo.Abilities[this.abilityId.toUpperCase()];
    let abilityPart = '';
    if (LineEvent0x18.showAbilityNamesFor.includes(this.abilityId))
      abilityPart = this.abilityName + ' ';

    this.convertedLine = this.prefix() +
      abilityPart +
      this.type + ' Tick on ' + this.resolvedName +
      ' for ' + this.damage + ' damage.';

    this.properCaseConvertedLine = this.prefix() +
      abilityPart +
      this.type + ' Tick on ' + EmulatorCommon.properCase(this.resolvedName) +
      ' for ' + this.damage + ' damage.';
  }
}

class LineEvent24 extends LineEvent0x18 {}

LineEvent0x18.showAbilityNamesFor = [
  '4C4', // Excognition
  '35D', // Wildfire
  '1F5', // Doton
  '2ED', // Salted Earth
  '4B5', // Flamethrower
  '2E3', // Asylum
  '777', // Asylum
  '798', // Sacred Soil
  '4C7', // Fey Union
  '742', // Nascent Glint
];
