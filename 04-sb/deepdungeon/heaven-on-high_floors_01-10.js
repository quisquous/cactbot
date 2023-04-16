Options.Triggers.push({
  id: 'HeavenOnHighFloors1_10',
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
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Heavenly Amikiri': 'Himmelssäulen-Amikiri',
        'Heavenly Uwabami': 'Himmelssäulen-Uwabami',
        'Mojabune': 'Mojabune',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Heavenly Amikiri': 'Amikiri des Cieux',
        'Heavenly Uwabami': 'uwabami des Cieux',
        'Mojabune': 'Môjabune',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Heavenly Amikiri': 'アメノ・アミキリ',
        'Heavenly Uwabami': 'アメノ・ウワバミ',
        'Mojabune': 'モウジャブネ',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Heavenly Amikiri': '天之切网虾蛄',
        'Heavenly Uwabami': '天之蟒蛇',
        'Mojabune': '亡者船',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Heavenly Amikiri': '천궁 아미키리',
        'Heavenly Uwabami': '천궁 이무기',
        'Mojabune': '망자의 배',
      },
    },
  ],
});
