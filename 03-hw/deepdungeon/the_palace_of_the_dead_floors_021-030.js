Options.Triggers.push({
  id: 'ThePalaceOfTheDeadFloors21_30',
  zoneId: ZoneId.ThePalaceOfTheDeadFloors21_30,
  triggers: [
    // ---------------- Floor 021-029 Mobs ----------------
    {
      id: 'PotD 021-030 Palace Minotaur 111-tonze Swing',
      // untelegraphed PBAoE with knockback
      type: 'StartsUsing',
      netRegex: { id: '18DC', source: 'Palace Minotaur', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'PotD 021-030 Palace Skatene Chirp',
      // untelegraphed PBAoE Sleep
      type: 'StartsUsing',
      netRegex: { id: '18DD', source: 'Palace Skatene', capture: false },
      response: Responses.getOut(),
    },
    // ---------------- Floor 030 Boss: Ningishzida ----------------
    {
      id: 'PotD 021-030 Ningishzida Ball of Fire',
      // persistent AoE that inflicts Burns (11C)
      type: 'NetworkAOEAbility',
      netRegex: { id: '191B', source: 'Ningishzida' },
      condition: Conditions.targetIsYou(),
      response: Responses.moveAway(),
    },
    {
      id: 'PotD 021-030 Ningishzida Ball of Ice',
      // persistent AoE that inflicts Frostbite
      type: 'NetworkAOEAbility',
      netRegex: { id: '191C', source: 'Ningishzida' },
      condition: Conditions.targetIsYou(),
      response: Responses.moveAway(),
    },
    {
      id: 'PotD 021-030 Ningishzida Fear Itself',
      // roomwide donut AoE that inflicts Terror (42), need to be inside boss hitbox to avoid
      // Ningishzida always moves to the center of the room first before casting this
      type: 'StartsUsing',
      netRegex: { id: '191D', source: 'Ningishzida', capture: false },
      response: Responses.getUnder('alert'),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Ningishzida': 'Ningishzida',
        'Palace Minotaur': 'Palast-Minotaurus',
        'Palace Skatene': 'Palast-Skatene',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Ningishzida': 'Ningishzida',
        'Palace Minotaur': 'minotaure du palais',
        'Palace Skatene': 'skate\'ne du palais',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Ningishzida': 'ニンギジッダ',
        'Palace Minotaur': 'パレス・ミノタウロス',
        'Palace Skatene': 'パレス・スカネテ',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Ningishzida': '宁吉兹济达',
        'Palace Minotaur': '地宫弥诺陶洛斯',
        'Palace Skatene': '地宫斯卡尼特',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Ningishzida': '닝기시지다',
        'Palace Minotaur': '궁전 미노타우로스',
        'Palace Skatene': '궁전 스카네테',
      },
    },
  ],
});
