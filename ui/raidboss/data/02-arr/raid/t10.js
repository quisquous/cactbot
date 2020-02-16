'use strict';

[{
  zoneRegex: /^The Final Coil Of Bahamut - Turn \(1\)$/,
  timelineFile: 't10.txt',
  triggers: [
    {
      id: 'T10 Phase Change',
      regex: Regexes.startsUsing({ id: 'B5D', source: 'Imdugud', capture: false }),
      regexDe: Regexes.startsUsing({ id: 'B5D', source: 'Imdugud', capture: false }),
      regexFr: Regexes.startsUsing({ id: 'B5D', source: 'Imdugud', capture: false }),
      regexJa: Regexes.startsUsing({ id: 'B5D', source: 'イムドゥグド', capture: false }),
      regexCn: Regexes.startsUsing({ id: 'B5D', source: '伊姆都古德', capture: false }),
      regexKo: Regexes.startsUsing({ id: 'B5D', source: '임두구드', capture: false }),
      sound: 'Long',
    },
    {
      id: 'T10 Heat Lightning',
      regex: Regexes.startsUsing({ id: 'B5F', source: 'Imdugud', capture: false }),
      regexDe: Regexes.startsUsing({ id: 'B5F', source: 'Imdugud', capture: false }),
      regexFr: Regexes.startsUsing({ id: 'B5F', source: 'Imdugud', capture: false }),
      regexJa: Regexes.startsUsing({ id: 'B5F', source: 'イムドゥグド', capture: false }),
      regexCn: Regexes.startsUsing({ id: 'B5F', source: '伊姆都古德', capture: false }),
      regexKo: Regexes.startsUsing({ id: 'B5F', source: '임두구드', capture: false }),
      alertText: {
        en: 'Spread',
        fr: 'Ecartez-vous',
      },
    },
    {
      id: 'T10 Wild Charge',
      regex: Regexes.headMarker({ id: '001F' }),
      alarmText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Charge on YOU',
            fr: 'Charge sur VOUS',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me != matches.target) {
          return {
            en: 'Charge on ' + data.ShortName(matches.target),
            fr: 'Charge sur ' + data.ShortName(matches.target),
          };
        }
      },
    },
    {
      id: 'T10 Prey',
      regex: Regexes.headMarker({ id: '001E' }),
      alertText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Prey on YOU',
            fr: 'Prière sur VOUS',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me != matches.target) {
          return {
            en: 'Prey on ' + data.ShortName(matches.target),
            fr: 'Prière sur ' + data.ShortName(matches.target),
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
        'Random \\+ Charge': 'Zufall + Wilde Rage',
        'Son': 'Sohn',
        'Spike Flail': 'Dornendresche',
        'Wild Charge': 'Wilde Rage',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
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
        'Random \\+ Charge': 'Aléatoire + Charge',
        'Son': 'Fils',
        'Spike Flail': 'Fléau à pointes',
        'Wild Charge': 'Charge sauvage',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
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
        'Random \\+ Charge': 'Random + Charge', // FIXME
        'Son': 'Son', // FIXME
        'Spike Flail': 'スパイクフレイル',
        'Wild Charge': 'ワイルドチャージ',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Imdugud': '伊姆都古德',
        'The Alpha Concourse will be sealed off': 'The Alpha Concourse will be sealed off', // FIXME
      },
      'replaceText': {
        'Crackle Hiss': '雷光电闪',
        'Critical Rip': '暴击撕裂',
        'Cyclonic Chaos': '龙卷雷暴',
        'Daughter': 'Daughter', // FIXME
        'Electric Burst': '电光爆发',
        'Electrocharge': '蓄电',
        'Heat Lightning': '惊电',
        'Random \\+ Charge': 'Random + Charge', // FIXME
        'Son': 'Son', // FIXME
        'Spike Flail': '刃尾横扫',
        'Wild Charge': '狂野冲锋',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Imdugud': '임두구드',
        'The Alpha Concourse will be sealed off': 'The Alpha Concourse will be sealed off', // FIXME
      },
      'replaceText': {
        'Crackle Hiss': '파직파직 번개',
        'Critical Rip': '찢어가르기',
        'Cyclonic Chaos': '휘몰아치는 혼돈',
        'Daughter': 'Daughter', // FIXME
        'Electric Burst': '전하 폭발',
        'Electrocharge': '전하 충전',
        'Heat Lightning': '뜨거운 번개',
        'Random \\+ Charge': 'Random + Charge', // FIXME
        'Son': 'Son', // FIXME
        'Spike Flail': '가시 매타작',
        'Wild Charge': '야성의 돌진',
      },
    },
  ],
}];
