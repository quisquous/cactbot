Options.Triggers.push({
  zoneId: ZoneId.ThePalaceOfTheDeadFloors31_40,
  triggers: [
    // ---------------- Floor 031-039 Mobs ----------------
    {
      id: 'PotD 031-040 Nightmare Eye Eyes on Me',
      // untelegraphed roomwide AoE
      type: 'StartsUsing',
      netRegex: { id: '18E2', source: 'Nightmare Eye', capture: false },
      response: Responses.aoe(),
    },
    // ---------------- Floor 40 Boss: Ixtab ----------------
    {
      id: 'PotD 031-040 Ixtab Adds Spawn',
      // 5030 = Nightmare Bhoot
      type: 'AddedCombatant',
      netRegex: { npcNameId: '5030', capture: false },
      suppressSeconds: 1,
      response: Responses.killAdds('alert'),
    },
  ],
});
