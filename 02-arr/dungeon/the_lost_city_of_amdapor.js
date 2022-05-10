Options.Triggers.push({
  zoneId: ZoneId.TheLostCityOfAmdapor,
  triggers: [
    {
      id: 'Lost City Amdapor Devour',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '736', source: 'Chudo-Yudo', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '736', source: 'Chudo-Yudo', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '736', source: 'Chudo-Yudo', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '736', source: 'チョドーユドー', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '736', source: '丘都尤都', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '736', source: '추도유도', capture: false }),
      response: Responses.killAdds(),
    },
    {
      id: 'Lost City Amdapor Graviball',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '762', source: 'Diabolos' }),
      netRegexDe: NetRegexes.startsUsing({ id: '762', source: 'Diabolos' }),
      netRegexFr: NetRegexes.startsUsing({ id: '762', source: 'Diabolos' }),
      netRegexJa: NetRegexes.startsUsing({ id: '762', source: 'ディアボロス' }),
      netRegexCn: NetRegexes.startsUsing({ id: '762', source: '迪亚波罗斯' }),
      netRegexKo: NetRegexes.startsUsing({ id: '762', source: '디아볼로스' }),
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Drop Puddle Outside',
          de: 'Fläche draußen ablegen',
        },
      },
    },
    {
      id: 'Lost City Amdapor Ultimate Terror',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '766', source: 'Diabolos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '766', source: 'Diabolos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '766', source: 'Diabolos', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '766', source: 'ディアボロス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '766', source: '迪亚波罗斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '766', source: '디아볼로스', capture: false }),
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
