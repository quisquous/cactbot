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
          fr: 'Cachez vous derriere une statue',
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
          fr: 'Tuez la Luminescence et restez près du boss',
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
});
