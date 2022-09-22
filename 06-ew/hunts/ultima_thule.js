// TODO: Narrow-rift Continual Meddling
// Continual Meddling = 6AC0, applies two of these, one 7 one 10 second, about ~1s before Empty Refrain cast:
//   7A6 = Forward March
//   7A7 = About Face
//   7A8 = Left Face
//   7A9 = Right Face
// Empty Refrain = 6AC3 / 6AC9, 12 second cast followed by 1 second cast of the other
//   damage is the same ability id
Options.Triggers.push({
  zoneId: ZoneId.UltimaThule,
  triggers: [
    {
      id: 'Hunt Arch-Eta Energy Wave',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A85', source: 'Arch-Eta', capture: false }),
      condition: (data) => data.inCombat,
      response: Responses.awayFromFront(),
    },
    {
      id: 'Hunt Arch-Eta Sonic Howl',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A88', source: 'Arch-Eta', capture: false }),
      condition: (data) => data.inCombat,
      response: Responses.aoe(),
    },
    {
      id: 'Hunt Arch-Eta Tail Swipe',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A86', source: 'Arch-Eta', capture: false }),
      condition: (data) => data.inCombat,
      alertText: (_data, _matches, output) => output.getFront(),
      outputStrings: {
        getFront: {
          en: 'Get Front',
          de: 'Geh nach Vorne',
          fr: 'Allez devant',
          ja: '前へ',
          cn: '去正面',
          ko: '앞으로',
        },
      },
    },
    {
      id: 'Hunt Arch-Eta Fanged Lunge',
      type: 'Ability',
      // Before Heavy Stomp (6A87) cast.
      netRegex: NetRegexes.ability({ id: '6A8A', source: 'Arch-Eta', capture: false }),
      condition: (data) => data.inCombat,
      alarmText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Away from jump',
          de: 'Weg vom Sprung',
          fr: 'Éloignez-vous du saut',
          ja: '着地点から離れる',
          cn: '躲开跳跃',
          ko: '점프뛴 곳에서 멀리 떨어지기',
        },
      },
    },
    {
      id: 'Hunt Arch-Eta Steel Fang',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A89', source: 'Arch-Eta' }),
      condition: (data) => data.inCombat,
      response: Responses.tankBuster('info'),
    },
    {
      id: 'Hunt Fan Ail Cyclone Wing',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6AF4', source: 'Fan Ail', capture: false }),
      condition: (data) => data.inCombat,
      response: Responses.aoe(),
    },
    {
      id: 'Hunt Fan Ail Plummet',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6AF2', source: 'Fan Ail', capture: false }),
      condition: (data) => data.inCombat,
      response: Responses.awayFromFront(),
    },
    {
      id: 'Hunt Fan Ail Divebomb',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6AED', source: 'Fan Ail', capture: false }),
      condition: (data) => data.inCombat,
      response: Responses.awayFromFront(),
    },
    {
      id: 'Hunt Fan Ail Death Sentence',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6AF3', source: 'Fan Ail' }),
      condition: (data) => data.inCombat,
      response: Responses.tankBuster('info'),
    },
    {
      id: 'Hunt Narrow-rift Empty Promise Donut',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6B60', source: 'Narrow-rift', capture: false }),
      response: Responses.getIn(),
    },
    {
      id: 'Hunt Narrow-rift Empty Promise Circle',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6B5F', source: 'Narrow-rift', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'Hunt Narrow-rift Vanishing Ray',
      type: 'Ability',
      // An unknown single-target ability that preceeds Vanishing Ray with no cast bar.
      netRegex: NetRegexes.ability({ id: '6AC5', source: 'Narrow-rift', capture: false }),
      response: Responses.getBehind(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'missingTranslations': true,
      'replaceSync': {
        'Arch-Eta': 'Erz-Eta',
        'Fan Ail': 'Fan Ail',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Arch-Eta': 'Arch-Êta',
        'Fan Ail': 'Fan Ail',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Arch-Eta': 'アーチイータ',
        'Fan Ail': 'ファン・アイル',
      },
    },
    {
      'locale': 'cn',
      'missingTranslations': true,
      'replaceSync': {
        'Arch-Eta': '伊塔总领',
        'Fan Ail': '凡·艾尔',
      },
    },
    {
      'locale': 'ko',
      'missingTranslations': true,
      'replaceSync': {
        'Arch-Eta': '아치 에타',
        'Fan Ail': '판 아일',
      },
    },
  ],
});
