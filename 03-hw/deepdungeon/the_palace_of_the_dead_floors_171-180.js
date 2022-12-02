Options.Triggers.push({
  zoneId: ZoneId.ThePalaceOfTheDeadFloors171_180,
  triggers: [
    // ---------------- Floor 171-179 Mobs ----------------
    {
      id: 'PotD 171-180 Deep Palace Snowclops Glower',
      // untelegraphed front line AoE
      type: 'StartsUsing',
      netRegex: { id: '1B95', source: 'Deep Palace Snowclops', capture: false },
      response: Responses.awayFromFront(),
    },
    {
      id: 'PotD 171-180 Bird of the Deep Palace Tropical Wind',
      // gains Haste and Attack Boost
      type: 'StartsUsing',
      netRegex: { id: '1B94', source: 'Bird of the Deep Palace' },
      response: Responses.interruptIfPossible(),
    },
    // ---------------- Floor 180 Boss: Dendainsonne ----------------
    // intentionally blank
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Bird of the Deep Palace': 'Katakombenvogel',
        'Deep Palace Snowclops': 'Katakomben-Schneezyklop',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Bird of the Deep Palace': 'oiseau des profondeurs',
        'Deep Palace Snowclops': 'chionope des profondeurs',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Bird of the Deep Palace': 'バード・オブ・ディープパレス',
        'Deep Palace Snowclops': 'ディープパレス・スノウクロプス',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Bird of the Deep Palace': '深宫妖鸟',
        'Deep Palace Snowclops': '深宫独眼雪巨人',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Bird of the Deep Palace': '깊은 궁전 새',
        'Deep Palace Snowclops': '깊은 궁전 눈보라 사이클롭스',
      },
    },
  ],
});
