Options.Triggers.push({
  zoneId: ZoneId.AmdaporKeepHard,
  triggers: [
    {
      id: 'Amdapor Keep Hard Entrance',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: 'C65', source: 'Boogyman', capture: false }),
      response: Responses.lookAway(),
    },
    {
      id: 'Amdapor Keep Hard Boss2 Headmarker on YOU',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '000F' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Go Behind Statue',
          de: 'Geh hinter die Statue',
          fr: 'Cachez vous derriere une statue',
          ko: '조각상 뒤에 숨기',
        },
      },
    },
    {
      id: 'Amdapor Keep Hard Invisible',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: 'C63', source: 'Boogyman', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Kill luminescence and stay close to boss',
          de: 'Besiege die Photosphäre und steh nahe am Boss',
          fr: 'Tuez la Luminescence et restez près du boss',
          ko: '빛구슬을 잡고 보스와 가까이 붙기',
        },
      },
    },
    {
      id: 'Amdapor Keep Hard Imobilize',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: ['29B', '260'], capture: false }),
      response: Responses.killAdds(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Boogyman': 'Butzemann',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Boogyman': 'croque-mitaine',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Boogyman': 'ボギーマン',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Boogyman': '夜魔人',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Boogyman': '부기맨',
      },
    },
  ],
});
