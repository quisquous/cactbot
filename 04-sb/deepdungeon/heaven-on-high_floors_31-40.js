Options.Triggers.push({
  zoneId: ZoneId.HeavenOnHighFloors31_40,
  triggers: [
    // ---------------- Floor 31-39 Mobs ----------------
    {
      id: 'HoH 31-40 Heavenly Dogu Shifting Light',
      type: 'StartsUsing',
      netRegex: { id: '3045', source: 'Heavenly Dogu', capture: false },
      response: Responses.lookAway('alert'),
    },
    // ---------------- Floor 40 Boss: Bhima ----------------
    // {
    //   id: 'HoH 31-40 Bhima Ancient Aero III',
    //   // spawns whirlwinds on either E/W or N/S sides of arena
    //   // does a knockback from center, knockback prevention doesn't work
    //   // whirlwinds do a simultaneous aoe as the knockback goes off
    //   type: 'StartsUsing',
    //   netRegex: { id: '', source: 'Bhima', capture: false },
    //   alertText: (_data, _matches, output) => output.text!(),
    //   outputStrings: {
    //     text: {
    //       en: 'Knockback away from whirlwinds',
    //     },
    //   },
    // },
  ],
});
