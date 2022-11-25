Options.Triggers.push({
  zoneId: ZoneId.HeavenOnHighFloors91_100,
  triggers: [
    // ---------------- Floor 91-99 Mobs ----------------
    {
      id: 'HoH 91-100 Heavenly Gozu 32-tonze Swipe',
      // untelegraphed instant front cone AoE
      type: 'StartsUsing',
      netRegex: { id: '3005', source: 'Heavenly Gozu', capture: false },
      response: Responses.awayFromFront(),
    },
    {
      id: 'HoH 91-100 Heavenly Mifune Valfodr',
      // charge + knockback on targeted player
      type: 'StartsUsing',
      netRegex: { id: '2F83', source: 'Heavenly Mifune' },
      condition: Conditions.targetIsYou(),
      response: Responses.knockback(),
    },
    {
      id: 'HoH 91-100 Heavenly Jaki Charybdis',
      // circle AoE on marked player, drops target to 1 HP
      type: 'StartsUsing',
      netRegex: { id: '2FF4', source: 'Heavenly Jaki' },
      response: Responses.stunOrInterruptIfPossible(),
    },
    {
      id: 'HoH 91-100 Heavenly Jinba Allagan Fear',
      // gaze
      type: 'StartsUsing',
      netRegex: { id: '2FF9', source: 'Heavenly Jinba', capture: false },
      response: Responses.lookAway('alert'),
    },
    {
      id: 'HoH 91-100 Heavenly Kyozo Filoplumage',
      // gains Vulnerability Down (3F) on self and nearby enemies
      type: 'StartsUsing',
      netRegex: { id: '2FFA', source: 'Heavenly Kyozo' },
      response: Responses.stunOrInterruptIfPossible(),
    },
    {
      id: 'HoH 91-100 Heavenly Tenma Burning Bright',
      // untelegraphed instant front line AoE
      type: 'StartsUsing',
      netRegex: { id: '3011', source: 'Heavenly Tenma', capture: false },
      response: Responses.awayFromFront(),
    },
    {
      id: 'HoH 91-100 Heavenly Tenma Nicker',
      // large PBAoE, inflcits Confuse, goes through walls (can't LoS)
      type: 'StartsUsing',
      netRegex: { id: '3013', source: 'Heavenly Tenma' },
      response: Responses.stunOrInterruptIfPossible(),
    },
  ],
});
