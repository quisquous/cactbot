Options.Triggers.push({
  id: 'TheSunkenTempleOfQarnHard',
  zoneId: ZoneId.TheSunkenTempleOfQarnHard,
  triggers: [
    {
      id: 'Sunken Quarn Hard Light of Anathema',
      type: 'StartsUsing',
      netRegex: { id: 'C26', source: 'Vicegerent to the Warden', capture: false },
      response: Responses.awayFromFront(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Vicegerent to the Warden': 'Statthalter der Aufseherin',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Vicegerent to the Warden': 'adjoint de la Gardienne',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Vicegerent to the Warden': 'アーゼマヴァイスジェレント',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Vicegerent to the Warden': '审理神代言者',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Vicegerent to the Warden': '아제마 교황',
      },
    },
  ],
});
