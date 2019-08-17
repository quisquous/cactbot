'use strict';

// The Twinning

[{
  zoneRegex: /^The Twinning$/,
  timelineFile: 'twinning.txt',
  triggers: [
    {
      id: 'Twinning Main Head',
      regex: / 14:3DBC:Surplus Kaliya starts using Main Head/,
      condition: function(data) {
        return data.CanStun() || data.CanSilence();
      },
      alertText: {
        en: 'Interrupt Kaliya',
      },
    },
    {
      id: 'Twinning Berserk',
      regex: / 14:3DC0:Vitalized Reptoid starts using Berserk/,
      condition: function(data) {
        return data.CanStun() || data.CanSilence();
      },
      alertText: {
        en: 'Interrupt Reptoid',
      },
    },
    {
      id: 'Twinning 128 Tonze Swing',
      regex: / 14:3DBA:Servomechanical Minotaur starts using 128-Tonze Swing/,
      condition: function(data) {
        return data.CanSilence();
      },
      alertText: {
        en: 'Silence Minotaur',
      },
    },
    {
      // The handling for these mechanics is similar enough it makes sense to combine the trigger
      id: 'Twinning Impact + Pounce',
      regex: / 1B:........:\y{Name}:....:....:(003[2-5]|005A)/,
      suppressSeconds: 10,
      infoText: {
        en: 'Spread (avoid cages)',
      },
    },
    {
      id: 'Twinning Beastly Roar',
      regex: / 14:3D64:Alpha Zaghnal starts using Beastly Roar/,
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank' || data.CanAddle();
      },
      infoText: {
        en: 'aoe',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'Twinning Augurium',
      regex: / 14:3D65:Alpha Zaghnal starts using Augurium on (\y{Name})/,
      alertText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Tank cleave on YOU',
          };
        }
        return {
          en: 'Avoid tank cleave',
        };
      },
    },
    {
      id: 'Twinning Charge Eradicated',
      regex: / 1B:........:(\y{Name}):....:....:005D/,
      alertText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Stack on YOU',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'Twinning Thunder Beam',
      regex: / 14:3DED:Mithridates starts using Thunder Beam on (\y{Name})/,
      alertText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Buster on YOU',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      // Alternatively, we could use 1B:........:(\y{Name}):....:....:00A0
      id: 'Twinning Allagan Thunder',
      regex: / 14:3DEF:Mithridates starts using Allagan Thunder on (\y{Name})/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Spread',
      },
    },
    {
      id: 'Twinning Magitek Crossray',
      regex: / 14:3DF8:The Tycoon starts using Magitek Crossray/,
      suppressSeconds: 15,
      infoText: {
        en: 'cardinal lasers',
      },
    },
    {
      id: 'Twinning Defensive Array',
      regex: / 14:3DF2:The Tycoon starts using Defensive Array/,
      suppressSeconds: 15,
      infoText: {
        en: 'outer lasers',
      },
    },
    {
      id: 'Twinning Rail Cannon',
      regex: / 14:3DFB:The Tycoon starts using Rail Cannon on (\y{Name})/,
      alertText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Buster on YOU',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      // An alternative is 1B:........:\y{Name}:....:....:00A9
      id: 'Twinning Magicrystal',
      regex: / 14:3E0C:The Tycoon starts using Magicrystal/,
      alertText: {
        en: 'spread',
      },
    },
    {
      id: 'Twinning Discharger',
      regex: / 14:3DFC:The Tycoon starts using High-Tension Discharger/,
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank' || data.CanAddle();
      },
      infoText: {
        en: 'aoe',
        fr: 'Dégâts de zone',
      },
    },
  ],
},
];
