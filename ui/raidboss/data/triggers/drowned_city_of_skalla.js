[{
  zoneRegex: /^The Drowned City Of Skalla$/,
  triggers: [
    {
      id: 'Hrodric Tank',
      regex: /:Hrodric Poisontongue starts using Rusting Claw/,
      regexDe: /:Hrodric Giftzunge starts using Rostklaue/,
      infoText: function(data) {
        return data.role != 'tank' ? 'tank cleave' : '';
      },
      alertText: function(data) {
        return data.role == 'tank' ? 'tank cleave' : '';
      },
      tts: 'tank cleave',
    },
    {
      id: 'Hrodric Tail',
      regex: /:Hrodric Poisontongue starts using Tail Drive/,
      regexDe: /:Hrodric Giftzunge starts using Schwanzfetzer/,
      infoText: function(data) {
        return data.role == 'tank' ? "tail cleave" : "";
      },
      alertText: function(data) {
        return data.role != 'tank' ? "tail cleave" : "";
      },
      tts: {
        en: 'tail attack',
        de: 'schwanzangriff',
      },
    },
    {
      id: 'Hrodric Eye',
      regex: /:Hrodric Poisontongue starts using Eye Of The Fire/,
      regexDe: /:Hrodric Giftzunge starts using Feuerauge/,
      alertText: function(data) {
        return {
          en: "look away",
          de: "wegschauen",
        };
      },
      tts: {
        en: 'look away',
        de: 'weck schauen',
      },
    },
    {
      id: 'Hrodric Words',
      regex: /:Hrodric Poisontongue starts using Words Of Woe/,
      regexDe: /:Hrodric Giftzunge starts using Wehklagende Worte/,
      infoText: function(data) {
        return {
          en: "avoid eye lasers",
          de: "augenlaser ausweichen",
        };
      },
      tts: {
        en: 'eye laser',
        de: 'augenstrahl',
      },
    },
  ]
}]
