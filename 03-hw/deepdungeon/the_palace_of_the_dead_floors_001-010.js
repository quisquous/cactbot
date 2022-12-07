Options.Triggers.push({
  zoneId: ZoneId.ThePalaceOfTheDeadFloors1_10,
  triggers: [
    // ---------------- Floor 001-009 Mobs ----------------
    // intentionally blank
    // ---------------- Floor 010 Boss: Palace Deathgaze ----------------
    {
      id: 'PotD 001-010 Palace Deathgaze Aero Blast',
      type: 'StartsUsing',
      netRegex: { id: '1914', source: 'Palace Deathgaze', capture: false },
      response: Responses.aoe(),
    },
  ],
});
