Options.Triggers.push({
  id: 'ThePalaceOfTheDeadFloors1_10',
  zoneId: ZoneId.ThePalaceOfTheDeadFloors1_10,
  triggers: [
    // ---------------- Floor 001-009 Mobs ----------------
    // intentionally blank
    // ---------------- Floor 010 Boss: Palace Deathgaze ----------------
    {
      id: 'PotD 001-010 Palace Deathgaze Aero Blast',
      type: 'StartsUsing',
      netRegex: { id: '1914', source: 'Palace Deathgaze', capture: false },
      response: Responses.aoe(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Palace Deathgaze': 'Palast-Thanatos',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Palace Deathgaze': 'mortalis du palais',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Palace Deathgaze': 'パレス・デスゲイズ',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Palace Deathgaze': '地宫死亡凝视',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Palace Deathgaze': '궁전 저승파수꾼',
      },
    },
  ],
});
