'use strict';

// O12S - Alphascape 4.0 Savage

[{
  zoneRegex: /^Alphascape V4.0 \(Savage\)$/,
  timelineFile: 'o12s.txt',
  triggers: [
    {
      id: 'O12S Beyond Defense',
      regex: / 1[56]:\y{ObjectId}:Omega-M:332C:[^:]*:\y{ObjectId}:(\y{Name}):/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alarmText: {
        en: 'Don\'t Stack!',
      },
    },
    {
      id: 'O12S Local Resonance',
      regex: / 1A:Omega gains the effect of (?:Local Resonance|Unknown_67E) from/,
      infoText: {
        en: 'Keep Bosses Apart',
      },
    },
    {
      id: 'O12S Remote Resonance',
      regex: / 1A:Omega gains the effect of (?:Remote Resonance|Unknown_67F) from/,
      alertText: {
        en: 'Move Bosses Together',
      },
    },
    {
      id: 'O12S Solar Ray',
      regex: / 14:(?:3350|3351):Omega(?:-M)? starts using (?:Unknown_3350|Unknown_3351|Solar Ray) on (\y{Name})/,
      condition: function(data, matches) {
        return data.me == matches[1] || data.role == 'healer';
      },
      suppressSeconds: 1,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tenkbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Tank Busters',
            de: 'Tenkbuster',
            fr: 'Tankbuster',
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
      id: 'O12S Optimized Blade Dance',
      regex: / 14:(?:334B|334C):Omega(?:-M)? starts using (?:Unknown_334B|Unknown_334C|Optimized Blade Dance) on (\y{Name})/,
      condition: function(data, matches) {
        return data.me == matches[1] || data.role == 'healer';
      },
      suppressSeconds: 1,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tenkbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Tank Busters',
            de: 'Tenkbuster',
            fr: 'Tankbuster',
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
      id: 'O12S Electric Slide Marker',
      regex: /1B:........:(\y{Name}):....:....:(009[12345678]):0000:0000:0000:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: function(data, matches) {
        let num = parseInt(matches[2]);
        let isTriangle = num >= 95;
        num -= 90;
        if (isTriangle)
          num -= 4;

        let squareName = {
          en: 'Square',
        }[data.lang];
        let triangleName = {
          en: 'Triangle',
        }[data.lang];
        return '#' + num + ' ' + (isTriangle ? triangleName : squareName);
      },
    },
    {
      id: 'O12S Stack Marker',
      regex: /1B:........:\y{Name}:....:....:003E:0000:0000:0000:/,
      suppressSeconds: 1,
      infoText: {
        en: 'Stack',
      },
    },
    {
      id: 'O12S Optimized Meteor',
      regex: /1B:........:(\y{Name}):....:....:0057:0000:0000:0000:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Meteor on YOU',
      },
    },
    {
      id: 'O12S Packet Filter F',
      regex: / 1A:(\y{Name}) gains the effect of (?:Unknown_67D|Packet Filter F) from/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Attack Omega-M',
      },
    },
    {
      id: 'O12S Packet Filter M',
      regex: / 1A:(\y{Name}) gains the effect of (?:Unknown_67C|Packet Filter M) from/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Attack Omega-F',
      },
    },
  ],
}];
