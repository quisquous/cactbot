Options.Triggers.push({
  zoneId: ZoneId.HeavenOnHighFloors11_20,
  triggers: [
    // ---------------- Floor 11-19 Mobs ----------------
    {
      id: 'HoH 11-20 Heavenly Otokage Nightmarish Light',
      // gaze, inflicts Seduction, immediately combos with Garish Light (inflicts Minimum)
      type: 'StartsUsing',
      netRegex: { id: '3022', source: 'Heavenly Otokage', capture: false },
      response: Responses.lookAway('alert'),
    },
    // ---------------- Floor 20 Boss: Beccho ----------------
    {
      id: 'HoH 11-20 Beccho Neuro Squama',
      // gaze, inflicts Hysteria, combos with Psycho Squama (2E7B) and Fragility (2E7D)
      type: 'StartsUsing',
      netRegex: { id: '2E7C', source: 'Beccho', capture: false },
      response: Responses.lookAway('alert'),
    },
  ],
});
