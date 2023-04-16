Options.Triggers.push({
  id: 'TheLimitlessBlueExtreme',
  zoneId: ZoneId.TheLimitlessBlueExtreme,
  triggers: [
    {
      id: 'Bismarck Sharp Gust',
      type: 'StartsUsing',
      netRegex: { id: 'FAF', source: 'Bismarck', capture: false },
      response: Responses.knockback(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Bismarck': 'Bismarck',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Bismarck': 'Bismarck',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Bismarck': 'ビスマルク',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Bismarck': '俾斯麦',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Bismarck': '비스마르크',
      },
    },
  ],
});
