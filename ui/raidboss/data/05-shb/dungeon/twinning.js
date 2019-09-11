'use strict';

// The Twinning

[{
  zoneRegex: /^The Twinning$/,
  timelineFile: 'twinning.txt',
  triggers: [
    {
      id: 'Twinning Main Head',
      regex: / 14:3DBC:Surplus Kaliya starts using Main Head/,
      regexDe: / 14:3DBC:Massengefertigter Kaliya starts using Hauptkopf/,
      condition: function(data) {
        return data.CanStun() || data.CanSilence();
      },
      alertText: {
        en: 'Interrupt Kaliya',
        de: 'Unterbreche Kaliya',
      },
    },
    {
      id: 'Twinning Berserk',
      regex: / 14:3DC0:Vitalized Reptoid starts using Berserk/,
      regexDe: / 14:3DC0:Gestärkter Reptoid starts using Berserker/,
      condition: function(data) {
        return data.CanStun() || data.CanSilence();
      },
      alertText: {
        en: 'Interrupt Reptoid',
        de: 'Unterbreche Reptoid',
      },
    },
    {
      id: 'Twinning 128 Tonze Swing',
      regex: / 14:3DBA:Servomechanical Minotaur starts using 128-Tonze Swing/,
      regexDe: / 14:3DBA:Servomechanischer Minotaurus starts using 128-Tonzen-Schwung/,
      condition: function(data) {
        return data.CanSilence();
      },
      alertText: {
        en: 'Silence Minotaur',
        de: 'Stumme Minotaur',
      },
    },
    {
      // The handling for these mechanics is similar enough it makes sense to combine the trigger
      id: 'Twinning Impact + Pounce',
      regex: / 1B:........:\y{Name}:....:....:(003[2-5]|005A)/,
      suppressSeconds: 10,
      infoText: {
        en: 'Spread (avoid cages)',
        de: 'Verteilen (Vermeide "Käfige")',
      },
    },
    {
      id: 'Twinning Beastly Roar',
      regex: / 14:3D64:Alpha Zaghnal starts using Beastly Roar/,
      regexDe: / 14:3D64:Alpha-Zaghnal starts using Bestialisches Brüllen/,
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank' || data.CanAddle();
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'Twinning Augurium',
      regex: / 14:3D65:Alpha Zaghnal starts using Augurium on (\y{Name})/,
      regexDe: / 14:3D65:Alpha-Zaghnal starts using Schmetterbohrer on (\y{Name})/,
      alertText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Tank cleave on YOU',
            de: 'Tank cleave auf YOU',
          };
        }
        return {
          en: 'Avoid tank cleave',
          de: 'Tank cleave ausweichen',
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
            de: 'Auf DIR stacken',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches[1]),
          de: 'Auf ' + data.ShortName(matches[1]) + ' sammeln',
        };
      },
    },
    {
      id: 'Twinning Thunder Beam',
      regex: / 14:3DED:Mithridates starts using Thunder Beam on (\y{Name})/,
      regexDe: / 14:3DED:Mithridates starts using Gewitterstrahl on (\y{Name})/,
      alertText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Buster on YOU',
            de: 'Buster auf DIR',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Buster auf ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      // Alternatively, we could use 1B:........:(\y{Name}):....:....:00A0
      id: 'Twinning Allagan Thunder',
      regex: / 14:3DEF:Mithridates starts using Allagan Thunder on (\y{Name})/,
      regexDe: / 14:3DEF:Mithridates starts using Allagischer Blitzschlag on (\y{Name})/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Spread',
        de: 'Verteilen',
      },
    },
    {
      id: 'Twinning Magitek Crossray',
      regex: / 14:3DF8:The Tycoon starts using Magitek Crossray/,
      regexDe: / 14:3DF8:Tycoon starts using Magitek-Kreuzlaser/,
      suppressSeconds: 15,
      infoText: {
        en: 'cardinal lasers',
        de: 'Himmelrichtungs-Lasers',
      },
    },
    {
      id: 'Twinning Defensive Array',
      regex: / 14:3DF2:The Tycoon starts using Defensive Array/,
      regexDe: / 14:3DF2:Tycoon starts using Magitek-Schutzlaser/,
      suppressSeconds: 15,
      infoText: {
        en: 'outer lasers',
        de: 'Lasers am Rand',
      },
    },
    {
      id: 'Twinning Rail Cannon',
      regex: / 14:3DFB:The Tycoon starts using Rail Cannon on (\y{Name})/,
      regexDe: / 14:3DFB:Tycoon starts using Magnetschienenkanone on (\y{Name})/,
      alertText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Buster on YOU',
            de: 'Buster auf DIR',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Buster auf ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      // An alternative is 1B:........:\y{Name}:....:....:00A9
      id: 'Twinning Magicrystal',
      regex: / 14:3E0C:The Tycoon starts using Magicrystal/,
      regexDe: / 14:3E0C:Tycoon starts using Magitek-Kristall/,
      alertText: {
        en: 'spread',
        de: 'Verteilen',
      },
    },
    {
      id: 'Twinning Discharger',
      regex: / 14:3DFC:The Tycoon starts using High-Tension Discharger/,
      regexDe: / 14:3DFC:Tycoon starts using Hochspannungsentlader/,
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank' || data.CanAddle();
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
  ],
},
];
