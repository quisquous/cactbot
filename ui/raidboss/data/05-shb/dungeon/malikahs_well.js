'use strict';

[{
  zoneRegex: /^Malikah's Well$/,
  timelineFile: 'malikahs_well.txt',
  triggers: [
    {
      id: 'Malikah Stone Flail',
      regex: / 14:3CE5:Greater Armadillo starts using Stone Flail on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
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
      id: 'Malikah Head Toss Stack',
      regex: /1B:........:(\y{Name}):....:....:003E:/,
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
      id: 'Malikah Right Round',
      regex: / 14:3CE7:Greater Armadillo starts using Right Round/,
      infoText: {
        en: 'Melee Knockback',
      },
    },
    {
      id: 'Malikah Deep Draught',
      regex: / 14:4188:Pack Armadillo starts using Deep Draught/,
      condition: function(data) {
        return data.CanSilence();
      },
      infoText: {
        en: 'Silence Add',
      },
    },
    {
      id: 'Malikah Efface',
      regex: / 14:3CEB:Amphibious Talos starts using Efface on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
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
      id: 'Malikah High Pressure',
      regex: / 14:3CEC:Amphibious Talos starts using High Pressure/,
      infoText: {
        en: 'Knockback',
      },
    },
    {
      id: 'Malikah Swift Spill',
      regex: / 14:3CEF:Amphibious Talos starts using Swift Spill/,
      infoText: {
        en: 'Get Behind',
      },
    },
    {
      id: 'Malikah Intestinal Crank',
      regex: / 14:3CEF:Amphibious Talos starts using Swift Spill/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
      },
    },
  ],
}];
