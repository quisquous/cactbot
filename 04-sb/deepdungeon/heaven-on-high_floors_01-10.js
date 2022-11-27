Options.Triggers.push({
  zoneId: ZoneId.HeavenOnHighFloors1_10,
  triggers: [
    // ---------------- Floor 01-09 Mobs ----------------
    {
      id: 'HoH 01-10 Heavenly Amikiri Shuck',
      // tankbuster, can stun
      type: 'StartsUsing',
      netRegex: { id: '2ECE', source: 'Heavenly Amikiri' },
      response: Responses.stunIfPossible(),
    },
    {
      id: 'HoH 01-10 Heavenly Uwabami Stone Gaze',
      // inflicts Petrify
      type: 'StartsUsing',
      netRegex: { id: '18CF', source: 'Heavenly Uwabami', capture: false },
      response: Responses.lookAway('alert'),
    },
    // ---------------- Floor 10 Boss: Mojabune ----------------
    {
      id: 'HoH 01-10 Mojabune Overtow',
      // knockback, knockback prevention does not work
      type: 'StartsUsing',
      netRegex: { id: '2E65', source: 'Mojabune', capture: false },
      response: Responses.knockback(),
    },
  ],
});
