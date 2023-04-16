Options.Triggers.push({
  id: 'ThePalaceOfTheDeadFloors71_80',
  zoneId: ZoneId.ThePalaceOfTheDeadFloors71_80,
  triggers: [
    // ---------------- Floor 071-079 Mobs ----------------
    {
      id: 'PotD 071-080 Palace Cyclops Eye of the Beholder',
      // untelegraphed front cone AoE
      type: 'StartsUsing',
      netRegex: { id: '1B3C', source: 'Palace Cyclops', capture: false },
      response: Responses.awayFromFront(),
    },
    // ---------------- Floor 080 Boss: Gudanna ----------------
    {
      id: 'PotD 071-080 Gudanna Ecliptic Meteor',
      // 80% max HP damage
      type: 'StartsUsing',
      netRegex: { id: '1BBB', source: 'Gudanna' },
      delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 4,
      response: Responses.bigAoe('alert'),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Gudanna': 'Gudanna',
        'Palace Cyclops': 'Palast-Zyklop',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Gudanna': 'Gudanna',
        'Palace Cyclops': 'cyclope du palais',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Gudanna': 'グアンナ',
        'Palace Cyclops': 'パレス・サイクロプス',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Gudanna': '古丹纳',
        'Palace Cyclops': '地宫独眼巨人',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Gudanna': '구단나',
        'Palace Cyclops': '궁전 사이클롭스',
      },
    },
  ],
});
