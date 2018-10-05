'use strict';

// O9N - Alphascape 1.0
[{
  zoneRegex: /^(Alphascape \(V1.0\)|Alphascape V1.0)$/,
  timelineFile: 'o9n.txt',
  triggers: [
    {
      id: 'O9N Chaotic Dispersion',
      regex: / 14:314F:Chaos starts using Chaotic Dispersion on (\y{Name})/,
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
      id: 'O9N Orbs Fiend',
      regex: /14:315C:Chaos starts using Fiendish Orbs/,
      condition: function(data) {
        return data.role == 'tank';
      },
      alarmText: function(data) {
        return {
          en: 'Orb Tethers',
        };
      },
    },
  ],
}];
