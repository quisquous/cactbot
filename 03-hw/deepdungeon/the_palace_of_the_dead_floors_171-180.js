Options.Triggers.push({
  zoneId: ZoneId.ThePalaceOfTheDeadFloors171_180,
  triggers: [
    // ---------------- Floor 171-179 Mobs ----------------
    {
      id: 'PotD 171-180 Deep Palace Snowclops Glower',
      // untelegraphed front line AoE
      type: 'StartsUsing',
      netRegex: { id: '1B95', source: 'Deep Palace Snowclops', capture: false },
      response: Responses.awayFromFront(),
    },
    {
      id: 'PotD 171-180 Bird of the Deep Palace Tropical Wind',
      // gains Haste and Attack Boost
      type: 'StartsUsing',
      netRegex: { id: '1B94', source: 'Bird of the Deep Palace' },
      response: Responses.interruptIfPossible(),
    },
    // ---------------- Floor 180 Boss: Dendainsonne ----------------
    // intentionally blank
  ],
});
