'use strict';

// O1S - Deltascape 1.0 Savage
[{
  zoneRegex: /(Deltascape V1.0 \(Savage\)|Unknown Zone \(2B7\))/,
  timelineFile: 'o1s.txt',
  triggers: [
    {
      id: 'O1S Blaze',
      regex: /:1EDD:Alte Roite starts using/,
      infoText: {
        en: 'Blaze: Stack up',
        de: 'Flamme: Stacken',
      },
      tts: {
        en: 'stack',
        de: 'stek',
      },
    },
    {
      id: 'O1S Breath Wing',
      regex: /:1ED6:Alte Roite starts using/,
      infoText: {
        en: 'Breath Wing: Be beside boss',
        de: 'Atemschwinge: Neben Boss gehen',
      },
      tts: {
        en: 'breath wing',
        de: 'atemschwinge',
      },
    },
    {
      id: 'O1S Clamp',
      regex: /:1EDE:Alte Roite starts using/,
      infoText: {
        en: 'Clamp: Get out of front',
        de: 'Klammer: Vorm Boss weg',
      },
      tts: {
        en: 'clamp',
        de: 'klammer',
      },
    },
    {
      id: 'O1S Downburst',
      regex: /:1ED8:Alte Roite starts using/,
      infoText: {
        en: 'Downburst: Knockback',
        de: 'Fallböe: Rückstoß',
      },
      tts: {
        en: 'knockback',
        de: 'rückstoß',
      },
    },
    {
      id: 'O1S Roar',
      regex: /:1ED4:Alte Roite starts using/,
      infoText: {
        en: 'Roar: AOE damage',
        de: 'Brüllen: Flächenschaden',
      },
      condition: function(data) {
        return data.role == 'healer';
      },
      tts: {
        en: 'roar',
        de: 'brüllen',
      },
    },
    {
      id: 'O1S Charybdis',
      regex: /:1ED3:Alte Roite starts using/,
      infoText: {
        en: 'Charybdis: AOE damage',
        de: 'Charybdis: Flächenschaden',
      },
      condition: function(data) {
        return data.role == 'healer';
      },
      tts: {
        en: 'roar',
        de: 'brüllen',
      },
    },
  ],
}];
