Options.Triggers.push({
  id: 'HeavenOnHighFloors31_40',
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
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Bhima': 'Bhima',
        'Heavenly Dogu': 'Himmelssäulen-Dogu',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Bhima': 'Bhima',
        'Heavenly Dogu': 'dogû des Cieux',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Bhima': 'ビーマ',
        'Heavenly Dogu': 'アメノ・ドグウ',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Bhima': '怖军',
        'Heavenly Dogu': '天之土偶',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Bhima': '비마',
        'Heavenly Dogu': '천궁 토우',
      },
    },
  ],
});
