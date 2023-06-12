Options.Triggers.push({
  id: 'Yanxia',
  zoneId: ZoneId.Yanxia,
  triggers: [
    {
      id: 'Angada Scythe Tail',
      type: 'StartsUsing',
      netRegex: { id: '1FFE', source: 'Angada', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getOut(),
    },
    {
      id: 'Angada Butcher',
      type: 'StartsUsing',
      netRegex: { id: '1FFF', source: 'Angada', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getBehind(),
    },
  ],
});
