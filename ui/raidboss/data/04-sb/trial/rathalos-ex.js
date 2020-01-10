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
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0081:0000:0000:0000:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Fire Breath on YOU',
        de: 'Feueratem auf DIR',
        ko: '화염 숨결 대상자',
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
            ko: '쉐어징 대상자',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches[1]),
          de: 'Stack auf ' + data.ShortName(matches[1]),
          ko: '쉐어징 "' + data.ShortName(matches[1]) + '"',
        };
      },
    },
    {
      id: 'RathEx Adds',
      regex: Regexes.addedCombatant({ name: 'Steppe Sheep', capture: false }),
      regexDe: Regexes.addedCombatant({ name: 'Steppenschaf', capture: false }),
      regexFr: Regexes.addedCombatant({ name: 'Mouton De La Steppe', capture: false }),
      regexJa: Regexes.addedCombatant({ name: 'ステップ・シープ', capture: false }),
      regexCn: Regexes.addedCombatant({ name: '草原绵羊', capture: false }),
      regexKo: Regexes.addedCombatant({ name: '초원 양', capture: false }),
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
