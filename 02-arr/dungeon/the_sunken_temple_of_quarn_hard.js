Options.Triggers.push({
  zoneId: ZoneId.TheSunkenTempleOfQarnHard,
  triggers: [
    {
      id: 'Sunken Quarn Hard Light of Anathema',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: 'C26', source: 'Vicegerent to the Warden', capture: false }),
      response: Responses.awayFromFront(),
    },
  ],
});
