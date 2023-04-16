Options.Triggers.push({
  id: 'HaukkeManorHard',
  zoneId: ZoneId.HaukkeManorHard,
  triggers: [
    {
      id: 'Haukke Manor Hard Stoneskin',
      type: 'StartsUsing',
      netRegex: { id: '3F0', source: 'Manor Sentry' },
      condition: (data) => data.CanSilence(),
      response: Responses.interrupt(),
    },
    {
      id: 'Haukke Manor Hard Beguiling Mist',
      type: 'StartsUsing',
      netRegex: { id: '6B7', source: 'Halicarnassus' },
      condition: (data) => data.CanStun(),
      response: Responses.stun(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Halicarnassus': 'Halikarnassos',
        'Manor Sentry': 'Wächter',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Halicarnassus': 'Halicarnasse',
        'Manor Sentry': 'vigile du manoir',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Halicarnassus': 'ハリカルナッソス',
        'Manor Sentry': '御用邸の石像',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Halicarnassus': '哈利卡纳苏斯',
        'Manor Sentry': '庄园的石像',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Halicarnassus': '할리카르나소스',
        'Manor Sentry': '별궁 석상',
      },
    },
  ],
});
