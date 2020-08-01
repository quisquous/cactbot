'use strict';

[{
  zoneRegex: {
    en: /^The Final Coil Of Bahamut - Turn \(4\)$/,
    cn: /^巴哈姆特大迷宫 \(真源之章4\)$/,
  },
  zoneId: ZoneId.TheFinalCoilOfBahamutTurn4,
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
      netRegex: NetRegexes.startsUsing({ id: 'BB9', source: 'Bahamut Prime', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: 'BB9', source: 'Prim-Bahamut', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: 'BB9', source: 'Primo-Bahamut', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: 'BB9', source: 'バハムート・プライム', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: 'BB9', source: '至尊巴哈姆特', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: 'BB9', source: '바하무트 프라임', capture: false }),
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
      netRegex: NetRegexes.startsUsing({ id: 'BAE', source: 'Bahamut Prime' }),
      netRegexDe: NetRegexes.startsUsing({ id: 'BAE', source: 'Prim-Bahamut' }),
      netRegexFr: NetRegexes.startsUsing({ id: 'BAE', source: 'Primo-Bahamut' }),
      netRegexJa: NetRegexes.startsUsing({ id: 'BAE', source: 'バハムート・プライム' }),
      netRegexCn: NetRegexes.startsUsing({ id: 'BAE', source: '至尊巴哈姆特' }),
      netRegexKo: NetRegexes.startsUsing({ id: 'BAE', source: '바하무트 프라임' }),
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
      netRegex: NetRegexes.headMarker({ id: '0027' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Megaflare Stack',
        de: 'Megaflare Sammeln',
        fr: 'MégaBrasier, Packez-vous',
        cn: '百万核爆集合',
      },
    },
    {
      id: 'T13 Earthshaker',
      netRegex: NetRegexes.headMarker({ id: '0028' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      response: Responses.earthshaker(),
    },
    {
      id: 'T13 Tempest Wing',
      netRegex: NetRegexes.tether({ id: '0004', target: 'Bahamut Prime' }),
      netRegexDe: NetRegexes.tether({ id: '0004', target: 'Prim-Bahamut' }),
      netRegexFr: NetRegexes.tether({ id: '0004', target: 'Primo-Bahamut' }),
      netRegexJa: NetRegexes.tether({ id: '0004', target: 'バハムート・プライム' }),
      netRegexCn: NetRegexes.tether({ id: '0004', target: '至尊巴哈姆特' }),
      netRegexKo: NetRegexes.tether({ id: '0004', target: '바하무트 프라임' }),
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
      netRegex: NetRegexes.startsUsing({ id: 'BC2', source: 'Bahamut Prime' }),
      netRegexDe: NetRegexes.startsUsing({ id: 'BC2', source: 'Prim-Bahamut' }),
      netRegexFr: NetRegexes.startsUsing({ id: 'BC2', source: 'Primo-Bahamut' }),
      netRegexJa: NetRegexes.startsUsing({ id: 'BC2', source: 'バハムート・プライム' }),
      netRegexCn: NetRegexes.startsUsing({ id: 'BC2', source: '至尊巴哈姆特' }),
      netRegexKo: NetRegexes.startsUsing({ id: 'BC2', source: '바하무트 프라임' }),
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
        '\\(center\\)': '(mitte)',
        '\\(E/W\\)': '(O/W)',
        '\\(E\\)': '(O)',
        'Akh Morn': 'Akh Morn',
        'Blood': 'Blut',
        'Dark Aether': 'Dunkeläther',
        'Double Dive': 'Doppelschwinge',
        'Earth Shaker': 'Erdstoß',
        'Flare Breath': 'Flare-Atem',
        'Flare Star': 'Flare-Stern',
        'Flatten': 'Einebnen',
        'Gigaflare': 'Gigaflare',
        'Gust Add': 'Wind Add',
        'MF Pepperoni': 'MF Fläche',
        'MF Share': 'MF Sammeln',
        'MF Spread': 'MF Verteilen',
        'MF Tower\\(s\\)': 'MF Türme',
        'MF Tower(?!\\(s)': 'MF Turm',
        'Megaflare': 'Megaflare',
        'Pain Add': 'Schmerz Add',
        'Rage Of Bahamut': 'Bahamuts Zorn',
        'Shadow Add': 'Schatten Add',
        'Sin Add': 'Sünde Add',
        'Storm Add': 'Sturm Add',
        'Tempest Wing': 'Sturm-Schwinge',
        'Teraflare': 'Teraflare',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Bahamut Prime': 'Primo-Bahamut',
        'The Storm of Meracydia': 'Tempête De Méracydia',
      },
      'replaceText': {
        '\\(center\\)': '(centre)',
        '\\(E/W\\)': '(E/O)',
        '\\(SW\\)': '(SO)',
        '\\(W\\)': '(O)',
        'Akh Morn': 'Akh Morn',
        '(?<! )Blood Add': 'Add Sang',
        'Blood, Pain Adds': 'Adds Sang, Douleur',
        '1x Dark Aether Orb': '1x Orbe d\'éther sombre',
        'Dark Aether Orbs': 'Orbes d\'éther sombre',
        'Double Dive': 'Plongeon double',
        'Earth Shaker Marker': 'Marquage Secousse',
        'Earth Shaker(?! Marker)': 'Secousse',
        'Flare Breath': 'Souffle brasier',
        'Flare Star': 'Astre flamboyant',
        'Flatten': 'Compression',
        'Gigaflare': 'GigaBrasier',
        '2x Gust Adds': 'Adds 2x Bourrasque',
        '3x Gust Adds': 'Adds 3x Bourrasque',
        'MF Pepperoni': 'MB Zones au sol',
        'MF Share': 'MB Partagez',
        'MF Spread': 'MB Dispersez-vous',
        'MF Tower': 'MB Tour',
        'Megaflare Dive': 'Plongeon Mégabrasier',
        'Megaflare(?! Dive)': 'MégaBrasier',
        '(?<! )Pain Add': 'Add Douleur',
        'Rage Of Bahamut': 'Courroux de Bahamut',
        'Shadow Add': 'Add Ombre',
        '(?<! )Sin Add': 'Add Péché',
        '2x Sin Adds': 'Adds 2x Péché',
        'Storm Add': 'Add Tempête',
        'Tempest Wing Tethers': 'Liens Aile de tempête',
        'Tempest Wing(?! Tethers)': 'Aile de tempête',
        'Teraflare': 'TéraBrasier',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Bahamut Prime': 'バハムート・プライム',
        'The Storm of Meracydia': 'メラシディアン・ストーム',
      },
      'replaceText': {
        'Akh Morn': 'アク・モーン',
        'Dark Aether': 'ダークエーテル',
        'Double Dive': 'ダブルダイブ',
        'Earth Shaker': 'アースシェイカー',
        'Flare Breath': 'フレアブレス',
        'Flare Star': 'フレアスター',
        'Flatten': '押しつぶす',
        'Gigaflare': 'ギガフレア',
        'Megaflare': 'メガフレア',
        'Rage Of Bahamut': '龍神の咆吼',
        'Tempest Wing': 'テンペストウィング',
        'Teraflare': 'テラフレア',
      },
    },
    {
      'locale': 'cn',
      'missingTranslations': true,
      'replaceSync': {
        'Bahamut Prime': '至尊巴哈姆特',
        'The Storm of Meracydia': '美拉西迪亚的怒雨',
      },
      'replaceText': {
        'Akh Morn': '死亡轮回',
        'Dark Aether': '暗以太',
        'Double Dive': '双重俯冲',
        'Earth Shaker': '大地摇动',
        'Flare Breath': '核爆吐息',
        'Flare Star': '耀星',
        'Flatten': '跺脚',
        'Gigaflare': '十亿核爆',
        'Megaflare': '百万核爆',
        'Rage Of Bahamut': '龙神咆哮',
        'Tempest Wing': '风暴之翼',
        'Teraflare': '万亿核爆',
      },
    },
    {
      'locale': 'ko',
      'missingTranslations': true,
      'replaceSync': {
        'Bahamut Prime': '바하무트 프라임',
        'The Storm of Meracydia': '메라시디아의 폭풍',
      },
      'replaceText': {
        'Akh Morn': '아크 몬',
        'Dark Aether': '어둠의 에테르',
        'Double Dive': '이중 강하',
        'Earth Shaker': '요동치는 대지',
        'Flare Breath': '타오르는 숨결',
        'Flare Star': '타오르는 별',
        'Flatten': '압사',
        'Gigaflare': '기가플레어',
        'Megaflare': '메가플레어',
        'Rage Of Bahamut': '용신의 포효',
        'Tempest Wing': '폭풍우 날개',
        'Teraflare': '테라플레어',
      },
    },
  ],
}];
