import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// TODO: Namazu Stickywhisker (bonus treasure mob)
// TODO: Abharamu (bonus treasure mob)
// TODO: Canal Flamebeast (final chamber boss)
// TODO: Canal Thunderbeast (alternate final chamber boss)
// TODO: Canal Windbeast (alternate final chamber boss)

const uznairOutputStrings = {
  spawn: {
    en: '${name} spawned!',
    de: '${name} erscheint!',
    cn: '正在生成 ${name}!',
    ko: '${name} 등장!',
  },
} as const;

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheLostCanalsOfUznair,

  triggers: [
    // ---------------- random treasure mobs ----------------
    {
      id: 'Lost Canals of Uznair Namazu Stickywhisker Spawn',
      // xxxx = Namazu Stickywhisker
      type: 'AddedCombatant',
      netRegex: { npcNameId: '' },
      suppressSeconds: 1,
      infoText: (_data, matches, output) => output.spawn!({ name: matches.name }),
      outputStrings: {
        spawn: uznairOutputStrings.spawn,
      },
    },
    {
      id: 'Lost Canals of Uznair Abharamu Spawn',
      // xxxx = Abharamu
      type: 'AddedCombatant',
      netRegex: { npcNameId: '' },
      suppressSeconds: 1,
      infoText: (_data, matches, output) => output.spawn!({ name: matches.name }),
      outputStrings: {
        spawn: uznairOutputStrings.spawn,
      },
    },
    // ---------------- final chamber boss: Canal Flamebeast ----------------
    // Inferno Blast - wide line AoE on main threat?
    // Incinerating Lahar - pulsing roomwide AoE?
    // ---------------- alternate final chamber boss: Canal Thunderbeast ----------------
    // Sparkstorm - pulsing AoE on main threat?
    // Spark - donut AoE?
    // ---------------- alternate final chamber boss: Canal Windbeast ----------------
    // Twister - front cleave?
    // Crosswind - pulsing AoE with knockback?
  ],
};

export default triggerSet;
