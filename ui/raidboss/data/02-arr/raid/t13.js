'use strict';

[{
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
            ja: '中央待機、メガフレアダイブを待つ',
            cn: '中间集合等待俯冲',
            ko: '기가플레어 집합',
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
            ja: '自分にフラッテン',
            cn: '死刑',
            ko: '짓뭉개기',
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
            ja: data.ShortName(matches.target) + 'にフラッテン',
            cn: '死刑点' + data.ShortName(matches.target),
            ko: '짓뭉개기 ' + data.ShortName(matches.target),
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
        ja: 'メガフレア、集合',
        cn: '百万核爆集合',
        ko: '메가플레어 쉐어',
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
        ja: '自分にテンペストウィング',
        cn: '风圈点名',
        ko: '폭풍 줄 대상자',
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
            ja: '自分にアク・モーン',
            cn: '死亡轮回点名',
            ko: '아크몬 대상자',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches.target != data.me) {
          return {
            en: 'Akh Morn on ' + data.ShortName(matches.target),
            de: 'Akh Morn auf ' + data.ShortName(matches.target),
            fr: 'Akh Morn sur ' + data.ShortName(matches.target),
            ja: data.ShortName(matches.target) + 'にアク・モーン',
            cn: '死亡轮回点' + data.ShortName(matches.target),
            ko: '아크몬 ' + data.ShortName(matches.target),
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
      'replaceSync': {
        'Bahamut Prime': 'バハムート・プライム',
        'The Storm of Meracydia': 'メラシディアン・ストーム',
      },
      'replaceText': {
        '\\(center\\)': '(中)',
        '\\(E/W\\)': '(東/西)',
        '\\(SW\\)': '(南西)',
        '\\(W\\)': '(西)',
        'Akh Morn': 'アク・モーン',
        '(?<! )Blood Add': '雑魚: ブラッド',
        'Blood, Pain Adds': '雑魚: ブラッド + ペイン',
        '1x Dark Aether Orb': '1x ダークエーテル',
        'Dark Aether Orbs': 'ダークエーテル',
        'Double Dive': 'ダブルダイブ',
        'Earth Shaker': 'アースシェイカー',
        'Flare Breath': 'フレアブレス',
        'Flare Star': 'フレアスター',
        'Flatten': 'フラッテン',
        'Gigaflare': 'ギガフレア',
        '2x Gust Adds': '雑魚: 2x ガスト',
        '3x Gust Adds': '雑魚: 3x ガスト',
        'MF Pepperoni': 'メガ: AoE',
        'MF Share': 'メガ: 頭割り',
        'MF Spread': 'メガ: 散開',
        'MF Tower': 'メガ: 塔',
        'Megaflare': 'メガフレア',
        'Rage Of Bahamut': '龍神の咆吼',
        'Shadow Add': '雑魚: シャドウ',
        '(?<! )Sin Add': '雑魚: シン',
        '2x Sin Adds': '雑魚: 2x シン',
        'Storm Add': '雑魚: ストーム',
        'Tempest Wing Tethers': 'テンペストウィング・線',
        'Tempest Wing(?! Tethers)': 'テンペストウィング',
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
        '\\(center\\)': '(中央)',
        '\\(E/W\\)': '(东/西)',
        '\\(E\\)': '(东)',
        '\\(SW\\)': '(西南)',
        '\\(W\\)': '(西)',
        'Akh Morn': '死亡轮回',
        '(?<! )Blood Add': '血仇出现',
        'Blood, Pain Adds': '血仇, 苦痛出现',
        '1x Dark Aether Orb': '1x暗以太',
        'Dark Aether Orbs': '暗以太',
        'Double Dive': '双重俯冲',
        'Earth Shaker Marker': '大地摇动点名',
        'Earth Shaker(?! Marker)': '大地摇动',
        'Flare Breath': '核爆吐息',
        'Flare Star': '耀星',
        'Flatten': '夷为平地',
        'Gigaflare': '十亿核爆',
        '2x Gust Adds': '2x悲风出现',
        '3x Gust Adds': '3x悲风出现',
        'MF Pepperoni': '百万核爆放粑粑',
        'MF Share': '百万核爆分摊',
        'MF Spread': '百万核爆分散',
        'MF Tower': '百万核爆踩塔',
        'Megaflare Dive': '百万核爆冲',
        'Megaflare(?! Dive)': '百万核爆',
        '(?<! )Pain Add': '苦痛出现',
        'Rage Of Bahamut': '龙神咆哮',
        'Shadow Add': '怨影出现',
        '(?<! )Sin Add': '罪恶出现',
        '2x Sin Adds': '2x罪恶出现',
        'Storm Add': '怒雨出现',
        'Tempest Wing Tethers': '风暴之翼连线',
        'Tempest Wing(?! Tethers)': '风暴之翼',
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
        'Flatten': '짓뭉개기',
        'Gigaflare': '기가플레어',
        'Megaflare': '메가플레어',
        'Rage Of Bahamut': '용신의 포효',
        'Tempest Wing': '폭풍우 날개',
        'Teraflare': '테라플레어',
      },
    },
  ],
}];
