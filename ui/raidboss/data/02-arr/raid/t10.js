'use strict';

[{
  zoneRegex: {
    en: /^The Final Coil Of Bahamut - Turn \(1\)$/,
    cn: /^巴哈姆特大迷宫 \(真源之章1\)$/,
  },
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
      response: Responses.spread(),
    },
    {
      id: 'T10 Wild Charge',
      regex: Regexes.headMarker({ id: '001F' }),
      alarmText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Charge on YOU',
            de: 'Ansturm auf DIR',
            fr: 'Charge sur VOUS',
            cn: '蓝球点名',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me != matches.target) {
          return {
            en: 'Charge on ' + data.ShortName(matches.target),
            de: 'Ansturm auf ' + data.ShortName(matches.target),
            fr: 'Charge sur ' + data.ShortName(matches.target),
            cn: '蓝球点' + data.ShortName(matches.target),
          };
        }
      },
    },
    {
      id: 'T10 Prey',
      regex: Regexes.headMarker({ id: '001E' }),
      response: Responses.preyOn(),
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
            de: 'Zyklon-Chaos auf DIR',
            fr: 'Chaos cyclonique sur VOUS',
            cn: '连线点名',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me != matches.target) {
          return {
            en: 'Cyclonic on ' + data.ShortName(matches.target),
            de: 'Zyklon-Chaos auf ' + data.ShortName(matches.target),
            fr: 'Chaos cyclonique sur ' + data.ShortName(matches.target),
            cn: '连线点' + data.ShortName(matches.target),
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
      },
      'replaceText': {
        '1x Son / 1x Daughter Adds': 'Adds 1x Fils / 1x Fille',
        '2x Son / 2x Daughter Adds': 'Adds 2x Fils / 2x Fille',
        'Crackle Hiss': 'Crachat crépitant',
        'Critical Rip': 'Griffure critique',
        'Cyclonic Chaos': 'Chaos cyclonique',
        'Electric Burst': 'Salve électrique',
        'Electrocharge': 'Charge électrique',
        'Heat Lightning': 'Éclair de chaleur',
        'Random \\+ Charge': 'Aléatoire + Charge',
        'Spike Flail': 'Fléau à pointes',
        'Wild Charge': 'Charge sauvage',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Imdugud': 'イムドゥグド',
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
      'missingTranslations': true,
      'replaceSync': {
        'Imdugud': '伊姆都古德',
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
      'missingTranslations': true,
      'replaceSync': {
        'Imdugud': '임두구드',
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
