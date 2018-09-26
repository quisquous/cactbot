'use strict';

// O11S - Alphascape 3.0 Savage
[{
  zoneRegex: /^Alphascape V3.0 \(Savage\)$/,
  timelineFile: 'o11s.txt',
  triggers: [
    {
      id: 'O11S Mustard Bomb',
      regex: / 14:326D:Omega starts using Mustard Bomb on (\y{Name})/,
      alarmText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tenkbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tenkbuster auf ' + data.ShortName(matches[1]),
            fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
          };
        }
      },
      tts: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'buster',
            de: 'basta',
            fr: 'tankbuster',
          };
        }
      },
    },
    {
      // Ability IDs:
      // Starboard 1: 3262
      // Starboard 2: 3263
      // Larboard 1: 3264
      // Larboard 2: 3265
      // For the cannons, match #1 and #2 for the first one.  This is so
      // that if a log entry for the first is dropped for some reason, it
      // will at least say left/right for the second.
      // Starboard/Larboard Cannon cleanup.
      regex: / 14:326[24]:Omega starts using/,
      delaySeconds: 15,
      run: function(data) {
        delete data.lastWasStarboard;
      },
    },
    {
      id: 'O11S Starboard Cannon 1',
      regex: / 14:326[23]:Omega starts using Starboard/,
      condition: function(data) {
        return data.lastWasStarboard === undefined;
      },
      alertText: {
        en: 'Left',
      },
      run: function(data) {
        data.lastWasStarboard = true;
      },
    },
    {
      id: 'O11S Larboard Cannon 1',
      regex: / 14:326[45]:Omega starts using Larboard/,
      condition: function(data) {
        return data.lastWasStarboard === undefined;
      },
      alertText: {
        en: 'Right',
      },
      run: function(data) {
        data.lastWasStarboard = false;
      },
    },
    {
      id: 'O11S Starboard Cannon 2',
      regex: / 14:3263:Omega starts using Starboard/,
      condition: function(data) {
        return data.lastWasStarboard !== undefined;
      },
      alertText: function(data) {
        if (data.lastWasStarboard) {
          return {
            en: 'Move (Left)',
          };
        }
        return {
          en: 'Stay (Left)',
        };
      },
    },
    {
      id: 'O11S Larboard Cannon 2',
      regex: / 14:3265:Omega starts using Larboard/,
      condition: function(data) {
        return data.lastWasStarboard !== undefined;
      },
      alertText: function(data) {
        if (data.lastWasStarboard) {
          return {
            en: 'Stay (Right)',
          };
        }
        return {
          en: 'Move (Right)',
        };
      },
    },
    {
      id: 'O11S Starboard Surge 1',
      regex: / 14:3266:Omega starts using Starboard/,
      alertText: {
        en: 'Left (then opposite)',
      },
    },
    {
      id: 'O11S Larboard Surge 1',
      regex: / 14:3268:Omega starts using Larboard/,
      alertText: {
        en: 'Right (then opposite)',
      },
    },
    {
      id: 'O11S Starboard Surge 2',
      regex: / 14:3266:Omega starts using Starboard/,
      delaySeconds: 4,
      alertText: {
        en: 'Opposite (Left)',
      },
    },
    {
      id: 'O11S Larboard Surge 2',
      regex: / 14:3268:Omega starts using Larboard/,
      delaySeconds: 4,
      alertText: {
        en: 'Opposite (Right)',
      },
    },
  ],
}];
