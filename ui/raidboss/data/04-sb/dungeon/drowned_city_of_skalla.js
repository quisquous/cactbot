'use strict';

[{
  zoneRegex: /^The Drowned City Of Skalla$/,
  triggers: [
    {
      id: 'Hrodric Tank',
      regex: / 14:2661:Hrodric Poisontongue starts using Rusting Claw/,
      regexDe: / 14:2661:Hrodric Giftzunge starts using Rostklaue/,
      regexFr: / 14:2661:Hrodric Le Médisant starts using Griffes De Ruine/,
      regexJa: / 14:2661:直言のフロドリック starts using ラスティクロウ/,
      infoText: function(data) {
        return data.role != 'tank' ? 'tank cleave' : '';
      },
      alertText: function(data) {
        return data.role == 'tank' ? 'tank cleave' : '';
      },
      tts: {
        en: 'tank cleave',
        de: 'tenk klief',
        fr: 'tank clive',
      },
    },
    {
      id: 'Hrodric Tail',
      regex: / 14:2663:Hrodric Poisontongue starts using Tail Drive/,
      regexDe: / 14:2663:Hrodric Giftzunge starts using Schwanzfetzer/,
      regexFr: / 14:2663:Hrodric Le Médisant starts using Coup De Queue/,
      regexJa: / 14:2663:直言のフロドリック starts using テイルドライブ/,
      infoText: function(data) {
        return data.role == 'tank' ? 'tail cleave' : '';
      },
      alertText: function(data) {
        return data.role != 'tank' ? 'tail cleave' : '';
      },
      tts: {
        en: 'tail attack',
        de: 'schweifattacke',
        fr: 'attaque queue',
      },
    },
    {
      id: 'Hrodric Eye',
      regex: / 14:2665:Hrodric Poisontongue starts using Eye Of The Fire/,
      regexDe: / 14:2665:Hrodric Giftzunge starts using Feuerauge/,
      regexFr: / 14:2665:Hrodric Le Médisant starts using Œil Des Flammes/,
      regexJa: / 14:2665:直言のフロドリック starts using フィアーアイ/,
      alertText: {
        en: 'look away',
        de: 'wegschauen',
        fr: 'Détournez le regard',
      },
    },
    {
      id: 'Hrodric Words',
      regex: / 14:2662:Hrodric Poisontongue starts using Words Of Woe/,
      regexDe: / 14:2662:Hrodric Giftzunge starts using Wehklagende Worte/,
      regexFr: / 14:2662:Hrodric Le Médisant starts using Mots De Malheur/,
      regexJa: / 14:2662:直言のフロドリック starts using ワード・オブ・ウー/,
      infoText: {
        en: 'avoid eye lasers',
        de: 'Augenlaser ausweichen',
        fr: 'Evitez les lasers',
      },
      tts: {
        en: 'eye laser',
        de: 'augen lesa',
        fr: 'laser',
      },
    },
  ],
}];
