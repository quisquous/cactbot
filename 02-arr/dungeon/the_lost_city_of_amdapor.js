Options.Triggers.push({
  zoneId: ZoneId.TheLostCityOfAmdapor,
  triggers: [
    {
      id: 'Lost City Amdapor Devour',
      type: 'Ability',
      netRegex: { id: '736', source: 'Chudo-Yudo', capture: false },
      response: Responses.killAdds(),
    },
    {
      id: 'Lost City Amdapor Graviball',
      type: 'StartsUsing',
      netRegex: { id: '762', source: 'Diabolos' },
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Drop Puddle Outside',
          de: 'Fläche draußen ablegen',
          cn: '远离放置圈圈',
          ko: '바깥쪽으로 장판 유도하기',
        },
      },
    },
    {
      id: 'Lost City Amdapor Ultimate Terror',
      type: 'StartsUsing',
      netRegex: { id: '766', source: 'Diabolos', capture: false },
      response: Responses.getIn(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Chudo-Yudo': 'Chudo-Yudo',
        'Diabolos': 'Diabolos',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Chudo-Yudo': 'Chudo-Yudo',
        'Diabolos': 'Diabolos',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Chudo-Yudo': 'チョドーユドー',
        'Diabolos': 'ディアボロス',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Chudo-Yudo': '丘都尤都',
        'Diabolos': '迪亚波罗斯',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Chudo-Yudo': '추도유도',
        'Diabolos': '디아볼로스',
      },
    },
  ],
});
