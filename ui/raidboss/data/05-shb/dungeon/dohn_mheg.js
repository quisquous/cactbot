'use strict';

[{
  zoneRegex: /^Dohn Mheg$/,
  timelineFile: 'dohn_mheg.txt',
  timelineTriggers: [
    {
      id: 'Dohn Mheg Rake',
      regex: /Rake/,
      beforeSeconds: 5,
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      infoText: {
        en: 'Mini Buster',
        de: 'Kleiner TankbBuster',
      },
    },
  ],
  triggers: [
    {
      id: 'Dohn Mheg Watering Wheel',
      // TODO: double check this with an import, is there a The??
      regex: / 14:3DAA:Dohnfast Fuath starts using Watering Wheel/,
      regexDe: / 14:3DAA:Dohn-Fuath starts using Wasserrad/,
      condition: function(data) {
        return data.CanSilence();
      },
      alertText: {
        en: 'Silence Fuath',
        de: 'Stumme Dohn-Fuath',
      },
    },
    {
      id: 'Dohn Mheg Straight Punch',
      // TODO: double check this with an import, is there a The??
      regex: / 14:3DAB:Dohnfast [bB]asket starts using Straight Punch/,
      regexDe: / 14:3DAB:Dohn-Blumenkorb starts using Gerade/,
      condition: function(data) {
        return data.CanStun();
      },
      infoText: {
        en: 'Stun Basket',
        de: 'Unterbreche Dohn-Blumenkorb',
      },
    },
    {
      id: 'Dohn Mheg Proboscis',
      // TODO: double check this with an import, is there a The??
      regex: / 14:3DAF:Dohnfast Etainmoth starts using Proboscis/,
      regexDe: / 14:3DAF:Dohn-Edianmotte starts using Rüssel/,
      condition: function(data) {
        return data.CanStun();
      },
      infoText: {
        en: 'Stun Moth',
        de: 'Unterbreche Dohn-Edianmotte',
      },
    },
    {
      id: 'Dohn Mheg Torpedo',
      // TODO: double check this with an import, is there a The??
      regex: / 14:3DB5:Dohnfast Kelpie starts using Torpedo/,
      regexDe: / 14:3DB5:Dohn-Kelpie starts using Torpedo/,
      condition: function(data) {
        return data.CanStun();
      },
      infoText: {
        en: 'Stun Kelpie',
        de: 'Unterbreche Dohn-Kelpie',
      },
    },
    {
      id: 'Dohn Mheg Candy Cane',
      regex: / 14:2299:Aenc Thon, Lord [Oo]f [Tt]he Lingering Gaze starts using Candy Cane on (\y{Name})/,
      regexDe: / 14:2299:Aenc Thon der Glupschäugige starts using Quietschehammer on (\y{Name})/,
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
      id: 'Dohn Mheg Landsblood',
      regex: / 14:1E8E:Aenc Thon, Lord [Oo]f [Tt]he Lingering Gaze starts using Landsblood/,
      regexDe: / 14:1E8E:Aenc Thon der Glupschäugige starts using Erdblut/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
      },
    },
    {
      id: 'Dohn Mheg Leap Stack',
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
      id: 'Dohn Mheg Timber',
      regex: / 14:22D3:Griaule starts using Tiiimbeeer/,
      regexDe: / 14:22D3:Griaule starts using Fääällt/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
      },
    },
    {
      id: 'Dohn Mheg Crippling Blow',
      regex: / 14:35A4:Aenc Thon, Lord [Oo]f [Tt]he Lengthsome Gait starts using Crippling Blow on (\y{Name})/,
      regexDe: / 14:35A4:Aenc Thon der Langbeinige starts using Verkrüppelnder Schlag on (\y{Name})/,
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
      id: 'Dohn Mheg Imp Choir',
      regex: / 14:34F0:Aenc Thon, Lord [Oo]f [Tt]he Lengthsome Gait starts using Imp Choir/,
      regexDe: / 14:34F0:Aenc Thon der Langbeinige starts using Koboldchor/,
      alertText: {
        en: 'Look Away',
        de: 'Weg schauen',
      },
    },
    {
      id: 'Dohn Mheg Toad Choir',
      regex: / 14:34EF:Aenc Thon, Lord [Oo]f [Tt]he Lengthsome Gait starts using Toad Choir/,
      regexDe: / 14:34EF:Aenc Thon der Langbeinige starts using Froschchor/,
      alertText: {
        en: 'Out of Front',
        de: 'Weg von vorne',
      },
    },
    {
      id: 'Dohn Mheg Virtuosic Cappriccio',
      regex: / 14:358C:Aenc Thon, Lord [Oo]f [Tt]he Lengthsome Gait starts using Virtuosic Capriccio/,
      regexDe: / 14:358C:Aenc Thon der Langbeinige starts using Virtuoses Capriccio/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
      },
    },
  ],
}];
