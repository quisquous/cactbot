Options.Triggers.push({
  zoneId: ZoneId.HeavenOnHighFloors71_80,
  triggers: [
    // ---------------- Floor 71-79 Mobs ----------------
    {
      id: 'HoH 71-80 Heavenly Ichijama Scream',
      // inflicts Terror (42)
      type: 'StartsUsing',
      netRegex: { id: '2FA3', source: 'Heavenly Ichijama' },
      response: Responses.stunOrInterruptIfPossible(),
    },
    {
      id: 'HoH 71-80 Heavenly Hyoga Eyeshine',
      type: 'StartsUsing',
      netRegex: { id: '2FE5', source: 'Heavenly Hyoga', capture: false },
      response: Responses.lookAway('alert'),
    },
    {
      id: 'HoH 71-80 Heavenly Mammoth Wooly Inspiration',
      // front cone AoE draw-in, follows up with Tusk Butt (instant, untelegraphed front cone AoE)
      type: 'StartsUsing',
      netRegex: { id: '2FBA', source: 'Heavenly Mammoth', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'HoH 71-80 Heavenly Tofu Golden Tongue',
      // gains Magic Damage Up (39)
      type: 'StartsUsing',
      netRegex: { id: '2FBE', source: 'Heavenly Tofu' },
      response: Responses.stunOrInterruptIfPossible(),
    },
    // ---------------- Floor 80 Boss: Kajigakaka ----------------
    {
      id: 'HoH 71-80 Kajigakaka Lunar Cry',
      type: 'StartsUsing',
      netRegex: { id: '2ED3', source: 'Kajigakaka', capture: false },
      response: Responses.aoe(),
    },
  ],
});
