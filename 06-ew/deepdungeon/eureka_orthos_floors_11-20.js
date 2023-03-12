Options.Triggers.push({
  zoneId: ZoneId.EurekaOrthosFloors11_20,
  triggers: [
    // ---------------- Floor 11-19 Mobs ----------------
    {
      id: 'EO 11-20 Orthos Sawtooth Mean Thrash',
      type: 'StartsUsing',
      netRegex: { id: '7E93', source: 'Orthos Sawtooth', capture: false },
      response: Responses.goFront(),
    },
    // ---------------- Floor 20 Boss: Cloning Node ----------------
    // intentionally blank
  ],
});
