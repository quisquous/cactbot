Options.Triggers.push({
  id: 'ThePalaceOfTheDeadFloors91_100',
  zoneId: ZoneId.ThePalaceOfTheDeadFloors91_100,
  triggers: [
    // ---------------- Floor 091-099 Mobs ----------------
    {
      id: 'PotD 091-100 Palace Wraith Scream',
      // inflicts Terror (42)
      type: 'StartsUsing',
      netRegex: { id: '190A', source: 'Palace Wraith' },
      response: Responses.stunOrInterruptIfPossible(),
    },
    // ---------------- Floor 100 Boss: Nybeth Obdilord ----------------
    {
      id: 'PotD 091-100 Nybeth Obdilord Summon Darkness',
      // 5357 = Giant Corse
      // 5358 = Bicephalic Corse
      // 5359 = Iron Corse
      type: 'Ability',
      netRegex: { id: '1ADC', source: 'Nybeth Obdilord', capture: false },
      response: Responses.killAdds('alert'),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Nybeth Obdilord': 'Nybeth Obdilord',
        'Palace Wraith': 'Palast-Geist',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Nybeth Obdilord': 'Nybeth Obdilord',
        'Palace Wraith': 'spectre du palais',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Nybeth Obdilord': '屍術師ニバス',
        'Palace Wraith': 'パレス・レイス',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Nybeth Obdilord': '死灵术士尼博斯',
        'Palace Wraith': '地宫幽灵',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Nybeth Obdilord': '시체술사 니버스',
        'Palace Wraith': '궁전 망령',
      },
    },
  ],
});
