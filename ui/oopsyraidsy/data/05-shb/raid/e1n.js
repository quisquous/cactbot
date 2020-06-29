'use strict';

[{
  zoneRegex: {
    en: /^Eden's Gate: Resurrection$/,
    cn: /^伊甸希望乐园 \(觉醒之章1\)$/,
    ko: /^희망의 낙원 에덴: 각성편 \(1\)$/,
  },
  zoneId: ZoneId.EdensGateResurrection,
  damageWarn: {
    'E1N Eden\'s Thunder III': '44ED',
    'E1N Eden\'s Blizzard III': '44EC',
    'E1N Pure Beam': '3D9E',
    'E1N Paradise Lost': '3DA0',
  },
  damageFail: {
    'E1N Eden\'s Flare': '3D97',
    'E1N Pure Light': '3DA3',
  },
  triggers: [
    // Things that should only hit one person.
    {
      id: 'E1S Fire III',
      damageRegex: '44EB',
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
      damageRegex: '44E7',
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
      damageRegex: '44E8',
      condition: function(e, data) {
        return e.type != '15';
      },
      mistake: function(e, data) {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
  ],
}];
