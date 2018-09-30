'use strict';

// O11N - Alphascape 3.0 Savage
[{
  zoneRegex: /^(Alphascape \(V3.0\)|Alphascape V3.0)$/,
  timelineFile: 'o11n.txt',
  timelineTriggers: [
    {
      id: 'O11N Blaster',
      regex: /Blaster/,
      beforeSeconds: 3,
      condition: function(data) {
        return data.role == 'tank';
      },
      infoText: {
        en: 'Tank Tether',
      },
    },
  ],
  triggers: [
    {
      id: 'O11N Mustard Bomb',
      regex: / 14:3287:Omega starts using Mustard Bomb on (\y{Name})/,
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
      // Starboard 1: 3281
      // Starboard 2: 3282
      // Larboard 1: 3283
      // Larboard 2: 3284
      // For the cannons, match #1 and #2 for the first one.  This is so
      // that if a log entry for the first is dropped for some reason, it
      // will at least say left/right for the second.
      // Starboard/Larboard Cannon cleanup.
      regex: / 14:328[13]:Omega starts using/,
      delaySeconds: 15,
      run: function(data) {
        delete data.lastWasStarboard;
      },
    },
    {
      id: 'O11N Starboard Cannon 1',
      regex: / 14:328[12]:Omega starts using Starboard/,
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
      id: 'O11N Larboard Cannon 1',
      regex: / 14:328[34]:Omega starts using Larboard/,
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
      id: 'O11N Starboard Cannon 2',
      regex: / 14:3282:Omega starts using Starboard/,
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
      id: 'O11N Larboard Cannon 2',
      regex: / 14:3284:Omega starts using Larboard/,
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
  ],
}];
