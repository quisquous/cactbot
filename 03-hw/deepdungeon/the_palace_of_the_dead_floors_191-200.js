Options.Triggers.push({
  id: 'ThePalaceOfTheDeadFloors191_200',
  zoneId: ZoneId.ThePalaceOfTheDeadFloors191_200,
  triggers: [
    // ---------------- Floor 191-199 Mobs ----------------
    {
      id: 'PotD 191-200 Deep Palace Wraith Scream',
      // inflicts Terror (42)
      // same as Floors 141-150
      type: 'StartsUsing',
      netRegex: { id: '190A', source: 'Deep Palace Wraith' },
      response: Responses.stunOrInterruptIfPossible(),
    },
    {
      id: 'PotD 191-200 Onyx Dragon Evil Eye',
      // gaze, inflicts Terror (42), combos with Miasma Breath (1B82)
      // same as Floors 141-150
      type: 'StartsUsing',
      netRegex: { id: '1B83', source: 'Onyx Dragon', capture: false },
      response: Responses.lookAway('alert'),
    },
    {
      id: 'PotD 191-200 Deep Palace Fachan Level 5 Death',
      // untelegraphed cone AoE that causes instant death
      type: 'StartsUsing',
      netRegex: { id: '1BAC', source: 'Deep Palace Fachan', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'PotD 191-200 Deep Palace Knight Death Spiral',
      // donut AoE
      type: 'StartsUsing',
      netRegex: { id: '1BAA', source: 'Deep Palace Knight', capture: false },
      response: Responses.getIn(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Deep Palace Fachan': 'Katakomben-Fachan',
        'Deep Palace Knight': 'Katakomben-Ritter',
        'Deep Palace Wraith': 'Katakomben-Geist',
        'Onyx Dragon': 'Onyxdrache',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Deep Palace Fachan': 'fachan des profondeurs',
        'Deep Palace Knight': 'chevalier des profondeurs',
        'Deep Palace Wraith': 'spectre des profondeurs',
        'Onyx Dragon': 'dragon d\'onyx',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Deep Palace Fachan': 'ディープパレス・ファハン',
        'Deep Palace Knight': 'ディープパレス・ナイト',
        'Deep Palace Wraith': 'ディープパレス・レイス',
        'Onyx Dragon': 'オニキスドラゴン',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Deep Palace Fachan': '深宫幽鬼之眼',
        'Deep Palace Knight': '深宫骑士',
        'Deep Palace Wraith': '深宫幽灵',
        'Onyx Dragon': '奥尼克斯龙',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Deep Palace Fachan': '깊은 궁전 파한',
        'Deep Palace Knight': '깊은 궁전 기사',
        'Deep Palace Wraith': '깊은 궁전 망령',
        'Onyx Dragon': '줄마노 드래곤',
      },
    },
  ],
});
