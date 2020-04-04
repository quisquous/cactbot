'use strict';

[{
  zoneRegex: {
    en: /^The Final Coil Of Bahamut - Turn \(4\)$/,
    cn: /^巴哈姆特大迷宫 \(真源之章4\)$/,
  },
  timelineFile: 't13.txt',
  timelineTriggers: [
    {
      id: 'T13 Dive Warning',
      regex: /Megaflare Dive/,
      beforeSeconds: 5,
      response: Responses.stackMiddle(),
    },
  ],
  triggers: [
    {
      id: 'T13 Gigaflare Phase Change',
      regex: Regexes.startsUsing({ id: 'BB9', source: 'Bahamut Prime', capture: false }),
      regexDe: Regexes.startsUsing({ id: 'BB9', source: 'Prim-Bahamut', capture: false }),
      regexFr: Regexes.startsUsing({ id: 'BB9', source: 'Primo-Bahamut', capture: false }),
      regexJa: Regexes.startsUsing({ id: 'BB9', source: 'バハムート・プライム', capture: false }),
      regexCn: Regexes.startsUsing({ id: 'BB9', source: '至尊巴哈姆特', capture: false }),
      regexKo: Regexes.startsUsing({ id: 'BB9', source: '바하무트 프라임', capture: false }),
      condition: function(data) {
        // Only the first two gigas are phase changes, the rest are in final phase.
        return !(data.gigaflare > 1);
      },
      sound: 'Long',
      infoText: function(data) {
        if (data.gigaflare) {
          return {
            en: 'Stack Center for Dives',
            de: 'In der Mitte sammeln für Sturzbombe',
            fr: 'Packez-vous au centre pour les plongeons',
            cn: '中间集合等待俯冲',
          };
        }
      },
      run: function(data) {
        data.gigaflare = data.gigaflare || 0;
        data.gigaflare++;
      },
    },
    {
      id: 'T13 Flatten',
      regex: Regexes.startsUsing({ id: 'BAE', source: 'Bahamut Prime' }),
      regexDe: Regexes.startsUsing({ id: 'BAE', source: 'Prim-Bahamut' }),
      regexFr: Regexes.startsUsing({ id: 'BAE', source: 'Primo-Bahamut' }),
      regexJa: Regexes.startsUsing({ id: 'BAE', source: 'バハムート・プライム' }),
      regexCn: Regexes.startsUsing({ id: 'BAE', source: '至尊巴哈姆特' }),
      regexKo: Regexes.startsUsing({ id: 'BAE', source: '바하무트 프라임' }),
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Flatten on YOU',
            de: 'Einebnen auf DIR',
            fr: 'Compression sur VOUS',
            cn: '死刑',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches.target == data.me)
          return;
        if (data.role == 'healer' || data.job == 'BLU') {
          return {
            en: 'Flatten on ' + data.ShortName(matches.target),
            de: 'Einebnen auf ' + data.ShortName(matches.target),
            fr: 'Compression sur ' + data.ShortName(matches.target),
            cn: '死刑点' + data.ShortName(matches.target),
          };
        }
      },
    },
    {
      id: 'T13 Megaflare Share',
      regex: Regexes.headMarker({ id: '0027' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Megaflare Stack',
        de: 'Megaflare Sammeln',
        fr: 'MégaBrasier Packez-vous',
        cn: '百万核爆集合',
      },
    },
    {
      id: 'T13 Earthshaker',
      regex: Regexes.headMarker({ id: '0028' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      response: Responses.earthshaker(),
    },
    {
      id: 'T13 Tempest Wing',
      regex: Regexes.tether({ id: '0004', target: 'Bahamut Prime' }),
      regexDe: Regexes.tether({ id: '0004', target: 'Prim-Bahamut' }),
      regexFr: Regexes.tether({ id: '0004', target: 'Primo-Bahamut' }),
      regexJa: Regexes.tether({ id: '0004', target: 'バハムート・プライム' }),
      regexCn: Regexes.tether({ id: '0004', target: '至尊巴哈姆特' }),
      regexKo: Regexes.tether({ id: '0004', target: '바하무트 프라임' }),
      condition: function(data, matches) {
        return data.me == matches.source;
      },
      infoText: {
        en: 'Tempest Tether on YOU',
        de: 'Sturm Verbindung auf DIR',
        fr: 'Liens de tempête sur VOUS',
        cn: '风圈点名',
      },
    },
    {
      id: 'T13 Akh Morn',
      regex: Regexes.startsUsing({ id: 'BC2', source: 'Bahamut Prime' }),
      regexDe: Regexes.startsUsing({ id: 'BC2', source: 'Prim-Bahamut' }),
      regexFr: Regexes.startsUsing({ id: 'BC2', source: 'Primo-Bahamut' }),
      regexJa: Regexes.startsUsing({ id: 'BC2', source: 'バハムート・プライム' }),
      regexCn: Regexes.startsUsing({ id: 'BC2', source: '至尊巴哈姆特' }),
      regexKo: Regexes.startsUsing({ id: 'BC2', source: '바하무트 프라임' }),
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Akh Morn on YOU',
            de: 'Akh Morn auf DIR',
            fr: 'Akh Morn sur VOUS',
            cn: '死亡轮回点名',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches.target != data.me) {
          return {
            en: 'Akh Morn on ' + data.ShortName(matches.target),
            de: 'Akh Morn auf ' + data.ShortName(matches.target),
            fr: 'Akh Morn sur ' + data.ShortName(matches.target),
            cn: '死亡轮回点' + data.ShortName(matches.target),
          };
        }
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Bahamut Prime': 'Prim-Bahamut',
        'The Storm of Meracydia': 'Sturm von Meracydia',
      },
      'replaceText': {
        'Akh Morn': 'Akh Morn',
        'Blood Add': 'Blood Add', // FIXME
        'Dark Aether': 'Dunkeläther',
        'Double Dive': 'Doppelschwinge',
        'Earth Shaker': 'Erdstoß',
        'Flare Breath': 'Flare-Atem',
        'Flare Star': 'Flare-Stern',
        'Flatten': 'Einstampfen',
        'Gigaflare': 'Gigaflare',
        'Gust Add': 'Gust Add', // FIXME
        'MF Pepperoni': 'MF Pepperoni', // FIXME
        'MF Share': 'MF Share', // FIXME
        'MF Spread': 'MF Spread', // FIXME
        'MF Tower': 'MF Tower', // FIXME
        'Megaflare': 'Megaflare',
        'Pain Add': 'Pain Add', // FIXME
        'Rage Of Bahamut': 'Bahamuts Zorn',
        'Shadow Add': 'Shadow Add', // FIXME
        'Sin Add': 'Sin Add', // FIXME
        'Storm Add': 'Storm Add', // FIXME
        'Tempest Wing': 'Sturm-Schwinge',
        'Teraflare': 'Teraflare',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Bahamut Prime': 'Primo-Bahamut',
        'The Storm of Meracydia': 'Tempête de Méracydia',
      },
      'replaceText': {
        'Akh Morn': 'Akh Morn',
        'Blood Add': 'Add Sang',
        'Dark Aether': 'éther sombre',
        'Double Dive': 'Plongeon double',
        'Earth Shaker': 'Secousse',
        'Flare Breath': 'Souffle brasier',
        'Flare Star': 'Astre flamboyant',
        'Flatten': 'Compression',
        'Gigaflare': 'GigaBrasier',
        'Gust Add': 'Add Bourrasque',
        'MF Pepperoni': 'MB Zones au sol',
        'MF Share': 'MB Partagez',
        'MF Spread': 'MB Ecartez',
        'MF Tower': 'MB Tour',
        'Megaflare': 'MégaBrasier',
        'Pain Add': 'Add Douleur',
        'Rage Of Bahamut': 'Courroux de Bahamut',
        'Shadow Add': 'Add Ombre',
        'Sin Add': 'Add Péché',
        'Storm Add': 'Add Tempête',
        'Tempest Wing': 'Aile de tempête',
        'Teraflare': 'TéraBrasier',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Bahamut Prime': 'バハムート・プライム',
        'The Storm of Meracydia': 'メラシディアン・ストーム',
      },
      'replaceText': {
        'Akh Morn': 'アク・モーン',
        'Blood Add': 'Blood Add', // FIXME
        'Dark Aether': 'ダークエーテル',
        'Double Dive': 'ダブルダイブ',
        'Earth Shaker': 'アースシェイカー',
        'Flare Breath': 'フレアブレス',
        'Flare Star': 'フレアスター',
        'Flatten': '押しつぶす',
        'Gigaflare': 'ギガフレア',
        'Gust Add': 'Gust Add', // FIXME
        'MF Pepperoni': 'MF Pepperoni', // FIXME
        'MF Share': 'MF Share', // FIXME
        'MF Spread': 'MF Spread', // FIXME
        'MF Tower': 'MF Tower', // FIXME
        'Megaflare': 'メガフレア',
        'Pain Add': 'Pain Add', // FIXME
        'Rage Of Bahamut': '龍神の咆吼',
        'Shadow Add': 'Shadow Add', // FIXME
        'Sin Add': 'Sin Add', // FIXME
        'Storm Add': 'Storm Add', // FIXME
        'Tempest Wing': 'テンペストウィング',
        'Teraflare': 'テラフレア',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Bahamut Prime': '至尊巴哈姆特',
        'The Storm of Meracydia': '美拉西迪亚的怒雨',
      },
      'replaceText': {
        'Akh Morn': '死亡轮回',
        'Blood Add': 'Blood Add', // FIXME
        'Dark Aether': '暗以太',
        'Double Dive': '双重俯冲',
        'Earth Shaker': '大地摇动',
        'Flare Breath': '核爆吐息',
        'Flare Star': '耀星',
        'Flatten': '跺脚',
        'Gigaflare': '十亿核爆',
        'Gust Add': 'Gust Add', // FIXME
        'MF Pepperoni': 'MF Pepperoni', // FIXME
        'MF Share': 'MF Share', // FIXME
        'MF Spread': 'MF Spread', // FIXME
        'MF Tower': 'MF Tower', // FIXME
        'Megaflare': '百万核爆',
        'Pain Add': 'Pain Add', // FIXME
        'Rage Of Bahamut': '龙神咆哮',
        'Shadow Add': 'Shadow Add', // FIXME
        'Sin Add': 'Sin Add', // FIXME
        'Storm Add': 'Storm Add', // FIXME
        'Tempest Wing': '风暴之翼',
        'Teraflare': '万亿核爆',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Bahamut Prime': '바하무트 프라임',
        'The Storm of Meracydia': '메라시디아의 폭풍',
      },
      'replaceText': {
        'Akh Morn': '아크 몬',
        'Blood Add': 'Blood Add', // FIXME
        'Dark Aether': '어둠의 에테르',
        'Double Dive': '이중 강하',
        'Earth Shaker': '요동치는 대지',
        'Flare Breath': '타오르는 숨결',
        'Flare Star': '타오르는 별',
        'Flatten': '압사',
        'Gigaflare': '기가플레어',
        'Gust Add': 'Gust Add', // FIXME
        'MF Pepperoni': 'MF Pepperoni', // FIXME
        'MF Share': 'MF Share', // FIXME
        'MF Spread': 'MF Spread', // FIXME
        'MF Tower': 'MF Tower', // FIXME
        'Megaflare': '메가플레어',
        'Pain Add': 'Pain Add', // FIXME
        'Rage Of Bahamut': '용신의 포효',
        'Shadow Add': 'Shadow Add', // FIXME
        'Sin Add': 'Sin Add', // FIXME
        'Storm Add': 'Storm Add', // FIXME
        'Tempest Wing': '폭풍우 날개',
        'Teraflare': '테라플레어',
      },
    },
  ],
}];
