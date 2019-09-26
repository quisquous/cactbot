'use strict';

// Fractal Continuum
[{
  zoneRegex: /^The Fractal Continuum$/,
  triggers: [
    {
      id: 'Fractal Rapid Sever',
      regex: / 14:F7A:Phantom Ray starts using Rapid Sever on (\y{Name})/,
      infoText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Tank buster on YOU',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.shortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'Fractal Slash',
      regex: / 14:F83:Minotaur starts using 10-Tonze Slash/,
      infoText: {
        en: 'Out of front',
      },
    },
    {
      id: 'Fractal Swipe',
      regex: / 14:F81:Minotaur starts using 11-Tonze Swipe/,
      infoText: {
        en: 'Out of front',
      },
    },
    {
      id: 'Fractal Small Swing',
      regex: / 14:F82:Minotaur starts using 111-Tonze Swing/,
      infoText: {
        en: 'Get out',
      },
    },
    {
      id: 'Fractal Big Swing',
      regex: / 14:F87:Minotaur starts using 1111-Tonze Swing/,
      alertText: {
        en: 'Use a cage',
      },
    },
    {
      id: 'Fractal Aetherochemical Bomb',
      regex: / 1A:(\y{ObjectId}):(\y{Name}) gains the effect of Aetherochemical Bomb/,
      condition: function(data) {
        return data.CanCleanse();
      },
      infoText: {
        en: 'Cleanse bomb',
      },
    },
    {
      id: 'Fractal Alarums',
      regex: / 03:(\y{ObjectId}):Added new combatant Clockwork Alarum/,
      suppresSeconds: 5,
      infoText: {
        en: 'Kill adds',
      },
    },
    {
      id: 'Fractal Mines',
      regex: / 03:(\y{ObjectId}):Added new combatant Aetherochemical Mine/,
      suppressSeconds: 30,
      alertText: {
        en: 'Avoid mines',
      },
    },
  ],
}];
