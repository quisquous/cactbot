'use strict';

[{
  zoneRegex: {
    en: /^The Binding Coil Of Bahamut - Turn \(5\)$/,
    cn: /^巴哈姆特大迷宫 \(邂逅之章5\)$/,
  },
  zoneId: ZoneId.TheBindingCoilOfBahamutTurn5,
  timelineFile: 't5.txt',
  triggers: [
    {
      id: 'T5 Death Sentence',
      netRegex: NetRegexes.startsUsing({ source: 'Twintania', id: '5B2' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Twintania', id: '5B2' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Gémellia', id: '5B2' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ツインタニア', id: '5B2' }),
      netRegexCn: NetRegexes.startsUsing({ source: '双塔尼亚', id: '5B2' }),
      netRegexKo: NetRegexes.startsUsing({ source: '트윈타니아', id: '5B2' }),
      condition: function(data, matches) {
        return data.me == matches.target || data.role == 'healer' || data.job == 'BLU';
      },
      response: Responses.tankBuster(),
    },
    {
      id: 'T5 Death Sentence Warning',
      netRegex: NetRegexes.startsUsing({ source: 'Twintania', id: '5B2', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Twintania', id: '5B2', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Gémellia', id: '5B2', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ツインタニア', id: '5B2', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '双塔尼亚', id: '5B2', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '트윈타니아', id: '5B2', capture: false }),
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer' || data.job == 'BLU';
      },
      delaySeconds: 30,
      suppressSeconds: 5,
      infoText: {
        en: 'Death Sentence Soon',
        de: 'Todesurteil bald',
        fr: 'Peine de mort bientôt',
        cn: '死刑',
      },
    },
    {
      id: 'T5 Liquid Hell',
      netRegex: NetRegexes.startsUsing({ source: 'The Scourge Of Meracydia', id: '4DB', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Fackel Von Meracydia', id: '4DB', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Fléau De Méracydia', id: '4DB', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'メラシディアン・ワイバーン', id: '4DB', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '美拉西迪亚祸龙', id: '4DB', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '메라시디아 와이번', id: '4DB', capture: false }),
      infoText: {
        en: 'Liquid Hell',
        de: 'Höllenschmelze',
        fr: 'Enfer liquide',
        cn: '液体地狱',
      },
    },
    {
      id: 'T5 Phase 2',
      regex: Regexes.hasHP({ name: 'Twintania', hp: '85', capture: false }),
      regexDe: Regexes.hasHP({ name: 'Twintania', hp: '85', capture: false }),
      regexFr: Regexes.hasHP({ name: 'Gémellia', hp: '85', capture: false }),
      regexJa: Regexes.hasHP({ name: 'ツインタニア', hp: '85', capture: false }),
      regexCn: Regexes.hasHP({ name: '双塔尼亚', hp: '85', capture: false }),
      regexKo: Regexes.hasHP({ name: '트윈타니아', hp: '85', capture: false }),
      sound: 'Long',
    },
    {
      id: 'T5 Fireball',
      netRegex: NetRegexes.ability({ source: 'Twintania', id: '5AC' }),
      netRegexDe: NetRegexes.ability({ source: 'Twintania', id: '5AC' }),
      netRegexFr: NetRegexes.ability({ source: 'Gémellia', id: '5AC' }),
      netRegexJa: NetRegexes.ability({ source: 'ツインタニア', id: '5AC' }),
      netRegexCn: NetRegexes.ability({ source: '双塔尼亚', id: '5AC' }),
      netRegexKo: NetRegexes.ability({ source: '트윈타니아', id: '5AC' }),
      alertText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Fireball on YOU',
            de: 'Feuerball auf DIR',
            fr: 'Boule de feu sur VOUS',
            cn: '火球点名',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me != matches.target) {
          return {
            en: 'Fireball on ' + data.ShortName(matches.target),
            de: 'Feuerball auf ' + data.ShortName(matches.target),
            fr: 'Boule de feu sur ' + data.ShortName(matches.target),
            cn: '火球点' + data.ShortName(matches.target),
          };
        }
      },
    },
    {
      id: 'T5 Conflagration',
      netRegex: NetRegexes.ability({ source: 'Twintania', id: '5AB' }),
      netRegexDe: NetRegexes.ability({ source: 'Twintania', id: '5AB' }),
      netRegexFr: NetRegexes.ability({ source: 'Gémellia', id: '5AB' }),
      netRegexJa: NetRegexes.ability({ source: 'ツインタニア', id: '5AB' }),
      netRegexCn: NetRegexes.ability({ source: '双塔尼亚', id: '5AB' }),
      netRegexKo: NetRegexes.ability({ source: '트윈타니아', id: '5AB' }),
      alarmText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Conflag on YOU',
            de: 'Feuersturm auf DIR',
            fr: 'Tempête de feu sur VOUS',
            cn: '火焰流点名',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me != matches.target) {
          return {
            en: 'Conflag on ' + data.ShortName(matches.target),
            de: 'Feuersturm auf ' + data.ShortName(matches.target),
            fr: 'Tempête de feu sur ' + data.ShortName(matches.target),
            cn: '火焰流点' + data.ShortName(matches.target),
          };
        }
      },
    },
    {
      id: 'T5 Phase 3',
      regex: Regexes.hasHP({ name: 'Twintania', hp: '55', capture: false }),
      regexDe: Regexes.hasHP({ name: 'Twintania', hp: '55', capture: false }),
      regexFr: Regexes.hasHP({ name: 'Gémellia', hp: '55', capture: false }),
      regexJa: Regexes.hasHP({ name: 'ツインタニア', hp: '55', capture: false }),
      regexCn: Regexes.hasHP({ name: '双塔尼亚', hp: '55', capture: false }),
      regexKo: Regexes.hasHP({ name: '트윈타니아', hp: '55', capture: false }),
      sound: 'Long',
    },
    {
      id: 'T5 Divebomb',
      netRegex: NetRegexes.ability({ source: 'Twintania', id: '5B0', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Twintania', id: '5B0', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Gémellia', id: '5B0', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'ツインタニア', id: '5B0', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '双塔尼亚', id: '5B0', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '트윈타니아', id: '5B0', capture: false }),
      alertText: {
        en: 'DIVEBOMB',
        de: 'STURZBOMBE',
        fr: 'BOMBE PLONGEANTE',
        cn: '俯冲',
      },
    },
    {
      id: 'T5 Divebomb Set Two',
      netRegex: NetRegexes.ability({ source: 'Twintania', id: '5B0', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Twintania', id: '5B0', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Gémellia', id: '5B0', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'ツインタニア', id: '5B0', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '双塔尼亚', id: '5B0', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '트윈타니아', id: '5B0', capture: false }),
      delaySeconds: 60,
      suppressSeconds: 5000,
      infoText: {
        en: 'Divebombs Soon',
        de: 'Sturzbombe bald',
        fr: 'Bombe plongeante bientôt',
        cn: '即将俯冲',
      },
    },
    {
      // Unwoven Will
      id: 'T5 Dreadknight',
      netRegex: NetRegexes.ability({ source: 'Twintania', id: '4E3' }),
      netRegexDe: NetRegexes.ability({ source: 'Twintania', id: '4E3' }),
      netRegexFr: NetRegexes.ability({ source: 'Gémellia', id: '4E3' }),
      netRegexJa: NetRegexes.ability({ source: 'ツインタニア', id: '4E3' }),
      netRegexCn: NetRegexes.ability({ source: '双塔尼亚', id: '4E3' }),
      netRegexKo: NetRegexes.ability({ source: '트윈타니아', id: '4E3' }),
      infoText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Knight on YOU',
            de: 'Furchtritter auf DIR',
            fr: 'Chevalier sur VOUS',
            cn: '骑士点名',
          };
        }
        return {
          en: 'Knight on ' + data.ShortName(matches.target),
          de: 'Furchtritter auf ' + data.ShortName(matches.target),
          fr: 'Chevalier sur ' + data.ShortName(matches.target),
          cn: '骑士点' + data.ShortName(matches.target),
        };
      },
    },
    {
      id: 'T5 Twister',
      netRegex: NetRegexes.startsUsing({ source: 'Twintania', id: '4E1', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Twintania', id: '4E1', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Gémellia', id: '4E1', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ツインタニア', id: '4E1', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '双塔尼亚', id: '4E1', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '트윈타니아', id: '4E1', capture: false }),
      alertText: {
        en: 'Twister!',
        de: 'Wirbelsturm!',
        fr: 'Tornade !',
        cn: '风风风！',
      },
    },
    {
      id: 'T5 Phase 4',
      regex: Regexes.hasHP({ name: 'Twintania', hp: '29', capture: false }),
      regexDe: Regexes.hasHP({ name: 'Twintania', hp: '29', capture: false }),
      regexFr: Regexes.hasHP({ name: 'Gémellia', hp: '29', capture: false }),
      regexJa: Regexes.hasHP({ name: 'ツインタニア', hp: '29', capture: false }),
      regexCn: Regexes.hasHP({ name: '双塔尼亚', hp: '29', capture: false }),
      regexKo: Regexes.hasHP({ name: '트윈타니아', hp: '29', capture: false }),
      sound: 'Long',
    },
    {
      id: 'T5 Hatch',
      netRegex: NetRegexes.ability({ source: 'Twintania', id: '5AD' }),
      netRegexDe: NetRegexes.ability({ source: 'Twintania', id: '5AD' }),
      netRegexFr: NetRegexes.ability({ source: 'Gémellia', id: '5AD' }),
      netRegexJa: NetRegexes.ability({ source: 'ツインタニア', id: '5AD' }),
      netRegexCn: NetRegexes.ability({ source: '双塔尼亚', id: '5AD' }),
      netRegexKo: NetRegexes.ability({ source: '트윈타니아', id: '5AD' }),
      alertText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Hatch on YOU',
            de: 'Austritt auf DIR',
            fr: 'Éclosion sur VOUS',
            cn: '黑球点名',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me != matches.target) {
          return {
            en: 'Hatch on ' + data.ShortName(matches.target),
            de: 'Austritt auf ' + data.ShortName(matches.target),
            fr: 'Éclosion sur ' + data.ShortName(matches.target),
            cn: '黑球点' + data.ShortName(matches.target),
          };
        }
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'The Right Hand of Bahamut': 'Rechten Hand von Bahamut',
        'The Scourge Of Meracydia': 'Fackel von Meracydia',
        'Twintania': 'Twintania',
      },
      'replaceText': {
        'Aetheric Profusion': 'Ätherische Profusion',
        'Asclepius': 'Asclepius',
        'Death Sentence': 'Todesurteil',
        'Divebomb': 'Sturzbombe',
        'Fireball': 'Feuerball',
        'Firestorm': 'Feuersturm',
        'Hatch': 'Austritt',
        'Hygieia': 'Hygieia',
        'Liquid Hell': 'Höllenschmelze',
        'Plummet': 'Ausloten',
        'Twister': 'Wirbelsturm',
        'Unwoven Will': 'Entwobener Wille',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'The Right Hand of Bahamut': 'la Serre droite de Bahamut',
        'The Scourge Of Meracydia': 'Fléau De Méracydia',
        'Twintania': 'Gémellia',
      },
      'replaceText': {
        '1x Asclepius Add': 'Add 1x Asclépios',
        '2x Hygieia Adds': 'Adds 2x Hygie',
        'Aetheric Profusion': 'Excès d\'éther',
        'Death Sentence': 'Peine de mort',
        'Divebomb': 'Bombe plongeante',
        'Fireball': 'Boule de feu',
        'Firestorm': 'Tempête de feu',
        'Hatch': 'Éclosion',
        'Liquid Hell': 'Enfer liquide',
        'Plummet': 'Piqué',
        'Twister': 'Tornade',
        'Unwoven Will': 'Volonté dispersée',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'The Right Hand of Bahamut': 'バハムートの右手',
        'The Scourge Of Meracydia': 'メラシディアン・ワイバーン',
        'Twintania': 'ツインタニア',
      },
      'replaceText': {
        'Aetheric Profusion': 'エーテリックプロフュージョン',
        'Asclepius': 'アスクレピオス',
        'Death Sentence': 'デスセンテンス',
        'Divebomb': 'ダイブボム',
        'Fireball': 'ファイアボール',
        'Firestorm': 'ファイアストーム',
        'Hatch': '魔力爆散',
        'Hygieia': 'ヒュギエイア',
        'Liquid Hell': 'ヘルリキッド',
        'Plummet': 'プラメット',
        'Twister': 'ツイスター',
        'Unwoven Will': 'アンウォーヴェンウィル',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'The Right Hand of Bahamut': '巴哈姆特的右手',
        'The Scourge Of Meracydia': '美拉西迪亚祸龙',
        'Twintania': '双塔尼亚',
      },
      'replaceText': {
        'Aetheric Profusion': '以太失控',
        'Asclepius': '阿斯克勒庇俄斯',
        'Death Sentence': '死刑',
        'Divebomb': '爆破俯冲',
        'Fireball': '火球',
        'Firestorm': '火焰风暴',
        'Hatch': '魔力爆散',
        'Hygieia': '许癸厄亚',
        'Liquid Hell': '液体地狱',
        'Plummet': '垂直下落',
        'Twister': '旋风',
        'Unwoven Will': '破愿',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'The Right Hand of Bahamut': '바하무트의 오른손',
        'The Scourge Of Meracydia': '메라시디아 와이번',
        'Twintania': '트윈타니아',
      },
      'replaceText': {
        'Aetheric Profusion': '에테르 홍수',
        'Asclepius': '아스클레피오스',
        'Death Sentence': '사형 선고',
        'Divebomb': '급강하 폭격',
        'Fireball': '화염구',
        'Firestorm': '불보라',
        'Hatch': '마력 방출',
        'Hygieia': '히기에이아',
        'Liquid Hell': '지옥의 늪',
        'Plummet': '곤두박질',
        'Twister': '회오리',
        'Unwoven Will': '짓밟힌 의지',
      },
    },
  ],
}];
