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
        fr: 'Ecartez-vous',
      },
    },
    {
      id: 'T10 Wild Charge',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:001F:/,
      alarmText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Charge on YOU',
            fr: 'Charge sur VOUS',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me != matches[1]) {
          return {
            en: 'Charge on ' + data.ShortName(matches[1]),
            fr: 'Charge sur ' + data.ShortName(matches[1]),
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
            fr: 'Prière sur VOUS',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me != matches[1]) {
          return {
            en: 'Prey on ' + data.ShortName(matches[1]),
            fr: 'Prière sur ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'T10 Cyclonic Tether',
      regex: Regexes.tether({ id: '0015', source: 'Imdugud' }),
      regexDe: Regexes.tether({ id: '0015', source: 'Imdugud' }),
      regexFr: Regexes.tether({ id: '0015', source: 'Imdugud' }),
      regexJa: Regexes.tether({ id: '0015', source: 'イムドゥグド' }),
      regexCn: Regexes.tether({ id: '0015', source: '伊姆都古德' }),
      regexKo: Regexes.tether({ id: '0015', source: '임두구드' }),
      alarmText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Cyclonic on YOU',
            fr: 'Chaos cyclonique sur VOUS',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me != matches.target) {
          return {
            en: 'Cyclonic on ' + data.ShortName(matches.target),
            fr: 'Chaos cyclonique sur ' + data.ShortName(matches.target),
          };
        }
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Engage!': 'Start!',
        'Imdugud': 'Imdugud',
        'The Alpha Concourse will be sealed off': 'bis sich der Zugang zur Alpha-Emergenzzone schließt',
      },
      'replaceText': {
        'Crackle Hiss': 'Knisterndes Fauchen',
        'Critical Rip': 'Kritischer Riss',
        'Cyclonic Chaos': 'Zyklon-Chaos',
        'Daughter': 'Tochter',
        'Electric Burst': 'Stromstoß',
        'Electrocharge': 'Elektro-Ladung',
        'Heat Lightning': 'Hitzeblitz',
        'Random + Charge': 'Zufall + Wilde Rage',
        'Son': 'Sohn',
        'Spike Flail': 'Dornendresche',
        'Wild Charge': 'Wilde Rage',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Engage!': 'À l\'attaque !',
        'Imdugud': 'Imdugud',
        'The Alpha Concourse will be sealed off': 'Fermeture du secteur des croyants',
      },
      'replaceText': {
        'Crackle Hiss': 'Crachat crépitant',
        'Critical Rip': 'Griffure critique',
        'Cyclonic Chaos': 'Chaos cyclonique',
        'Daughter': 'Fille',
        'Electric Burst': 'Salve électrique',
        'Electrocharge': 'Charge électrique',
        'Heat Lightning': 'Éclair de chaleur',
        'Random + Charge': 'Aléatoire + Charge',
        'Son': 'Fils',
        'Spike Flail': 'Fléau à pointes',
        'Wild Charge': 'Charge sauvage',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Engage!': '戦闘開始！',
        'Imdugud': 'イムドゥグド',
        'The Alpha Concourse will be sealed off': 'The Alpha Concourse will be sealed off', // FIXME
      },
      'replaceText': {
        'Crackle Hiss': 'クラックルヒス',
        'Critical Rip': 'クリティカルリップ',
        'Cyclonic Chaos': 'サイクロニックカオス',
        'Daughter': 'Daughter', // FIXME
        'Electric Burst': 'エレクトリックバースト',
        'Electrocharge': 'エレクトロチャージ',
        'Heat Lightning': 'ヒートライトニング',
        'Random + Charge': 'Random + Charge', // FIXME
        'Son': 'Son', // FIXME
        'Spike Flail': 'スパイクフレイル',
        'Wild Charge': 'ワイルドチャージ',
      },
    },
  ],
}];
