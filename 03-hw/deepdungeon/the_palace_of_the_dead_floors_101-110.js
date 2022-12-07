Options.Triggers.push({
  zoneId: ZoneId.ThePalaceOfTheDeadFloors101_110,
  triggers: [
    // ---------------- Floor 101-109 Mobs ----------------
    // intentionally blank
    // ---------------- Floor 110 Boss: Alicanto ----------------
    {
      id: 'PotD 101-110 Alicanto Aero Blast',
      // roomwide AoE plus DoT
      type: 'StartsUsing',
      netRegex: { id: '1BDC', source: 'Alicanto', capture: false },
      response: Responses.aoe(),
    },
  ],
});
