Options.Triggers.push({
  id: 'EurekaOrthosFloors11_20',
  zoneId: ZoneId.EurekaOrthosFloors11_20,
  triggers: [
    // ---------------- Floor 11-19 Mobs ----------------
    {
      id: 'EO 11-20 Orthos Sawtooth Mean Thrash',
      type: 'StartsUsing',
      netRegex: { id: '7E93', source: 'Orthos Sawtooth', capture: false },
      response: Responses.goFront(),
    },
    // ---------------- Floor 20 Boss: Cloning Node ----------------
    // intentionally blank
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Orthos Sawtooth': 'Orthos-Sägezahn',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Orthos Sawtooth': 'dentata Orthos',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Orthos Sawtooth': 'オルト・ソウトゥース',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Orthos Sawtooth': '正统锯齿花',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Orthos Sawtooth': '오르토스 톱날이빨',
      },
    },
  ],
});
