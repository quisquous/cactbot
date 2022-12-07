Options.Triggers.push({
  zoneId: ZoneId.ThePalaceOfTheDeadFloors41_50,
  triggers: [
    // ---------------- Floor 041-049 Mobs ----------------
    {
      id: 'PotD 041-050 Nightmare Bhoot Paralyze III',
      // inflicts Paralyze
      type: 'StartsUsing',
      netRegex: { id: '18F2', source: 'Nightmare Bhoot' },
      response: Responses.stunOrInterruptIfPossible(),
    },
    {
      id: 'PotD 041-050 Nightmare Persona Paralyze III',
      // same ability name, different mob
      // inflicts Paralyze
      type: 'StartsUsing',
      netRegex: { id: '18F4', source: 'Nightmare Persona' },
      response: Responses.stunOrInterruptIfPossible(),
    },
    {
      id: 'PotD 041-050 Nightmare Wraith Scream',
      // inflicts Terror (42)
      type: 'StartsUsing',
      netRegex: { id: '190A', source: 'Nightmare Wraith' },
      response: Responses.stunOrInterruptIfPossible(),
    },
    {
      id: 'PotD 041-050 Nightmare Manticore Ripper Claw',
      // untelegraphed front cone AoE
      type: 'StartsUsing',
      netRegex: { id: '18FA', source: 'Nightmare Manticore', capture: false },
      response: Responses.awayFromFront(),
    },
    // ---------------- Floor 050 Boss: Edda Blackbosom ----------------
    {
      id: 'PotD 041-050 Edda Blackbosom In Health (PBAoE)',
      // large PBAoE, increases damage of Black Honeymoon if hit
      type: 'StartsUsing',
      netRegex: { id: '18FE', source: 'Edda Blackbosom', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'PotD 041-050 Edda Blackbosom In Health (Donut)',
      // Donut AoE, increases damage of Black Honeymoon if hit
      type: 'StartsUsing',
      netRegex: { id: '18FF', source: 'Edda Blackbosom', capture: false },
      response: Responses.getUnder('alert'),
    },
    {
      id: 'PotD 041-050 Edda Blackbosom Black Honeymoon',
      // roomwide AoE, does more damage increased based on how many players hit by In Health
      type: 'StartsUsing',
      netRegex: { id: '1902', source: 'Edda Blackbosom', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'PotD 041-050 Edda Blackbosom Cold Feet',
      // gaze, inflicts Confusion
      type: 'StartsUsing',
      netRegex: { id: '1903', source: 'Edda Blackbosom', capture: false },
      response: Responses.lookAway('alert'),
    },
  ],
});
