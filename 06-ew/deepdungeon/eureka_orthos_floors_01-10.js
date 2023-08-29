Options.Triggers.push({
  id: 'EurekaOrthosFloors1_10',
  zoneId: ZoneId.EurekaOrthosFloors1_10,
  triggers: [
    // ---------------- Floor 01-09 Mobs ----------------
    {
      id: 'EO 01-10 Orthos Grenade Big Burst',
      type: 'StartsUsing',
      netRegex: { id: '7E7D', source: 'Orthos Grenade', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'EO 01-10 Orthos Behemoth Wild Horn',
      type: 'StartsUsing',
      netRegex: { id: '7E7C', source: 'Orthos Behemoth' },
      condition: Conditions.targetIsYou(),
      response: Responses.knockback(),
    },
    {
      id: 'EO 01-10 Orthos Fachan Dread Gaze',
      type: 'StartsUsing',
      netRegex: { id: '7E82', source: 'Orthos Fachan', capture: false },
      response: Responses.awayFromFront(),
    },
    // ---------------- Floor 10 Boss: Gancanagh ----------------
    {
      id: 'EO 01-10 Gancanagh Mandrastorm',
      type: 'StartsUsing',
      netRegex: { id: '7AF7', source: 'Gancanagh', capture: false },
      response: Responses.aoe(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Gancanagh': 'Gancanagh',
        'Orthos Behemoth': 'Orthos-Behemoth',
        'Orthos Fachan': 'Orthos-Fachan',
        'Orthos Grenade': 'Orthos-Granate',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Gancanagh': 'Gancanagh',
        'Orthos Behemoth': 'béhémoth Orthos',
        'Orthos Fachan': 'fachan Orthos',
        'Orthos Grenade': 'grenado Orthos',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Gancanagh': 'ガンカナグー',
        'Orthos Behemoth': 'オルト・ベヒーモス',
        'Orthos Fachan': 'オルト・ファハン',
        'Orthos Grenade': 'オルト・グレネード',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Gancanagh': '蜜言妖',
        'Orthos Behemoth': '正统贝希摩斯',
        'Orthos Fachan': '正统幽鬼之眼',
        'Orthos Grenade': '正统榴弹怪',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Gancanagh': '간카나',
        'Orthos Behemoth': '오르토스 베히모스',
        'Orthos Fachan': '오르토스 파한',
        'Orthos Grenade': '오르토스 그레네이드',
      },
    },
  ],
});
