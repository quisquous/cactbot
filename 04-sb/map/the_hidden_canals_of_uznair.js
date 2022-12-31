// TODO: Airavata (final chamber boss)
const uznairOutputStrings = {
  spawn: {
    en: '${name} spawned!',
    de: '${name} erscheint!',
    cn: '正在生成 ${name}!',
    ko: '${name} 등장!',
  },
};
Options.Triggers.push({
  zoneId: ZoneId.TheHiddenCanalsOfUznair,
  triggers: [
    // ---------------- random treasure mobs ----------------
    {
      id: 'Hidden Canals of Uznair Namazu Stickywhisker Spawn',
      // 6567 = Namazu Stickywhisker
      type: 'AddedCombatant',
      netRegex: { npcNameId: '6567' },
      suppressSeconds: 1,
      infoText: (_data, matches, output) => output.spawn({ name: matches.name }),
      outputStrings: {
        spawn: uznairOutputStrings.spawn,
      },
    },
    {
      id: 'Hidden Canals of Uznair Abharamu Spawn',
      // 6568 = Abharamu
      type: 'AddedCombatant',
      netRegex: { npcNameId: '6568' },
      suppressSeconds: 1,
      infoText: (_data, matches, output) => output.spawn({ name: matches.name }),
      outputStrings: {
        spawn: uznairOutputStrings.spawn,
      },
    },
    {
      id: 'Hidden Canals of Uznair Canal Crew Spawn',
      // 6847 = Canal Onion
      // 6848 = Canal Egg
      // 6849 = Canal Garlic
      // 6850 = Canal Tomato
      // 6851 = Canal Queen
      type: 'AddedCombatant',
      netRegex: { npcNameId: ['684[7-9]', '685[01]'], capture: false },
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Canal Crew spawned, kill in order!',
          ko: '만드라즈 등장, 순서대로 잡기!',
        },
      },
    },
    // ---------------- final chamber boss: Airavata ----------------
    // Spin - front cleave?
    // Buffet - tankbuster?
  ],
});
