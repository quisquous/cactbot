'use strict';

[{
  zoneRegex: /^The Final Coil Of Bahamut - Turn \(4\)$/,
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
      regexDe: / 14:BB9:Prim-Bahamut starts using Gigaflare/,
      regexFr: / 14:BB9:Primo-Bahamut starts using Gigabrasier/,
      regexJa: / 14:BB9:バハムート・プライム starts using ギガフレア/,
      condition: function(data) {
        // Only the first two gigas are phase changes, the rest are in final phase.
        return !(data.gigaflare > 1);
      },
      sound: 'Long',
      infoText: function(data) {
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
      regexDe: / 14:BAE:Prim-Bahamut starts using Einebnen on (\y{Name})\./,
      regexFr: / 14:BAE:Primo-Bahamut starts using Compression on (\y{Name})\./,
      regexJa: / 14:BAE:バハムート・プライム starts using フラッテン on (\y{Name})\./,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Flatten on YOU',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches[1] == data.me)
          return;
        if (data.role == 'healer' || data.job == 'BLU') {
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
      regexDe: / 23:\y{ObjectId}:(\y{Name}):\y{ObjectId}:Prim-Bahamut:....:....:0004:/,
      regexFr: / 23:\y{ObjectId}:(\y{Name}):\y{ObjectId}:Primo-Bahamut:....:....:0004:/,
      regexJa: / 23:\y{ObjectId}:(\y{Name}):\y{ObjectId}:バハムート・プライム:....:....:0004:/,
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
      regexDe: / 14:BC2:Prim-Bahamut starts using Akh Morn on (\y{Name})\./,
      regexFr: / 14:BC2:Primo-Bahamut starts using Akh Morn on (\y{Name})\./,
      regexJa: / 14:BC2:バハムート・プライム starts using アク・モーン on (\y{Name})\./,
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
