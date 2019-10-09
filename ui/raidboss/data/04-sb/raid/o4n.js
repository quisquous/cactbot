'use strict';

// O4N - Deltascape 4.0 Normal

[{

  zoneRegex: /^Deltascape \(V4.0\)$/,
  timelineFile: 'o4n.txt',
  triggers: [
    {
      id: 'O4N Doom',
      regex: / 14:24B7:Exdeath starts using Doom/,
      regexDe: / 14:24B7:Exdeath starts using Verhängnis/,
      regexFr: / 14:24B7:Exdeath starts using Glas/,
      regexJa: / 14:24B7:エクスデス starts using 死の宣告/,
      condition: function(data) {
        return data.CanCleanse();
      },
      alertText: {
        en: 'Cleanse Doom soon',
      },
    },
    {
      id: 'O4N Standard Thunder',
      regex: / 14:24BD:Exdeath starts using Thunder III on (\y{Name})/,
      regexDe: / 14:24BD:Exdeath starts using Blitzga on (\y{Name})/,
      regexFr: / 14:24BD:Exdeath starts using Méga Foudre on (\y{Name})/,
      regexJa: / 14:24BD:エクスデス starts using サンダガ on (\y{Name})/,
      infoText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank buster on YOU',
          };
        }
      },
      alertText: function(data, matches) {
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'O4N Standard Fire',
      regex: / 14:24BA:Exdeath starts using Fire III on (\y{Name})/,
      regexDe: / 14:24BA:Exdeath starts using Feuga on (\y{Name})/,
      regexFr: / 14:24BA:Exdeath starts using Méga Feu on (\y{Name})/,
      regexJa: / 14:24BA:エクスデス starts using ファイガ on (\y{Name})/,
      alertText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Spread for Fire',
          };
        }
      },
    },
    {
      id: 'O4N Empowered Blizzard',
      regex: / 14:24C0:Exdeath starts using Blizzard III/,
      regexDe: / 14:24C0:Exdeath starts using Eisga/,
      regexFr: / 14:24C0:Exdeath starts using Méga Glace/,
      regexJa: / 14:24C0:エクスデス starts using ブリザガ/,
      infoText: {
        en: 'Move around',
      },
    },
    {
      id: 'O4N Empowered Fire',
      regex: / 14:24BF:Exdeath starts using Fire III/,
      regexDe: / 14:24BF:Exdeath starts using Feuga/,
      regexFr: / 14:24BF:Exdeath starts using Méga Feu/,
      regexJa: / 14:24BF:エクスデス starts using ファイガ/,
      infoText: {
        en: 'Stop everything',
      },
    },
    {
      id: 'O4N Empowered Thunder',
      regex: / 14:24C1:Exdeath starts using Thunder III/,
      regexDe: / 14:24C1:Exdeath starts using Blitzga/,
      regexFr: / 14:24C1:Exdeath starts using Méga Foudre/,
      regexJa: / 14:24C1:エクスデス starts using サンダガ/,
      alertText: {
        en: 'Get out',
      },
    },
    {
      id: 'O4N Decisive Battle ',
      regex: / 14:2408:Exdeath starts using The Decisive Battle/,
      regexDe: / 14:2408:Exdeath starts using Entscheidungsschlacht/,
      regexFr: / 14:2408:Exdeath starts using Combat Décisif/,
      regexJa: / 14:2408:エクスデス starts using 決戦/,
      delaySeconds: 6,
      infoText: {
        en: 'Stand in the gap',
      },
    },
    {
      id: 'O4N Zombie Breath',
      regex: / 14:240A:Exdeath starts using /,
      regexDe: / 14:240A:Exdeath starts using /,
      regexFr: / 14:240A:Exdeath starts using /,
      regexJa: / 14:240A:エクスデス starts using /,
      delaySeconds: 6,
      infoText: {
        en: 'Behind head--Avoid zombie breath',
      },
    },
    {
      id: 'O4N Black Hole',
      regex: / 14:24C8:Exdeath starts using Black Hole on Exdeath/,
      regexDe: / 14:24C8:Exdeath starts using Schwarzes Loch on Exdeath/,
      regexFr: / 14:24C8:Exdeath starts using Trou Noir on Exdeath/,
      regexJa: / 14:24C8:エクスデス starts using ブラックホール on エクスデス/,
      infoText: {
        en: 'Avoid black holes',
      },
    },
    {
      id: 'O4N Vacuum Wave',
      regex: / 14:24B8:Exdeath starts using Vacuum Wave on Exdeath/,
      regexDe: / 14:24B8:Exdeath starts using Vakuumwelle on Exdeath/,
      regexFr: / 14:24B8:Exdeath starts using Vacuum on Exdeath/,
      regexJa: / 14:24B8:エクスデス starts using 真空波 on エクスデス/,
      alertText: {
        en: 'Knockback',
      },
    },
    {
      id: 'O4N Flare',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0057/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Flare on YOU',
      },
    },
    {
      id: 'O4N Holy',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:003E/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
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
      id: 'O4N Meteor',
      regex: / 14:24C6:Exdeath starts using Meteor/,
      regexDe: / 14:24C6:Exdeath starts using Meteor/,
      regexFr: / 14:24C6:Exdeath starts using Météore/,
      regexJa: / 14:24C6:エクスデス starts using メテオ/,
      condition: function(data) {
        return data.role == 'healer';
      },
      alertText: {
        en: 'Heavy raid damage',
      },
    },
  ],
},
];
