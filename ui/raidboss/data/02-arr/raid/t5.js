'use strict';

[{
  zoneRegex: /^The Binding Coil Of Bahamut - Turn \(5\)$/,
  timelineFile: 't5.txt',
  triggers: [
    {
      id: 'T5 Death Sentence',
      regex: Regexes.startsUsing({ source: 'Twintania', id: '5B2' }),
      regexDe: Regexes.startsUsing({ source: 'Twintania', id: '5B2' }),
      regexFr: Regexes.startsUsing({ source: 'Gémellia', id: '5B2' }),
      regexJa: Regexes.startsUsing({ source: 'ツインタニア', id: '5B2' }),
      regexCn: Regexes.startsUsing({ source: '双塔尼亚', id: '5B2' }),
      regexKo: Regexes.startsUsing({ source: '트윈타니아', id: '5B2' }),
      condition: function(data, matches) {
        return data.me == matches.target || data.role == 'healer' || data.job == 'BLU';
      },
      response: Responses.tankBuster(),
    },
    {
      id: 'T5 Death Sentence Warning',
      regex: Regexes.startsUsing({ source: 'Twintania', id: '5B2', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Twintania', id: '5B2', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Gémellia', id: '5B2', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ツインタニア', id: '5B2', capture: false }),
      regexCn: Regexes.startsUsing({ source: '双塔尼亚', id: '5B2', capture: false }),
      regexKo: Regexes.startsUsing({ source: '트윈타니아', id: '5B2', capture: false }),
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer' || data.job == 'BLU';
      },
      delaySeconds: 30,
      suppressSeconds: 5,
      infoText: {
        en: 'Death Sentence Soon',
      },
    },
    {
      id: 'T5 Liquid Hell',
      regex: Regexes.startsUsing({ source: 'The Scourge Of Meracydia', id: '4DB', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Fackel Von Meracydia', id: '4DB', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Fléau De Méracydia', id: '4DB', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'メラシディアン・ワイバーン', id: '4DB', capture: false }),
      regexCn: Regexes.startsUsing({ source: '美拉西迪亚祸龙', id: '4DB', capture: false }),
      regexKo: Regexes.startsUsing({ source: '메라시디아 와이번', id: '4DB', capture: false }),
      infoText: {
        en: 'Liquid Hell',
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
      regex: Regexes.ability({ source: 'Twintania', id: '5AC' }),
      regexDe: Regexes.ability({ source: 'Twintania', id: '5AC' }),
      regexFr: Regexes.ability({ source: 'Gémellia', id: '5AC' }),
      regexJa: Regexes.ability({ source: 'ツインタニア', id: '5AC' }),
      regexCn: Regexes.ability({ source: '双塔尼亚', id: '5AC' }),
      regexKo: Regexes.ability({ source: '트윈타니아', id: '5AC' }),
      alertText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Fireball on YOU',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me != matches.target) {
          return {
            en: 'Fireball on ' + data.ShortName(matches.target),
          };
        }
      },
    },
    {
      id: 'T5 Conflagration',
      regex: Regexes.ability({ source: 'Twintania', id: '5AB' }),
      regexDe: Regexes.ability({ source: 'Twintania', id: '5AB' }),
      regexFr: Regexes.ability({ source: 'Gémellia', id: '5AB' }),
      regexJa: Regexes.ability({ source: 'ツインタニア', id: '5AB' }),
      regexCn: Regexes.ability({ source: '双塔尼亚', id: '5AB' }),
      regexKo: Regexes.ability({ source: '트윈타니아', id: '5AB' }),
      alarmText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Conflag on YOU',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me != matches.target) {
          return {
            en: 'Conflag on ' + data.ShortName(matches.target),
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
      regex: Regexes.ability({ source: 'Twintania', id: '5B0', capture: false }),
      regexDe: Regexes.ability({ source: 'Twintania', id: '5B0', capture: false }),
      regexFr: Regexes.ability({ source: 'Gémellia', id: '5B0', capture: false }),
      regexJa: Regexes.ability({ source: 'ツインタニア', id: '5B0', capture: false }),
      regexCn: Regexes.ability({ source: '双塔尼亚', id: '5B0', capture: false }),
      regexKo: Regexes.ability({ source: '트윈타니아', id: '5B0', capture: false }),
      alertText: {
        en: 'DIVEBOMB',
      },
    },
    {
      id: 'T5 Divebomb Set Two',
      regex: Regexes.ability({ source: 'Twintania', id: '5B0', capture: false }),
      regexDe: Regexes.ability({ source: 'Twintania', id: '5B0', capture: false }),
      regexFr: Regexes.ability({ source: 'Gémellia', id: '5B0', capture: false }),
      regexJa: Regexes.ability({ source: 'ツインタニア', id: '5B0', capture: false }),
      regexCn: Regexes.ability({ source: '双塔尼亚', id: '5B0', capture: false }),
      regexKo: Regexes.ability({ source: '트윈타니아', id: '5B0', capture: false }),
      delaySeconds: 60,
      suppressSeconds: 5000,
      infoText: {
        en: 'Divebombs Soon',
      },
    },
    {
      // Unwoven Will
      id: 'T5 Dreadknight',
      regex: Regexes.ability({ source: 'Twintania', id: '4E3' }),
      regexDe: Regexes.ability({ source: 'Twintania', id: '4E3' }),
      regexFr: Regexes.ability({ source: 'Gémellia', id: '4E3' }),
      regexJa: Regexes.ability({ source: 'ツインタニア', id: '4E3' }),
      regexCn: Regexes.ability({ source: '双塔尼亚', id: '4E3' }),
      regexKo: Regexes.ability({ source: '트윈타니아', id: '4E3' }),
      infoText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Knight on YOU',
          };
        }
        return {
          en: 'Knight on ' + data.ShortName(matches.target),
        };
      },
    },
    {
      id: 'T5 Twister',
      regex: Regexes.startsUsing({ source: 'Twintania', id: '4E1', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Twintania', id: '4E1', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Gémellia', id: '4E1', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ツインタニア', id: '4E1', capture: false }),
      regexCn: Regexes.startsUsing({ source: '双塔尼亚', id: '4E1', capture: false }),
      regexKo: Regexes.startsUsing({ source: '트윈타니아', id: '4E1', capture: false }),
      alertText: {
        en: 'Twister!',
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
      regex: Regexes.ability({ source: 'Twintania', id: '5AD' }),
      regexDe: Regexes.ability({ source: 'Twintania', id: '5AD' }),
      regexFr: Regexes.ability({ source: 'Gémellia', id: '5AD' }),
      regexJa: Regexes.ability({ source: 'ツインタニア', id: '5AD' }),
      regexCn: Regexes.ability({ source: '双塔尼亚', id: '5AD' }),
      regexKo: Regexes.ability({ source: '트윈타니아', id: '5AD' }),
      alertText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Hatch on YOU',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me != matches.target) {
          return {
            en: 'Hatch on ' + data.ShortName(matches.target),
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
        'The Right Hand of Bahamut will be sealed off': 'bis sich der Zugang zur Rechten Hand von Bahamut schließt',
        'Twintania': 'Twintania',
      },
      'replaceText': {
        '--targetable--': '--anvisierbar--',
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
        'Twister': 'Wilder Wirbelwind',
        'Unwoven Will': 'Entwobener Wille',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Engage!': 'À l\'attaque !',
        'The Right Hand of Bahamut will be sealed off': 'Fermeture de la Serre droite de Bahamut',
        'Twintania': 'Gémellia',
      },
      'replaceText': {
        '--targetable--': '--Ciblable--',
        'Aetheric Profusion': 'Excès d\'éther',
        'Asclepius': 'Asclépios',
        'Death Sentence': 'Peine de mort',
        'Divebomb': 'Bombe plongeante',
        'Fireball': 'Boule de feu',
        'Firestorm': 'Tempête de feu',
        'Hatch': 'Éclosion',
        'Hygieia': 'Hygie',
        'Liquid Hell': 'Enfer liquide',
        'Plummet': 'Piqué',
        'Twister': 'Grande tornade',
        'Unwoven Will': 'Volonté dispersée',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Engage!': '戦闘開始！',
        'The Right Hand of Bahamut will be sealed off': 'The Right Hand of Bahamut will be sealed off', // FIXME
        'Twintania': 'ツインタニア',
      },
      'replaceText': {
        '--targetable--': '--targetable--',
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
        'Twister': '大竜巻',
        'Unwoven Will': 'アンウォーヴェンウィル',
      },
    },
  ],
}];
