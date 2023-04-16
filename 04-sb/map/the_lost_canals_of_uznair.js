// TODO: Canal Flamebeast (alternate final chamber boss)
// TODO: Canal Windbeast (alternate final chamber boss)
const uznairOutputStrings = {
  spawn: {
    en: '${name} spawned!',
    de: '${name} erscheint!',
    cn: '已生成 ${name}!',
    ko: '${name} 등장!',
  },
};
Options.Triggers.push({
  id: 'TheLostCanalsOfUznair',
  zoneId: ZoneId.TheLostCanalsOfUznair,
  triggers: [
    // ---------------- random treasure mobs ----------------
    {
      id: 'Lost Canals of Uznair Namazu Stickywhisker Spawn',
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
      id: 'Lost Canals of Uznair Abharamu Spawn',
      // 6568 = Abharamu
      type: 'AddedCombatant',
      netRegex: { npcNameId: '6568' },
      suppressSeconds: 1,
      infoText: (_data, matches, output) => output.spawn({ name: matches.name }),
      outputStrings: {
        spawn: uznairOutputStrings.spawn,
      },
    },
    // ---------------- cage mobs ----------------
    {
      id: 'Lost Canals of Uznair Canal Scorpion Flying Press',
      type: 'StartsUsing',
      netRegex: { id: '2535', source: 'Canal Scorpion' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Lost Canals of Uznair Canal Wraith Shadow Flare',
      type: 'StartsUsing',
      netRegex: { id: '253A', source: 'Canal Wraith', capture: false },
      response: Responses.aoe(),
    },
    // ---------------- final chamber boss: Canal Thunderbeast ----------------
    {
      id: 'Lost Canals of Uznair Canal Thunderbeast Sparkstorm',
      // pulsing AoE on target
      type: 'StartsUsing',
      netRegex: { id: '255B', source: 'Canal Thunderbeast' },
      response: Responses.tankCleave(),
    },
    {
      id: 'Lost Canals of Uznair Canal Thunderbeast Spark',
      type: 'StartsUsing',
      netRegex: { id: '255D', source: 'Canal Thunderbeast', capture: false },
      response: Responses.getIn(),
    },
    // ---------------- alternate final chamber boss: Canal Flamebeast ----------------
    // Inferno Blast - wide line AoE on main threat?
    // Incinerating Lahar - pulsing roomwide AoE?
    // ---------------- alternate final chamber boss: Canal Windbeast ----------------
    // Twister - front cleave?
    // Crosswind - pulsing AoE with knockback?
  ],
});
