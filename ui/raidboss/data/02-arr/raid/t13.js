'use strict';

[{
  zoneRegex: /^The Final Coil Of Bahamut - Turn \(4\)$/,
  timelineFile: 't13.txt',
  timelineTriggers: [
    {
      id: 'T13 Dive Warning',
      regex: /Megaflare Dive/,
      beforeSeconds: 5,
      infoText: {
        en: 'Stack Center for Dives',
        fr: 'Packé au centre pour les dives',
      },
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
            fr: 'Packé au centre pour les dives',
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
            fr: 'Applatissement sur VOUS',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches.target == data.me)
          return;
        if (data.role == 'healer' || data.job == 'BLU') {
          return {
            en: 'Flatten on ' + data.ShortName(matches.target),
            fr: 'Applatissement sur ' + data.ShortName(matches.target),
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
        fr: 'MégaBrasier package',
      },
    },
    {
      id: 'T13 Earthshaker',
      regex: Regexes.headMarker({ id: '0028' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Earthshaker on YOU',
        fr: 'Secousse sur VOUS',
      },
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
        fr: 'Liens de tempête sur VOUS',
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
            fr: 'Akh Morn sur VOUS',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches.target != data.me) {
          return {
            en: 'Akh Morn on ' + data.ShortName(matches.target),
            fr: 'Akh Morn sur ' + data.ShortName(matches.target),
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
        'Enrage': 'Finalangriff',
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
        'Enrage': 'Enrage',
        'Flare Breath': 'Souffle brasier',
        'Flare Star': 'Astre flamboyant',
        'Flatten': 'Aplatissement',
        'Gigaflare': 'GigaBrasier',
        'Gust Add': 'Add Bourrasque',
        'MF Pepperoni': 'MF Pepperoni',
        'MF Share': 'MégaBrasier Partage',
        'MF Spread': 'MégaBrasier Dispersion',
        'MF Tower': 'MégaBrasier Tour',
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
        'Enrage': 'Enrage',
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
        'Enrage': 'Enrage', // FIXME
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
        'Enrage': 'Enrage', // FIXME
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
