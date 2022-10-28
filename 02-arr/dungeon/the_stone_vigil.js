Options.Triggers.push({
  zoneId: ZoneId.TheStoneVigil,
  triggers: [
    {
      id: 'Stone Vigil Swinge',
      type: 'StartsUsing',
      netRegex: { id: '387', source: 'Chudo-Yudo', capture: false },
      response: Responses.awayFromFront(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Chudo-Yudo': 'Chudo-Yudo',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Chudo-Yudo': 'Chudo-Yudo',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Chudo-Yudo': 'チョドーユドー',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Chudo-Yudo': '丘都尤都',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Chudo-Yudo': '추도유도',
      },
    },
  ],
});
