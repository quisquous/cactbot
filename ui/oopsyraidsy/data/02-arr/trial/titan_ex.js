'use strict';

// Titan Extreme
[{
  zoneRegex: {
    en: /^The Navel \(Extreme\)$/,
    ko: /^극 타이탄 토벌전$/,
  },
  damageWarn: {
    'TitanEx Landslide': '5BB',
    'TitanEx Weight Of The Land': '5BE',
    'TitanEx Burst': '5BF',
    'TitanEx Gaoler Landslide': '5C3',
  },
  triggers: [
    // Things that should only hit one person.
    {
      id: 'TitanEx Mountain Buster',
      damageRegex: '5B8',
      condition: function(e, data) {
        return e.type != '15';
      },
      mistake: function(e, data) {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'TitanEx Rock Buster',
      damageRegex: '5B7',
      condition: function(e, data) {
        return e.type != '15';
      },
      mistake: function(e, data) {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
  ],
}];
