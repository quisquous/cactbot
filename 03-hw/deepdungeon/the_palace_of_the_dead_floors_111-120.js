Options.Triggers.push({
  id: 'ThePalaceOfTheDeadFloors111_120',
  zoneId: ZoneId.ThePalaceOfTheDeadFloors111_120,
  triggers: [
    // ---------------- Floor 111-119 Mobs ----------------
    {
      id: 'PotD 111-120 Deep Palace Salamander Mucin',
      // gains Stoneskin (97)
      type: 'StartsUsing',
      netRegex: { id: '1B66', source: 'Deep Palace Salamander' },
      response: Responses.stunOrInterruptIfPossible(),
    },
    // ---------------- Floor 120 Boss: Kirtimukha ----------------
    {
      id: 'PotD 111-120 Kirtimukha Leafstorm',
      type: 'StartsUsing',
      netRegex: { id: '1BE0', source: 'Kirtimukha', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'PotD 111-120 Kirtimukha Adds Spawn',
      // 5366 = Deep Palace Hornet, use Final Sting 70% max HP enrage attack if not killed fast enough
      type: 'AddedCombatant',
      netRegex: { npcNameId: '5366', capture: false },
      suppressSeconds: 1,
      response: Responses.killAdds('alert'),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Deep Palace Salamander': 'Katakomben-Salamander',
        'Kirtimukha': 'Kirtimukha',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Deep Palace Salamander': 'salamandre des profondeurs',
        'Kirtimukha': 'Kirtimukha',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Deep Palace Salamander': 'ディープパレス・サラマンダー',
        'Kirtimukha': 'キールティムカ',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Deep Palace Salamander': '深宫蝾螈',
        'Kirtimukha': '荣光魔花',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Deep Palace Salamander': '깊은 궁전 불도롱뇽',
        'Kirtimukha': '키르티무카',
      },
    },
  ],
});
