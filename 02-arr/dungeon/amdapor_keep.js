Options.Triggers.push({
  zoneId: ZoneId.AmdaporKeep,
  triggers: [
    {
      id: 'Amdapor Keep Liquefy Middle',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '415', source: 'Demon Wall', capture: false }),
      response: Responses.goMiddle(),
    },
    {
      id: 'Amdapor Keep Liquefy Sides',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '416', source: 'Demon Wall', capture: false }),
      response: Responses.goSides(),
    },
    {
      id: 'Amdapor Keep Repel',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '417', source: 'Demon Wall', capture: false }),
      response: Responses.knockback(),
    },
  ],
});
