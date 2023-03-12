Options.Triggers.push({
  zoneId: ZoneId.EurekaOrthosFloors1_10,
  triggers: [
    // ---------------- Floor 01-09 Mobs ----------------
    {
      id: 'EO 01-10 Orthos Grenade Big Burst',
      type: 'StartsUsing',
      netRegex: { id: '7E7D', source: 'Orthos Grenade', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'EO 01-10 Orthos Behemoth Wild Horn',
      type: 'StartsUsing',
      netRegex: { id: '7E7C', source: 'Orthos Behemoth' },
      condition: Conditions.targetIsYou(),
      response: Responses.knockback(),
    },
    // ---------------- Floor 10 Boss: Gancanagh ----------------
    {
      id: 'EO 01-10 Gancanagh Mandrastorm',
      type: 'StartsUsing',
      netRegex: { id: '7AF7', source: 'Gancanagh', capture: false },
      response: Responses.aoe(),
    },
  ],
});
