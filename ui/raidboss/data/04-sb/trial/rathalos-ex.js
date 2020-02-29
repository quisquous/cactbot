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
      regex: Regexes.startsUsing({ id: ['2853', '2863'], source: 'Rathalos', capture: false }),
      regexDe: Regexes.startsUsing({ id: ['2853', '2863'], source: 'Rathalos', capture: false }),
      regexFr: Regexes.startsUsing({ id: ['2853', '2863'], source: 'Rathalos', capture: false }),
      regexJa: Regexes.startsUsing({ id: ['2853', '2863'], source: 'リオレウス', capture: false }),
      regexCn: Regexes.startsUsing({ id: ['2853', '2863'], source: '火龙', capture: false }),
      regexKo: Regexes.startsUsing({ id: ['2853', '2863'], source: '리오레우스', capture: false }),
      infoText: {
        en: 'Mangle',
        de: 'Biss und Schweifhieb',
        ko: '으깨기',
      },
    },
    {
      id: 'RathEx Rush',
      regex: Regexes.startsUsing({ id: ['2856', '2861'], source: 'Rathalos', capture: false }),
      regexDe: Regexes.startsUsing({ id: ['2856', '2861'], source: 'Rathalos', capture: false }),
      regexFr: Regexes.startsUsing({ id: ['2856', '2861'], source: 'Rathalos', capture: false }),
      regexJa: Regexes.startsUsing({ id: ['2856', '2861'], source: 'リオレウス', capture: false }),
      regexCn: Regexes.startsUsing({ id: ['2856', '2861'], source: '火龙', capture: false }),
      regexKo: Regexes.startsUsing({ id: ['2856', '2861'], source: '리오레우스', capture: false }),
      alertText: {
        en: 'Rush',
        de: 'Stürmen',
        ko: '돌진',
      },
    },
    {
      id: 'RathEx Flaming Recoil',
      regex: Regexes.startsUsing({ id: ['2859', '285B'], source: 'Rathalos', capture: false }),
      regexDe: Regexes.startsUsing({ id: ['2859', '285B'], source: 'Rathalos', capture: false }),
      regexFr: Regexes.startsUsing({ id: ['2859', '285B'], source: 'Rathalos', capture: false }),
      regexJa: Regexes.startsUsing({ id: ['2859', '285B'], source: 'リオレウス', capture: false }),
      regexCn: Regexes.startsUsing({ id: ['2859', '285B'], source: '火龙', capture: false }),
      regexKo: Regexes.startsUsing({ id: ['2859', '285B'], source: '리오레우스', capture: false }),
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
      response: Responses.stackOn(),
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
      response: Responses.killAdds(),
    },
  ],
}];
