Options.Triggers.push({
  zoneId: ZoneId.UltimaThule,
  triggers: [
    {
      id: 'Hunt Arch-Eta Energy Wave',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A85', source: 'Arch-Eta', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      id: 'Hunt Arch-Eta Sonic Howl',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A88', source: 'Arch-Eta', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Hunt Arch-Eta Tail Swipe',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A86', source: 'Arch-Eta', capture: false }),
      alertText: (_data, _matches, output) => output.getFront(),
      outputStrings: {
        getFront: {
          en: 'Get Front',
          de: 'Geh nach Vorne',
          fr: 'Allez devant',
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
      alarmText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Away from jump',
          de: 'Weg vom Sprung',
          fr: 'Éloignez-vous du saut',
          cn: '躲开跳跃',
          ko: '점프뛴 곳에서 멀리 떨어지기',
        },
      },
    },
    {
      id: 'Hunt Arch-Eta Steel Fang',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6A89', source: 'Arch-Eta' }),
      response: Responses.tankBuster('info'),
    },
    {
      id: 'Hunt Fan Ail Cyclone Wing',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6AF4', source: 'Fan Ail', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Hunt Fan Ail Plummet',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6AF2', source: 'Fan Ail', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      id: 'Hunt Fan Ail Divebomb',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6AED', source: 'Fan Ail' }),
      alertText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.divebombOnYou();
        return output.divebombMarker();
      },
      outputStrings: {
        divebombOnYou: {
          en: 'Divebomb on YOU',
          de: 'Sturzflug auf DIR',
          fr: 'Bombe plongeante sur VOUS',
          cn: '俯冲点名',
          ko: '나에게 초록징',
        },
        divebombMarker: {
          en: 'Away from Divebomb Marker',
          de: 'Weg von dem Sturzflug-Marker',
          fr: 'Éloignez-vous de la bombe plongeante',
          cn: '躲开俯冲点名',
          ko: '초록징 피하기',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Arch-Eta': 'Erz-Eta',
        'Fan Ail': 'Fan Ail',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Arch-Eta': 'Arch-Êta',
        'Fan Ail': 'Fan Ail',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Arch-Eta': 'アーチイータ',
        'Fan Ail': 'ファン・アイル',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Arch-Eta': '伊塔总领',
        'Fan Ail': '凡·艾尔',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Arch-Eta': '아치 에타',
        'Fan Ail': '판 아일',
      },
    },
  ],
});
