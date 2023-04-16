// TODO: Sugaar rotating Numbing Noise (46B4) Tail Snap (46B5) + draw-in
Options.Triggers.push({
  id: 'AmhAraeng',
  zoneId: ZoneId.AmhAraeng,
  triggers: [
    {
      id: 'Hunt Mailktender Sabotendance',
      type: 'StartsUsing',
      netRegex: { id: '4663', source: 'Maliktender', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getOut(),
    },
    {
      id: 'Hunt Mailktender 20,000 Needles',
      type: 'StartsUsing',
      netRegex: { id: '4666', source: 'Maliktender', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getBehind('info'),
    },
    {
      id: 'Hunt Mailktender 990,000 Needles',
      type: 'StartsUsing',
      netRegex: { id: '4668', source: 'Maliktender', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getBehind(),
    },
    {
      id: 'Hunt Sugaar Numbing Noise',
      type: 'StartsUsing',
      netRegex: { id: '465F', source: 'Sugaar', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getBehind(),
    },
    {
      id: 'Hunt Sugaar Tail Snap',
      type: 'StartsUsing',
      netRegex: { id: '4660', source: 'Sugaar', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.goFront(),
    },
    {
      id: 'Hunt Sugaar Body Slam',
      type: 'StartsUsing',
      netRegex: { id: '4662', source: 'Sugaar', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.outOfMelee(),
    },
    {
      id: 'Hunt Tarchia Wild Horn',
      type: 'StartsUsing',
      netRegex: { id: '466A', source: 'Tarchia' },
      condition: (data) => data.inCombat,
      response: Responses.tankCleave(),
    },
    {
      id: 'Hunt Tarchia Metamorphic Blast',
      type: 'StartsUsing',
      netRegex: { id: '466F', source: 'Tarchia', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.aoe(),
    },
    {
      id: 'Hunt Tarchia Trounce',
      type: 'StartsUsing',
      netRegex: { id: '466B', source: 'Tarchia', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getBehind('info'),
    },
    {
      id: 'Hunt Tarchia Forest Fire',
      type: 'StartsUsing',
      netRegex: { id: '466E', source: 'Tarchia', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getOut(),
    },
    {
      id: 'Hunt Tarchia Groundstorm',
      type: 'StartsUsing',
      netRegex: { id: '4667', source: 'Tarchia', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getUnder('alert'),
    },
    {
      id: 'Hunt Tarchia Mighty Spin',
      type: 'Ability',
      // Groundstorm is followed up by an untelegraphed/uncasted Mighty Spin.
      netRegex: { id: '4667', source: 'Tarchia', capture: false },
      condition: (data) => data.inCombat,
      suppressSeconds: 1,
      response: Responses.getOut(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Maliktender': 'Malikkaktor',
        'Sugaar': 'Sugaar',
        'Tarchia': 'Tarchia',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Maliktender': 'Malikpampa',
        'Sugaar': 'Sugaar',
        'Tarchia': 'Tarchia',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Maliktender': 'マリクテンダー',
        'Sugaar': 'シュガール',
        'Tarchia': 'タルキア',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Maliktender': '马利克巨人掌',
        'Sugaar': '休格尔',
        'Tarchia': '多智兽',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Maliktender': '말리크텐더',
        'Sugaar': '슈가르',
        'Tarchia': '타르키아',
      },
    },
  ],
});
