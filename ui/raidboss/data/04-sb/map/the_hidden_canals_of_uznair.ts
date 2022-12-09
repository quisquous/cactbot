import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// TODO: Namazu Stickywhisker (bonus treasure mob)
// TODO: Abharamu (bonus treasure mob)
// TODO: Canal Crew (bonus treasure mobs)
// TODO: Airavata

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
  zoneId: ZoneId.TheHiddenCanalsOfUznair,

  triggers: [
    // ---------------- random treasure mobs ----------------
    {
      id: 'Hidden Canals of Uznair Namazu Stickywhisker Spawn',
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
      id: 'Hidden Canals of Uznair Abharamu Spawn',
      // xxxx = Abharamu
      type: 'AddedCombatant',
      netRegex: { npcNameId: '' },
      suppressSeconds: 1,
      infoText: (_data, matches, output) => output.spawn!({ name: matches.name }),
      outputStrings: {
        spawn: uznairOutputStrings.spawn,
      },
    },
    {
      id: 'Hidden Canals of Uznair Canal Crew Spawn',
      type: 'AddedCombatant',
      netRegex: { npcNameId: '', capture: false },
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Canal Crew spawned, kill in order!',
        },
      },
    },
    // ---------------- final chamber boss: Airavata ----------------
    // Spin - front cleave?
    // Buffet - tankbuster?
  ],
};

export default triggerSet;
