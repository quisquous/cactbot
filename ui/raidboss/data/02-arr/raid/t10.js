'use strict';

[{
  zoneRegex: /^The Final Coil Of Bahamut - Turn \(1\)$/,
  timelineFile: 't10.txt',
  triggers: [
    {
      id: 'T10 Phase Change',
      regex: / 14:B5D:Imdugud starts using Electrocharge/,
      regexDe: / 14:B5D:Imdugud starts using Elektro-Ladung/,
      regexFr: / 14:B5D:Imdugud starts using Charge Électrique/,
      regexJa: / 14:B5D:イムドゥグド starts using エレクトロチャージ/,
      sound: 'Long',
    },
    {
      id: 'T10 Heat Lightning',
      regex: / 14:B5F:Imdugud starts using Heat Lightning/,
      regexDe: / 14:B5F:Imdugud starts using Hitzeblitz/,
      regexFr: / 14:B5F:Imdugud starts using Éclair De Chaleur/,
      regexJa: / 14:B5F:イムドゥグド starts using ヒートライトニング/,
      alertText: {
        en: 'Spread',
      },
    },
    {
      id: 'T10 Wild Charge',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:001F:/,
      alarmText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Charge on YOU',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me != matches[1]) {
          return {
            en: 'Charge on ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'T10 Prey',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:001E:/,
      alertText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Prey on YOU',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me != matches[1]) {
          return {
            en: 'Prey on ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'T10 Cyclonic Tether',
      regex: / 23:\y{ObjectId}:Imdugud:\y{ObjectId}:(\y{Name}):....:....:0015:/,
      regexDe: / 23:\y{ObjectId}:Imdugud:\y{ObjectId}:(\y{Name}):....:....:0015:/,
      regexFr: / 23:\y{ObjectId}:Imdugud:\y{ObjectId}:(\y{Name}):....:....:0015:/,
      regexJa: / 23:\y{ObjectId}:イムドゥグド:\y{ObjectId}:(\y{Name}):....:....:0015:/,
      alarmText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Cyclonic on YOU',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me != matches[1]) {
          return {
            en: 'Cyclonic on ' + data.ShortName(matches[1]),
          };
        }
      },
    },
  ],
}];
