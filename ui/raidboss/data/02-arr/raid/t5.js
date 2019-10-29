'use strict';

[{
  zoneRegex: /^The Binding Coil Of Bahamut - Turn \(5\)$/,
  timelineFile: 't5.txt',
  triggers: [
    {
      id: 'T5 Death Sentence',
      regex: / 14:5B2:Twintania starts using Death Sentence on (\y{Name})\./,
      regexDe: / 14:5B2:Twintania starts using Todesurteil on (\y{Name})\./,
      regexFr: / 14:5B2:Gémellia starts using Peine De Mort on (\y{Name})\./,
      regexJa: / 14:5B2:ツインタニア starts using デスセンテンス on (\y{Name})\./,
      condition: function(data, matches) {
        return data.me == matches[1] || data.role == 'healer' || data.job == 'BLU';
      },
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches[1] != data.me) {
          return {
            en: 'Tank Buster on ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'T5 Death Sentence Warning',
      regex: / 14:5B2:Twintania starts using Death Sentence/,
      regexDe: / 14:5B2:Twintania starts using Todesurteil/,
      regexFr: / 14:5B2:Gémellia starts using Peine De Mort/,
      regexJa: / 14:5B2:ツインタニア starts using デスセンテンス/,
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
      regex: / 14:4DB:The Scourge Of Meracydia starts using Liquid Hell/,
      regexDe: / 14:4DB:Fackel Von Meracydia starts using Höllenschmelze/,
      regexFr: / 14:4DB:Fléau De Méracydia starts using Enfer Liquide/,
      regexJa: / 14:4DB:メラシディアン・ワイバーン starts using ヘルリキッド/,
      infoText: {
        en: 'Fireball',
      },
    },
    {
      id: 'T5 Phase 2',
      regex: /:Twintania HP at 85%/,
      sound: 'Long',
    },
    {
      id: 'T5 Fireball',
      regex: / 15:\y{ObjectId}:Twintania:5AC:Fireball:\y{ObjectId}:(\y{Name}):/,
      regexDe: / 15:\y{ObjectId}:Twintania:5AC:Feuerball:\y{ObjectId}:(\y{Name}):/,
      regexFr: / 15:\y{ObjectId}:Gémellia:5AC:Boule de feu:\y{ObjectId}:(\y{Name}):/,
      regexJa: / 15:\y{ObjectId}:ツインタニア:5AC:ファイアボール:\y{ObjectId}:(\y{Name}):/,
      alertText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Fireball on YOU',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me != matches[1]) {
          return {
            en: 'Fireball on ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'T5 Conflag',
      regex: / 15:\y{ObjectId}:Twintania:5AB:Firestorm:\y{ObjectId}:(\y{Name}):/,
      regexDe: / 15:\y{ObjectId}:Twintania:5AB:Feuersturm:\y{ObjectId}:(\y{Name}):/,
      regexFr: / 15:\y{ObjectId}:Gémellia:5AB:Tempête de feu:\y{ObjectId}:(\y{Name}):/,
      regexJa: / 15:\y{ObjectId}:ツインタニア:5AB:ファイアストーム:\y{ObjectId}:(\y{Name}):/,
      alarmText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Conflag on YOU',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me != matches[1]) {
          return {
            en: 'Conflag on ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'T5 Phase 3',
      regex: /:Twintania HP at 55%/,
      sound: 'Long',
    },
    {
      id: 'T5 Divebomb',
      regex: / 15:\y{ObjectId}:Twintania:5B0:Divebomb:/,
      regexDe: / 15:\y{ObjectId}:Twintania:5B0:Sturzbombe:/,
      regexFr: / 15:\y{ObjectId}:Gémellia:5B0:Bombe plongeante:/,
      regexJa: / 15:\y{ObjectId}:ツインタニア:5B0:ダイブボム:/,
      alertText: {
        en: 'DIVEBOMB',
      },
    },
    {
      id: 'T5 Divebomb Set Two',
      regex: / 15:\y{ObjectId}:Twintania:5B0:Divebomb:/,
      regexDe: / 15:\y{ObjectId}:Twintania:5B0:Sturzbombe:/,
      regexFr: / 15:\y{ObjectId}:Gémellia:5B0:Bombe plongeante:/,
      regexJa: / 15:\y{ObjectId}:ツインタニア:5B0:ダイブボム:/,
      delaySeconds: 60,
      suppressSeconds: 5000,
      infoText: {
        en: 'Divebombs Soon',
      },
    },
    {
      id: 'T5 Dreadknight',
      regex: / 15:\y{ObjectId}:Twintania:4E3:Unwoven Will:\y{ObjectId}:(\y{Name}):/,
      regexDe: / 15:\y{ObjectId}:Twintania:4E3:Entwobener Wille:\y{ObjectId}:(\y{Name}):/,
      regexFr: / 15:\y{ObjectId}:Gémellia:4E3:Volonté dispersée:\y{ObjectId}:(\y{Name}):/,
      regexJa: / 15:\y{ObjectId}:ツインタニア:4E3:アンウォーヴェンウィル:\y{ObjectId}:(\y{Name}):/,
      infoText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Knight on YOU',
          };
        }
        return {
          en: 'Knight on ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'T5 Twister',
      regex: / 14:4E1:Twintania starts using Twister/,
      regexDe: / 14:4E1:Twintania starts using Wirbelsturm/,
      regexFr: / 14:4E1:Gémellia starts using Tornade/,
      regexJa: / 14:4E1:ツインタニア starts using ツイスター/,
      alertText: {
        en: 'Twister!',
      },
    },
    {
      id: 'T5 Phase 4',
      regex: /:Twintania HP at 29%/,
      sound: 'Long',
    },
    {
      id: 'T5 Hatch',
      regex: / 15:\y{ObjectId}:Twintania:5AD:Hatch:\y{ObjectId}:(\y{Name}):/,
      regexDe: / 15:\y{ObjectId}:Twintania:5AD:Austritt:\y{ObjectId}:(\y{Name}):/,
      regexFr: / 15:\y{ObjectId}:Gémellia:5AD:Éclosion:\y{ObjectId}:(\y{Name}):/,
      regexJa: / 15:\y{ObjectId}:ツインタニア:5AD:魔力爆散:\y{ObjectId}:(\y{Name}):/,
      alertText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Hatch on YOU',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Hatch on ' + data.ShortName(matches[1]),
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
