Options.Triggers.push({
  zoneId: ZoneId.PharosSirius,
  triggers: [
    {
      id: 'Pharos Sirius Deathly Cadenza',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '5CF', source: 'Siren', capture: false }),
      response: Responses.getIn(),
    },
    {
      id: 'Pharos Sirius Feral Lunge',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '5CC', source: 'Siren', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'Pharos Sirius Corrupted Crystal',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '176', count: '03' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Spread: Stacks Explode Soon',
          de: 'Verteilen: Kristallstacks explodieren bald',
        },
      },
    },
    {
      // Not 100% sure if there's a better way to handle the callout
      id: 'Pharos Sirius Doom',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '172' }),
      infoText: (data, matches, output) => output.text({ player: data.ShortName(matches.target) }),
      outputStrings: {
        text: {
          en: 'Heal ${player} to full',
          de: 'Heile ${player} voll',
          fr: 'Soin complet sur ${player}',
          ko: '완전 회복: ${player}',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Siren': 'Sirene',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Siren': 'sirène',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Siren': 'セイレーン',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Siren': '塞壬',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Siren': '세이렌',
      },
    },
  ],
});
