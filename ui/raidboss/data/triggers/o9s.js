'use strict';

/* O9S - Alphascape 1.0 Savage*/
[{
  zoneRegex: /^Alphascape V1.0 \(Savage\)$/,
  timelineFile: 'o9s.txt',
  timelineTriggers: [
    {
      id: 'O9S TH Spread',
      regex: /\(T\/H\) Stray Flames/,
      beforeSeconds: 4,
      alertText: {
        en: 'spread Tanks Healers',
      },
    }, {
      id: 'O9S DPS Spread',
      regex: /\(DPS\) Stray Flames/,
      beforeSeconds: 4,
      alertText: {
        en: 'spread DPS',
      },
    }, {
      id: 'O9S ALL Spread',
      regex: /\(All\) Stray Flames/,
      beforeSeconds: 4,
      alertText: {
        en: 'spread everyone',
      },
    }, {
      id: 'O9S Look Away Orbs',
      regex: /\(All\) Stray Flames/,
      beforeSeconds: 4,
      alertText: {
        en: 'spread everyone',
      },

    },
  ],
  triggers: [
    {
      id: 'O9S Chaotic Dispersion',
      regex: /:3170:Chaos starts using Chaotic Dispersion on (\y{Name})/,
      alertText: function(data, matches) {
        return {
          en: 'Buster on ' + data.ShortName(matches[1]),
          de: 'Buster auf ' + data.ShortName(matches[1]),
          fr: 'Buster sur ' + data.ShortName(matches[1]),
        };
      },
      tts: function(data, matches) {
        return {
          en: 'Buster on' + data.ShortName(matches[1]) + '',
          de: 'tenkbasta',
          fr: 'tankbuster',
        };
      },
    }, {
      id: 'O9S Longitudinal Implosion',
      regex: /:Chaos starts using Longitudinal Implosion/,
      alertText: function(data) {
        return {
          en: 'Front Back -> Sides',
        };
      },
      tts: function(data) {
        return {
          en: 'avoid Front Back',

        };
      },
    }, {
      id: 'O9S Latitudinal Implosion',
      regex: /:Chaos starts using Latitudinal Implosion/,
      alertText: function(data) {
        return {
          en: 'Sides -> Front Back',
        };
      },
      tts: function(data) {
        return {
          en: 'avoid Sides',

        };
      },
    }, {
      id: 'O9S Damning Edict',
      regex: /14:3171:Chaos starts using Damning Edict on Chaos./,
      alertText: function(data) {
        return {
          en: 'Knockback',
        };
      },
      tts: function(data) {
        return {
          en: 'Knockback',

        };
      },
    }, {
      id: 'O9S Blaze',
      regex: /:3186:Chaos starts using Blaze/,
      alertText: function(data) {
        return {
          en: 'AoE',
        };
      },
      tts: function(data) {
        return {
          en: 'AoE',
        };
      },
    }, {
      id: 'O9S Accretion',
      regex: /:(\y{Name}) suffers the effect of Accretion/,
      suppressSeconds: 10,
      alertText: function(data) {
        return {
          en: 'T/H Full HP, DPS Die',
        };
      },
      tts: function(data) {
        return {
          en: 'Cap HP Tanks Healers, DPS die',
        };
      },
    }, {
      id: 'O9S Orbs Fiend',
      regex: /14:317D:Chaos starts using Fiendish Orbs on Chaos./,
      alertText: function(data) {
        return {
          en: 'Orbs',
        };
      },
      tts: function(data) {
        return {
          en: 'Tanks get orbs',
        };
      },
    },
  ],
}];
