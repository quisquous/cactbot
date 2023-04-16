Options.Triggers.push({
  id: 'ThePalaceOfTheDeadFloors161_170',
  zoneId: ZoneId.ThePalaceOfTheDeadFloors161_170,
  triggers: [
    // ---------------- Floor 161-169 Mobs ----------------
    {
      id: 'PotD 161-170 Deep Palace Diplocaulus Mucin',
      // gains Stoneskin (practically immune to damage for 8s)
      type: 'StartsUsing',
      netRegex: { id: '1B66', source: 'Deep Palace Diplocaulus' },
      response: Responses.stunOrInterruptIfPossible(),
    },
    {
      id: 'PotD 161-170 Deep Palace Diplocaulus Foregone Gleam',
      // front cone gaze
      type: 'StartsUsing',
      netRegex: { id: '1B2D', source: 'Deep Palace Diplocaulus', capture: false },
      response: Responses.lookAway('alert'),
    },
    // ---------------- Floor 170 Boss: Yulunggu ----------------
    // intentionally blank
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Deep Palace Diplocaulus': 'Katakomben-Diplocaulus',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Deep Palace Diplocaulus': 'diplocaulus des profondeurs',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Deep Palace Diplocaulus': 'ディープパレス・ディプロカウルス',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Deep Palace Diplocaulus': '深宫笠头螈',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Deep Palace Diplocaulus': '깊은 궁전 디플로카울루스',
      },
    },
  ],
});
