Options.Triggers.push({
  zoneId: ZoneId.Snowcloak,
  triggers: [
    {
      id: 'Snowcloak Lunar Cry',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: 'C1F', source: 'Fenrir', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Hide behind Ice',
          fr: 'Cachez vous derrière un pilier de glace',
        },
      },
    },
  ],
});
