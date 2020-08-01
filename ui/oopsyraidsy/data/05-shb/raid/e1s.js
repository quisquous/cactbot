'use strict';

// TODO: failing to interrupt Mana Boost (3D8D)
// TODO: failing to pass healer debuff?
// TODO: what happens if you don't kill a meteor during four orbs?
[{
  zoneRegex: {
    en: /^Eden's Gate: Resurrection \(Savage\)$/,
    cn: /^伊甸零式希望乐园 \(觉醒之章1\)$/,
    ko: /^희망의 낙원 에덴: 각성편\(영웅\) \(1\)$/,
  },
  zoneId: ZoneId.EdensGateResurrectionSavage,
  damageWarn: {
    'E1S Eden\'s Thunder III': '44F7',
    'E1S Eden\'s Blizzard III': '44F6',
    'E1S Eden\'s Regained Blizzard III': '44FA',
    'E1S Pure Beam Trident 1': '3D83',
    'E1S Pure Beam Trident 2': '3D84',
    'E1S Paradise Lost': '3D87',
  },
  damageFail: {
    'E1S Eden\'s Flare': '3D73',
    'E1S Pure Light': '3D8A',
  },
  triggers: [
    // Things that should only hit one person.
    {
      id: 'E1S Fire/Thunder III',
      damageRegex: '44FB',
      condition: function(e, data) {
        return e.type != '15';
      },
      mistake: function(e, data) {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'E1S Pure Beam Single',
      damageRegex: '3D81',
      condition: function(e, data) {
        return e.type != '15';
      },
      mistake: function(e, data) {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'E1S Tank Lasers',
      // Vice Of Vanity
      damageRegex: '44F1',
      condition: function(e, data) {
        return e.type != '15';
      },
      mistake: function(e, data) {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'E1S DPS Puddles',
      // Vice Of Apathy
      damageRegex: '44F2',
      condition: function(e, data) {
        return e.type != '15';
      },
      mistake: function(e, data) {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
  ],
}];
