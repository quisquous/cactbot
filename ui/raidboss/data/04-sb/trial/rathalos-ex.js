'use strict';

// Note: no warnings for Sweeping Flames, Tail Sweep, or Roar.

// Rathalos Extreme
[{
  zoneId: ZoneId.TheGreatHuntExtreme,
  triggers: [
    {
      id: 'RathEx Mangle',
      netRegex: NetRegexes.startsUsing({ id: ['2853', '2863'], source: 'Rathalos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['2853', '2863'], source: 'Rathalos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['2853', '2863'], source: 'Rathalos', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['2853', '2863'], source: 'リオレウス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: ['2853', '2863'], source: '火龙', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: ['2853', '2863'], source: '리오레우스', capture: false }),
      infoText: {
        en: 'Mangle',
        de: 'Biss und Schweifhieb',
        fr: 'Broyage',
        ja: 'アギト',
        ko: '으깨기',
        cn: '去侧面',
      },
    },
    {
      id: 'RathEx Rush',
      netRegex: NetRegexes.startsUsing({ id: ['2856', '2861'], source: 'Rathalos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['2856', '2861'], source: 'Rathalos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['2856', '2861'], source: 'Rathalos', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['2856', '2861'], source: 'リオレウス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: ['2856', '2861'], source: '火龙', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: ['2856', '2861'], source: '리오레우스', capture: false }),
      alertText: {
        en: 'Rush',
        de: 'Stürmen',
        fr: 'Ruée',
        ja: '突進',
        ko: '돌진',
        cn: '龙车',
      },
    },
    {
      id: 'RathEx Flaming Recoil',
      netRegex: NetRegexes.startsUsing({ id: ['2859', '285B'], source: 'Rathalos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['2859', '285B'], source: 'Rathalos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['2859', '285B'], source: 'Rathalos', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['2859', '285B'], source: 'リオレウス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: ['2859', '285B'], source: '火龙', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: ['2859', '285B'], source: '리오레우스', capture: false }),
      alarmText: {
        en: 'Flaming Recoil',
        de: 'Flammenschlag vorne',
        fr: 'Bond enflammé',
        ja: 'フレイムリコイル',
        ko: '반동 화염',
        cn: '去背面',
      },
    },
    {
      id: 'RathEx Fire Breath',
      netRegex: NetRegexes.headMarker({ id: '0081' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Fire Breath on YOU',
        de: 'Feueratem auf DIR',
        fr: 'Souffle enflammé sur VOUS',
        ja: '自分にファイアブレス',
        ko: '화염 숨결 대상자',
        cn: '火点名',
      },
    },
    {
      id: 'RathEx Fireball',
      netRegex: NetRegexes.headMarker({ id: ['0084', '005D'] }),
      response: Responses.stackOn(),
    },
    {
      id: 'RathEx Adds',
      netRegex: NetRegexes.addedCombatant({ name: 'Steppe Sheep', capture: false }),
      netRegexDe: NetRegexes.addedCombatant({ name: 'Steppenschaf', capture: false }),
      netRegexFr: NetRegexes.addedCombatant({ name: 'Mouton De La Steppe', capture: false }),
      netRegexJa: NetRegexes.addedCombatant({ name: 'ステップ・シープ', capture: false }),
      netRegexCn: NetRegexes.addedCombatant({ name: '草原绵羊', capture: false }),
      netRegexKo: NetRegexes.addedCombatant({ name: '초원 양', capture: false }),
      condition: function(data) {
        return data.role == 'tank';
      },
      suppressSeconds: 5,
      response: Responses.killAdds(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Rathalos': 'Rathalos',
        'Steppe Sheep': 'Steppenschaf',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Rathalos': 'Rathalos',
        'Steppe Sheep': 'mouton de la steppe',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Rathalos': 'リオレウス',
        'Steppe Sheep': 'ステップ・シープ',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Rathalos': '火龙',
        'Steppe Sheep': '草原绵羊',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Rathalos': '리오레우스',
        'Steppe Sheep': '초원 양',
      },
    },
  ],
}];
