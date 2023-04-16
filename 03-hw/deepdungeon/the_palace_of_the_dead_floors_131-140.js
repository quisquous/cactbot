Options.Triggers.push({
  id: 'ThePalaceOfTheDeadFloors131_140',
  zoneId: ZoneId.ThePalaceOfTheDeadFloors131_140,
  triggers: [
    // ---------------- Floor 131-139 Mobs ----------------
    {
      id: 'PotD 131-140 Deep Palace Ahriman Level 5 Petrify',
      // untelegraphed cone AoE that inflicts Petrify
      type: 'StartsUsing',
      netRegex: { id: '1B77', source: 'Deep Palace Ahriman', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'PotD 131-140 Deep Palace Catoblepas Eye of the Stunted',
      // gaze attack that inflicts Minimum (1B6)
      type: 'StartsUsing',
      netRegex: { id: '1B7A', source: 'Deep Palace Catoblepas', capture: false },
      response: Responses.lookAway('alert'),
    },
    // ---------------- Floor 140 Boss: Ah Puch ----------------
    {
      id: 'PotD 131-140 Ah Puch Adds Spawn',
      // 5411 = Deep Palace Follower
      type: 'AddedCombatant',
      netRegex: { npcNameId: '5411', capture: false },
      suppressSeconds: 1,
      response: Responses.killAdds('alert'),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Deep Palace Ahriman': 'Katakomben-Ahriman',
        'Deep Palace Catoblepas': 'Katakomben-Catblepus',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Deep Palace Ahriman': 'ahriman des profondeurs',
        'Deep Palace Catoblepas': 'catoblépas des profondeurs',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Deep Palace Ahriman': 'ディープパレス・アーリマン',
        'Deep Palace Catoblepas': 'ディープパレス・カトブレパス',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Deep Palace Ahriman': '深宫冥鬼之眼',
        'Deep Palace Catoblepas': '深宫卡托布莱帕斯',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Deep Palace Ahriman': '깊은 궁전 아리만',
        'Deep Palace Catoblepas': '깊은 궁전 카토블레파스',
      },
    },
  ],
});
