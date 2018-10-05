'use strict';

// O12N - Alphascape 4.0 Savage
[{
  zoneRegex: /^(Alphascape \(V4.0\)|Alphascape V4.0)$/,
  timelineFile: 'o12n.txt',
  timelineTriggers: [
    {
      id: 'O12N Knockback',
      regex: /Discharger/,
      beforeSeconds: 5,
      alertText: {
        en: 'Knockback',
      },
    },
  ],
  triggers: [
    {
      id: 'O12N Solar Ray',
      regex: / 14:(?:330F|3310):Omega(?:-M)? starts using (?:Unknown_330F|Unknown_3310|Solar Ray) on (\y{Name})/,
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
      id: 'O12N Optimized Blade Dance',
      regex: / 14:(?:3321|3322):Omega(?:-M)? starts using (?:Unknown_3321|Unknown_3322|Optimized Blade Dance) on (\y{Name})/,
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
      id: 'O12N Local Resonance',
      regex: / 1A:Omega gains the effect of (?:Unknown_67E|Local Resonance) from/,
      condition: function(data) {
        return data.role == 'tank';
      },
      alertText: {
        en: 'Move bosses apart',
      },
    },
    {
      id: 'O12N Optimized Meteor',
      regex: /1B:........:(\y{Name}):....:....:0057:0000:0000:0000:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Meteor on YOU',
      },
    },
    {
      id: 'O12N Stack Spread Markers',
      regex: /1B:........:(\y{Name}):....:....:008B:0000:0000:0000:/,
      alertText: function(data, matches) {
        if (data.me != matches[1])
          return;
        return {
          en: 'Get Out',
        };
      },
      infoText: function(data, matches) {
        if (data.me == matches[1])
          return;
        return {
          en: 'Stack',
        };
      },
    },
    {
      id: 'O12N Packet Filter F',
      regex: / 1A:(\y{Name}) gains the effect of (?:Unknown_67D|Packet Filter F) from/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Attack Omega-M',
      },
    },
    {
      id: 'O12N Packet Filter M',
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
