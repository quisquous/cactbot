'use strict';

// Note: no warnings for Sweeping Flames, Tail Sweep, or Roar.

// Rathalos Extreme
[{
  zoneRegex: {
    en: /^The Great Hunt \(Extreme\)$/,
    ko: /^극 리오레우스 수렵전$/,
  },
  triggers: [
    {
      id: 'RathEx Mangle',
      regex: / 14:(?:2853|2863):Rathalos starts using Mangle/,
      regexDe: / 14:(?:2853|2863):Rathalos starts using Zerfleischen/,
      regexFr: / 14:(?:2853|2863):Rathalos starts using Broyage/,
      regexJa: / 14:(?:2853|2863):リオレウス starts using アギト/,
      regexKo: / 14:(?:2853|2863):리오레우스 starts using 으깨기/,
      infoText: {
        en: 'Mangle',
        de: 'Biss und Schweifhieb',
        ko: '으깨기',
      },
    },
    {
      id: 'RathEx Rush',
      regex: / 14:(?:2856|2861):Rathalos starts using Rush/,
      regexDe: / 14:(?:2856|2861):Rathalos starts using Stürmen/,
      regexFr: / 14:(?:2856|2861):Rathalos starts using Ruée/,
      regexJa: / 14:(?:2856|2861):リオレウス starts using 突進/,
      regexKo: / 14:(?:2856|2861):리오레우스 starts using 돌진/,
      alertText: {
        en: 'Rush',
        de: 'Stürmen',
        ko: '돌진',
      },
    },
    {
      id: 'RathEx Flaming Recoil',
      regex: / 14:(?:2859|285B):Rathalos starts using Flaming Recoil/,
      regexDe: / 14:(?:2859|285B):Rathalos starts using Flammenrückstoß/,
      regexFr: / 14:(?:2859|285B):Rathalos starts using Bond Enflammé/,
      regexJa: / 14:(?:2859|285B):リオレウス starts using フレイムリコイル/,
      regexKo: / 14:(?:2859|285B):리오레우스 starts using 반동 화염/,
      alarmText: {
        en: 'Flaming Recoil',
        de: 'Flammenschlag vorne',
        ko: '반동 화염',
      },
    },
    {
      id: 'RathEx Fire Breath',
      regex: Regexes.headMarker({ id: '0081' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Fire Breath on YOU',
        de: 'Feueratem auf DIR',
        ko: '화염 숨결 대상자',
      },
    },
    {
      id: 'RathEx Fireball',
      regex: Regexes.headMarker({ id: ['0084', '005D'] }),
      alertText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Stack on YOU',
            de: 'Stack auf DIR',
            ko: '쉐어징 대상자',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches.target),
          de: 'Stack auf ' + data.ShortName(matches.target),
          ko: '쉐어징 "' + data.ShortName(matches.target) + '"',
        };
      },
    },
    {
      id: 'RathEx Adds',
      regex: / 03:\y{ObjectId}:Added new combatant Steppe Sheep\./,
      regexDe: / 03:\y{ObjectId}:Added new combatant Steppenschaf\./,
      regexFr: / 03:\y{ObjectId}:Added new combatant Mouton De La Steppe\./,
      regexJa: / 03:\y{ObjectId}:Added new combatant ステップ・シープ\./,
      regexKo: / 03:\y{ObjectId}:Added new combatant 초원 양\./,
      suppressSeconds: 5,
      condition: function(data) {
        return data.role == 'tank';
      },
      infoText: {
        en: 'Adds',
        de: 'Adds',
        ko: '쫄',
      },
    },
  ],
}];
