Options.Triggers.push({
  zoneId: ZoneId.Snowcloak,
  triggers: [
    {
      id: 'Snowcloak Lunar Cry',
      type: 'StartsUsing',
      netRegex: { id: 'C1F', source: 'Fenrir', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Hide behind Ice',
          de: 'Hinter dem Eis verstecken',
          fr: 'Cachez vous derrière un pilier de glace',
          cn: '躲在冰柱后',
          ko: '얼음 뒤에 숨기',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Fenrir': 'Fenrir',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Fenrir': 'Fenrir',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Fenrir': 'フェンリル',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Fenrir': '芬里尔',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Fenrir': '펜리르',
      },
    },
  ],
});
