Options.Triggers.push({
  zoneId: ZoneId.ThePalaceOfTheDeadFloors131_140,
  triggers: [
    // ---------------- Floor 131-139 Mobs ----------------
    {
      id: 'PotD 131-140 Deep Palace Ahriman Level 5 Petrify',
      // untelegraphed cone AoE that inflicts Petrify
      type: 'StartsUsing',
      netRegex: { id: '1B77', source: 'Deep Palace Ahriman', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'PotD 131-140 Deep Palace Catoblepas Eye of the Stunted',
      // gaze attack that inflicts Minimum (1B6)
      type: 'StartsUsing',
      netRegex: { id: '1B7A', source: 'Deep Palace Catoblepas', capture: false },
      response: Responses.lookAway('alert'),
    },
    // ---------------- Floor 140 Boss: Ah Puch ----------------
    {
      id: 'PotD 131-140 Ah Puch Adds Spawn',
      // 5411 = Deep Palace Follower
      type: 'AddedCombatant',
      netRegex: { npcNameId: '5411', capture: false },
      suppressSeconds: 1,
      response: Responses.killAdds('alert'),
    },
  ],
});
