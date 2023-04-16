Options.Triggers.push({
  id: 'ThePalaceOfTheDeadFloors31_40',
  zoneId: ZoneId.ThePalaceOfTheDeadFloors31_40,
  triggers: [
    // ---------------- Floor 031-039 Mobs ----------------
    {
      id: 'PotD 031-040 Nightmare Eye Eyes on Me',
      // untelegraphed roomwide AoE
      type: 'StartsUsing',
      netRegex: { id: '18E2', source: 'Nightmare Eye', capture: false },
      response: Responses.aoe(),
    },
    // ---------------- Floor 40 Boss: Ixtab ----------------
    {
      id: 'PotD 031-040 Ixtab Adds Spawn',
      // 5030 = Nightmare Bhoot
      type: 'AddedCombatant',
      netRegex: { npcNameId: '5030', capture: false },
      suppressSeconds: 1,
      response: Responses.killAdds('alert'),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Nightmare Eye': 'Albtraum-Auge',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Nightmare Eye': 'œil du cauchemar',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Nightmare Eye': 'ナイトメア・アイ',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Nightmare Eye': '噩梦之眼',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Nightmare Eye': '악몽 눈알',
      },
    },
  ],
});
