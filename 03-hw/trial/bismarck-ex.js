Options.Triggers.push({
  zoneId: ZoneId.TheLimitlessBlueExtreme,
  triggers: [
    {
      id: 'Bismarck Sharp Gust',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: 'FAF', source: 'Bismarck', capture: false }),
      response: Responses.knockback(),
    },
  ],
});
