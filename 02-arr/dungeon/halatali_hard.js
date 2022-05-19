Options.Triggers.push({
  zoneId: ZoneId.HalataliHard,
  triggers: [
    {
      id: 'Hataliti Hard Demon Eye',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '833', source: 'Catoblepas', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Use the Orb',
          fr: 'Utilisez l\'Orbe',
        },
      },
    },
    {
      id: 'Hataliti Hard Standstill',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '84F', source: 'Mumuepo the Beholden', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Use the Nail',
          fr: 'Utilisez L\'Épine',
        },
      },
    },
  ],
});
