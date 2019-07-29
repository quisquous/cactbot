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
      },
    },
  ],
  triggers: [
    {
      id: 'Dohn Mheg Watering Wheel',
      // TODO: double check this with an import, is there a The??
      regex: / 14:3DAA:Dohnfast Fuath starts using Watering Wheel/,
      condition: function(data) {
        return data.CanSilence();
      },
      alertText: {
        en: 'Silence Fuath',
      },
    },
    {
      id: 'Dohn Mheg Straight Punch',
      // TODO: double check this with an import, is there a The??
      regex: / 14:3DAB:Dohnfast [bB]asket starts using Straight Punch/,
      condition: function(data) {
        return data.CanStun();
      },
      infoText: {
        en: 'Stun Basket',
      },
    },
    {
      id: 'Dohn Mheg Proboscis',
      // TODO: double check this with an import, is there a The??
      regex: / 14:3DAF:Dohnfast Etainmoth starts using Proboscis/,
      condition: function(data) {
        return data.CanStun();
      },
      infoText: {
        en: 'Stun Moth',
      },
    },
    {
      id: 'Dohn Mheg Torpedo',
      // TODO: double check this with an import, is there a The??
      regex: / 14:3DB5:Dohnfast Kelpie starts using Torpedo/,
      condition: function(data) {
        return data.CanStun();
      },
      infoText: {
        en: 'Stun Kelpie',
      },
    },
    {
      id: 'Dohn Mheg Candy Cane',
      regex: / 14:2299:Aenc Thon, Lord of the Lingering Gaze starts using Candy Cane on (\y{Name})/,
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
      regex: / 14:1E8E:Aenc Thon, Lord of the Lingering Gaze starts using Landsblood/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
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
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
      },
    },
    {
      id: 'Dohn Mheg Crippling Blow',
      regex: / 14:35A4:Aenc Thon, Lord of the Lengthsome Gait starts using Crippling Blow on (\y{Name})/,
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
      regex: / 14:34F0:Aenc Thon, Lord of the Lengthsome Gait starts using Imp Choir/,
      alertText: {
        en: 'Look Away',
      },
    },
    {
      id: 'Dohn Mheg Toad Choir',
      regex: / 14:34EF:Aenc Thon, Lord of the Lengthsome Gait starts using Toad Choir/,
      alertText: {
        en: 'Out of Front',
      },
    },
    {
      id: 'Dohn Mheg Virtuosic Cappriccio',
      regex: / 14:358C:Aenc Thon, Lord of the Lengthsome Gait starts using Virtuosic Capriccio/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
      },
    },
  ],
}];
