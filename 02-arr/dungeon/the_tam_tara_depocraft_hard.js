Options.Triggers.push({
  zoneId: ZoneId.TheTamTaraDeepcroftHard,
  triggers: [
    {
      id: 'Tam-Tara Hard Inhumanity',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '956', source: 'Liavinne', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Stack (ignore adds)',
          fr: 'Packez-vous: ne tuez pas les Adds',
        },
      },
    },
  ],
});
