'use strict';

[{
  zoneRegex: /^Malikah's Well$/,
  timelineFile: 'malikahs_well.txt',
  triggers: [
    {
      id: 'Malikah Stone Flail',
      regex: / 14:3CE5:Greater Armadillo starts using Stone Flail on (\y{Name})/,
      regexDe: / 14:3CE5:Riesengürteltier starts using Steindresche on (\y{Name})/,
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
            de: 'Auf DIR sammeln',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches[1]),
          de: 'Auf ' + data.ShortName(matches[1]) + ' sammeln',
        };
      },
    },
    {
      id: 'Malikah Right Round',
      regex: / 14:3CE7:Greater Armadillo starts using Right Round/,
      regexDe: / 14:3CE7:Riesengürteltier starts using Rotation/,
      infoText: {
        en: 'Melee Knockback',
        de: 'Nahkämpfer Rückstoß',
      },
    },
    {
      id: 'Malikah Deep Draught',
      regex: / 14:4188:Pack Armadillo starts using Deep Draught/,
      regexDe: / 14:4188:Rudel-Gürteltier starts using Immense Infusion/,
      condition: function(data) {
        return data.CanSilence();
      },
      infoText: {
        en: 'Silence Add',
        de: 'Add stummen',
      },
    },
    {
      id: 'Malikah Efface',
      regex: / 14:3CEB:Amphibious Talos starts using Efface on (\y{Name})/,
      regexDe: / 14:3CEB:Wasserträger-Talos starts using Zerstören on (\y{Name})/,
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
      regexDe: / 14:3CEC:Wasserträger-Talos starts using Überdruck/,
      infoText: {
        en: 'Knockback',
        de: 'Rückstoß',
      },
    },
    {
      id: 'Malikah Swift Spill',
      regex: / 14:3CEF:Amphibious Talos starts using Swift Spill/,
      regexDe: / 14:3CEF:Wasserträger-Talos starts using Schneller Abfluss/,
      infoText: {
        en: 'Get Behind',
        de: 'Hinter ihn',
      },
    },
    {
      id: 'Malikah Intestinal Crank',
      regex: / 14:3CEF:Amphibious Talos starts using Swift Spill/,
      regexDe: / 14:3CEF:Wasserträger-Talos starts using Schneller Abfluss/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Terminus': 'Drehscheibe',
        'Greater Armadillo': 'Riesengürteltier',
        'Malikah\'s Gift': 'Malikahs Quelle',
        'Amphibious Talos': 'Wasserträger-Talos',
        'Unquestioned Acceptance': 'Residenz der Großherzigkeit',
        'Storge': 'Storge',
        'Rhapsodic': 'Keil der Liebe',
      },
      'replaceText': {
        'Stone Flail': 'Steindresche',
        'Head Toss': 'Kopfwurf',
        'Right Round': 'Rotation',
        'Flail Smash': 'Dresche',
        'Earthshake': 'Bodenbeber',
        'Efface': 'Zerstören',
        'Wellbore': 'Brunnenbohrer',
        'Geyser Eruption': 'Geysir',
        'High Pressure': 'Überdruck',
        'Swift Spill': 'Schneller Abfluss',
        'Intestinal Crank': 'Geweiderupfer',
        'Heretic\'s Fork': 'Ketzerspieß',
        'Breaking Wheel': 'Radbruch',
        'Crystal Nail': 'Kristallnagel',
        'Censure': 'Tadel',
        'Armadillo': 'Armadillo',
      },
    },
  ],
}];
