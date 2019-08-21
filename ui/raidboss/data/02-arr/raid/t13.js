'use strict';

[{
  zoneRegex: /The Final Coil Of Bahamut - Turn \(4\)/,
  timelineFile: 't13.txt',
  timelineTriggers: [
    {
      id: 'T13 Dive Warning',
      regex: /Megaflare Dive/,
      beforeSeconds: 5,
      infoText: {
        en: 'Stack Center for Dives',
      },
    },
  ],
  triggers: [
    {
      id: 'T13 Gigaflare Phase Change',
      regex: / 14:BB9:Bahamut Prime starts using Gigaflare/,
      condition: function(data) {
        // Only the first two gigas are phase changes, the rest are in final phase.
        return !(data.gigaflare > 1);
      },
      sound: 'Long',
      infoText: function(data, matches) {
        if (data.gigaflare) {
          return {
            en: 'Stack Center for Dives',
          };
        }
      },
      run: function(data) {
        data.gigaflare = data.gigaflare || 0;
        data.gigaflare++;
      },
    },
    {
      id: 'T13 Flatten',
      regex: / 14:BAE:Bahamut Prime starts using Flatten on (\y{Name})\./,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Flatten on YOU',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches[1] == data.me) {
          return;
          if (data.role == 'healer' || data.job == 'BLU') {}
          return {
            en: 'Flatten on ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'T13 Megaflare Share',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0027:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Megaflare Stack',
      },
    },
    {
      id: 'T13 Earthshaker',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0028:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Earthshaker on YOU',
      },
    },
    {
      id: 'T13 Tempest Wing',
      regex: / 23:\y{ObjectId}:(\y{Name}):\y{ObjectId}:Bahamut Prime:....:....:0004:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Tempest Tether on YOU',
      },
    },
    {
      id: 'T13 Akh Morn',
      regex: / 14:BC2:Bahamut Prime starts using Akh Morn on (\y{Name})\./,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Akh Morn on YOU',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches[1] != data.me) {
          return {
            en: 'Akh Morn on ' + data.ShortName(matches[1]),
          };
        }
      },
    },
  ],
}];
