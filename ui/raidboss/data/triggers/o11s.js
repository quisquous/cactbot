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
      // Starboard/Larboard Cannon cleanup.
      regex: / 14:326[25]:Omega starts using/,
      delaySeconds: 10,
      run: function(data) {
        delete data.lastWasStarboard;
      },
    },
    {
      id: 'O11S Starboard Cannon 2',
      regex: / 14:3262:Omega starts using Starboard/,
      condition: function(data) {
        return data.lastWasStarboard !== undefined;
      },
      alertText: function(data) {
        if (data.lastWasStarboard) {
          return {
            en: 'Opposite (Left)',
          };
        }
        return {
          en: 'Stay (Right)',
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
            en: 'Stay (Left)',
          };
        }
        return {
          en: 'Opposite (Right)',
        };
      },
    },
    {
      id: 'O11S Starboard Cannon 1',
      regex: / 14:3262:Omega starts using Starboard/,
      suppressSeconds: 10,
      alertText: {
        en: 'Left',
      },
      run: function(data) {
        data.lastWasStarboard = true;
      },
    },
    {
      id: 'O11S Larboard Cannon 1',
      regex: / 14:3265:Omega starts using Larboard/,
      suppressSeconds: 10,
      alertText: {
        en: 'Right',
      },
      run: function(data) {
        data.lastWasStarboard = false;
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
  ],
}];
