'use strict';

[{
  zoneRegex: /^Eden's Gate: Inundation$/,
  timelineFile: 'e3n.txt',
  triggers: [
    {
      id: 'E3N Tidal Roar',
      regex: / 14:3FC4:Leviathan starts using Tidal Roar/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
      },
    },
    {
      id: 'E3N Rip Current',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0017:/,
      alertText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tankbuster auf ' + data.ShortName(matches[1]),
            fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'E3N Tidal Wave',
      regex: / 14:3FD2:Leviathan starts using Tidal Wave/,
      // 3 seconds of cast, 10 seconds of delay.
      // This gives a warning within 5 seconds, so you can hit arm's length.
      delaySeconds: 8,
      infoText: {
        en: 'Knockback',
      },
    },
    {
      id: 'E3N Undersea Quake Outside',
      regex: / 14:3FD0:Leviathan starts using Undersea Quake/,
      alertText: {
        en: 'Get Middle',
      },
    },
    {
      id: 'E3N Undersea Quake Outside',
      regex: / 14:3FCF:Leviathan starts using Undersea Quake/,
      alertText: {
        en: 'Go To Sides',
      },
    },
    {
      id: 'E3N Maelstrom',
      regex: / 14:3FD8:Leviathan starts using Maelstrom/,
      infoText: {
        en: 'Avoid Puddles and Dives',
      },
    },
    {
      id: 'E3N Drenching Pulse Spread',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00A9:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Spread',
      },
    },
    {
      id: 'E3N Tsunami',
      regex: / 14:3FD4:Leviathan starts using Tsunami/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
      },
    },
    {
      // Crashing Pulse and Smothering Waters
      id: 'E3N Stack',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:003E:/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Stack on YOU',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'E3N Surging Waters Marker',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00AD:/,
      infoText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Knockback on YOU',
          };
        }
        return {
          en: 'Knockback on ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'E3N Splashing Waters Spread',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0082:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Spread',
      },
    },
    {
      id: 'E3N Swirling Waters Donut',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0099:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Donut on YOU',
      },
    },
  ],
}];
