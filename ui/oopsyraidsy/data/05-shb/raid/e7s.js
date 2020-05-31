'use strict';

// TODO: when it's ok to take a light's course or dark's course
// TODO: figuring out when courses are colored or not
// TODO: missing an orb during tornado phase
// TODO: jumping in the tornado damage??
// TODO: taking sungrace(4C80) or moongrace(4C82) with wrong debuff
// TODO: stygian spear/silver spear with the wrong debuff
// TODO: taking explosion from the wrong Chiaro/Scuro orb
// TODO: missing the interrupt

[{
  zoneRegex: {
    en: /^Eden's Verse: Iconoclasm \(Savage\)$/,
    ko: /^희망의 낙원 에덴: 공명편\(영웅\) \(3\)$/,
  },
  damageWarn: {
    'Silver Sword': '4C8E', // ground aoe
    'Overwhelming Force': '4C73', // add phase ground aoe
    'Strength in Numbers 1': '4C70', // add get under
    'Strength in Numbers 2': '4C71', // add get out
    'Paper Cut': '4C7D', // tornado ground aoes
    'Buffet': '4C77', // tornado ground aoes also??
  },
  damageFail: {
    'Betwixt Worlds': '4C6B', // purple ground line aoes
    'Crusade': '4C58', // knockback
  },
  triggers: [
    {
      // Laser tank buster 1
      id: 'E7S Stygian Stake',
      damageRegex: '4C34',
      condition: function(e) {
        return e.type != '15';
      },
      mistake: function(e) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      // Laser tank buster 2
      id: 'E7S Silver Stake',
      damageRegex: '4C89',
      condition: function(e) {
        return e.type != '15';
      },
      mistake: function(e) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      // Spread markers
      id: 'E7S Silver Shot',
      damageRegex: '4C92',
      condition: function(e) {
        return e.type != '15';
      },
      mistake: function(e) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      // Ice markers
      id: 'E7S Silver Scourge',
      damageRegex: '4C93',
      condition: function(e) {
        return e.type != '15';
      },
      mistake: function(e) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      // Orb Explosion
      id: 'E7S Chiaro Scuro Explosion',
      damageRegex: '4D1[45]',
      condition: function(e) {
        return e.type != '15';
      },
      mistake: function(e) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      // Interrupt
      id: 'E7S Advent Of Light',
      abilityRegex: '4C6E',
      mistake: function(e, data) {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
  ],
}];
