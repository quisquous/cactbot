'use strict';

// Note: no warnings for Sweeping Flames, Tail Sweep, or Roar.

// Rathalos Extreme
[{
  zoneRegex: /^(The Great Hunt \(Extreme\)|Unknown Zone \(2Fa\))$/,
  triggers: [
    {
      id: 'RathEx Mangle',
      regex: / 14:(?:2853|2863):Rathalos starts using Mangle/,
      regexDe: / 14:(?:2853|2863):Rathalos starts using Zerfleischen/,
      regexFr: / 14:(?:2853|2863):Rathalos starts using Broyage/,
      regexJa: / 14:(?:2853|2863):リオレウス starts using アギト/,
      infoText: {
        en: 'Mangle',
        de: 'Biss und Schweifhieb',
      },
    },
    {
      id: 'RathEx Rush',
      regex: / 14:(?:2856|2861):Rathalos starts using Rush/,
      regexDe: / 14:(?:2856|2861):Rathalos starts using Stürmen/,
      regexFr: / 14:(?:2856|2861):Rathalos starts using Ruée/,
      regexJa: / 14:(?:2856|2861):リオレウス starts using 突進/,
      alertText: {
        en: 'Rush',
        de: 'Stürmen',
      },
    },
    {
      id: 'RathEx Flaming Recoil',
      regex: / 14:(?:2859|285B):Rathalos starts using Flaming Recoil/,
      regexDe: / 14:(?:2859|285B):Rathalos starts using Flammenrückstoß/,
      regexFr: / 14:(?:2859|285B):Rathalos starts using Bond Enflammé/,
      regexJa: / 14:(?:2859|285B):リオレウス starts using フレイムリコイル/,
      alarmText: {
        en: 'Flaming Recoil',
        de: 'Flammenschlag vorne',
      },
    },
    {
      id: 'RathEx Fire Breath',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0081:0000:0000:0000:/,
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
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:(?:0084|005D):0000:0000:0000:/,
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
      regex: / 03:\y{ObjectId}:Added new combatant Steppe Sheep\./,
      regexDe: / 03:\y{ObjectId}:Added new combatant Steppenschaf\./,
      regexFr: / 03:\y{ObjectId}:Added new combatant Mouton De La Steppe\./,
      regexJa: / 03:\y{ObjectId}:Added new combatant ステップ・シープ\./,
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
