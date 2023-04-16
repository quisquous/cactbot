Options.Triggers.push({
  id: 'ThePalaceOfTheDeadFloors11_20',
  zoneId: ZoneId.ThePalaceOfTheDeadFloors11_20,
  triggers: [
    // ---------------- Floor 011-019 Mobs ----------------
    {
      id: 'PotD 011-020 Palace Cobra Stone Gaze',
      // inflicts Petrify
      type: 'StartsUsing',
      netRegex: { id: '18CF', source: 'Palace Cobra', capture: false },
      response: Responses.lookAway('alert'),
    },
    // ---------------- Floor 020 Boss: Spurge ----------------
    {
      id: 'PotD 011-020 Spurge Leafstorm',
      type: 'StartsUsing',
      netRegex: { id: '1918', source: 'Spurge', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'PotD 011-020 Spurge Adds Spawn',
      // 4981 = Palace Hornet, use Final Sting 70% max HP enrage attack if not killed fast enough
      type: 'AddedCombatant',
      netRegex: { npcNameId: '4981', capture: false },
      suppressSeconds: 1,
      response: Responses.killAdds('alert'),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Palace Cobra': 'Palast-Kobra',
        'Spurge': 'Euphorbia',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Palace Cobra': 'cobra du palais',
        'Spurge': 'Euphorbe',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Palace Cobra': 'パレス・コブラ',
        'Spurge': 'スパージ',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Palace Cobra': '地宫眼镜蛇',
        'Spurge': '大戟花',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Palace Cobra': '궁전 코브라',
        'Spurge': '등대풀',
      },
    },
  ],
});
