'use strict';

// The Grand Cosmos
[{
  zoneRegex: {
    en: /^The Grand Cosmos$/,
    ko: /^그랑 코스모스$/,
  },
  damageWarn: {
    'Cosmos Iron Justice': '491F',
    'Cosmos Smite Of Rage': '4921',

    'Cosmos Tribulation': '49A4',
    'Cosmos Dark Shock': '476F',
    'Cosmos Sweep': '4770',
    'Cosmos Deep Clean': '4771',

    'Cosmos Shadow Burst': '4924',
    'Cosmos Bloody Caress': '4927',
    'Cosmos Nepenthic Plunge': '4928',
    'Cosmos Brewing Storm': '4929',

    'Cosmos Ode To Fallen Petals': '4950',
    'Cosmos Far Wind Ground': '4273',

    'Cosmos Fire Breath': '492B',
    'Cosmos Ronkan Freeze': '492E',
    'Cosmos Overpower': '492D',

    'Cosmos Scorching Left': '4763',
    'Cosmos Scorching Right': '4762',
    'Cosmos Otherwordly Heat': '475C',
    'Cosmos Fire\'s Ire': '4761',
    'Cosmos Plummet': '4767',
  },
  triggers: [
    {
      id: 'Cosmos Dark Well',
      damageRegex: '476D',
      condition: function(e) {
        // Double taps only.
        return e.type != '15';
      },
      mistake: function(e) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'Cosmos Far Wind Spread',
      damageRegex: '4724',
      condition: function(e) {
        // Double taps only.
        return e.type != '15';
      },
      mistake: function(e) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'Cosmos Black Flame',
      damageRegex: '475D',
      condition: function(e) {
        // Double taps only.
        return e.type != '15';
      },
      mistake: function(e) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'Cosmos Fire\'s Domain Tether',
      damageRegex: '475F',
      mistake: function(e) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'Cosmos Fire\'s Domain',
      damageRegex: '4760',
      condition: function(e) {
        // Double taps only.
        return e.type != '15';
      },
      mistake: function(e) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
  ],
}];
