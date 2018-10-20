'use strict';

[{
  zoneRegex: /^The Drowned City Of Skalla$/,
  triggers: [
    {
      id: 'Hrodric Tank',
      regex: /:Hrodric Poisontongue starts using Rusting Claw/,
      regexDe: /:Hrodric Giftzunge starts using Rostklaue/,
      regexFr: /:Hrodric Le Médisant starts using Griffes De Ruine/,
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
      regex: /:Hrodric Poisontongue starts using Tail Drive/,
      regexDe: /:Hrodric Giftzunge starts using Schwanzfetzer/,
      regexFr: /:Hrodric Le Médisant starts using Offensive Caudale/,
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
      regex: /:Hrodric Poisontongue starts using Eye Of The Fire/,
      regexDe: /:Hrodric Giftzunge starts using Feuerauge/,
      regexFr: /:Hrodric Le Médisant starts using Œil Des Flammes/,
      alertText: function(data) {
        return {
          en: 'look away',
          de: 'wegschauen',
          fr: 'Détournez le regard',
        };
      },
    },
    {
      id: 'Hrodric Words',
      regex: /:Hrodric Poisontongue starts using Words Of Woe/,
      regexDe: /:Hrodric Giftzunge starts using Wehklagende Worte/,
      regexFr: /:Hrodric Le Médisant starts using Mots De Malheur/,
      infoText: function(data) {
        return {
          en: 'avoid eye lasers',
          de: 'Augenlaser ausweichen',
          fr: 'Evitez les lasers',
        };
      },
      tts: {
        en: 'eye laser',
        de: 'augen lesa',
        fr: 'laser',
      },
    },
  ],
}];
