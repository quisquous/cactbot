'use strict';

// Note: no warnings for Sweeping Flames, Tail Sweep, or Roar.

// Rathalos Extreme
[{
  zoneRegex: /^(The Great Hunt \(Extreme\)|Unknown Zone \(2Fa\))$/,
  triggers: [
    {
      id: 'RathEx Mangle',
      regex: / 14:(?:2853|2863):Rathalos starts using/,
      infoText: {
        en: 'Mangle',
        de: 'Biss und Schweifhieb',
      },
    },
    {
      id: 'RathEx Rush',
      regex: / 14:(?:2856|2861):Rathalos starts using/,
      alertText: {
        en: 'Rush',
        de: 'Stürmen',
      },
    },
    {
      id: 'RathEx Flaming Recoil',
      regex: / 14:(?:2859|285B):Rathalos starts using/,
      alarmText: {
        en: 'Flaming Recoil',
        de: 'Flammenschlag vorne',
      },
    },
    {
      id: 'RathEx Fire Breath',
      regex: / 1B:........:(\y{Name}):....:....:0081:0000:0000:0000:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Fire Breath on YOU',
        de: 'Feueratem auf DIR',
      },
    },
    {
      id: 'RathEx Fireball',
      regex: / 1B:........:(\y{Name}):....:....:(?:0084|005D):0000:0000:0000:/,
      alertText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Stack on YOU',
            de: 'Stack auf DIR',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches[1]),
          de: 'Stack auf ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'RathEx Adds',
      regex: /:Added new combatant Steppe Sheep\./,
      regexDe: /:Added new combatant Steppnschaf\./,
      suppressSeconds: 5,
      condition: function(data) {
        return data.role == 'tank';
      },
      infoText: {
        en: 'Adds',
        de: 'Adds',
      },
    },
  ],
}];
