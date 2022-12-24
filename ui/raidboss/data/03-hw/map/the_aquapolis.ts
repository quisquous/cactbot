import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

const aquapolisOutputStrings = {
  spawn: {
    en: '${name} spawned!',
    de: '${name} erscheint!',
    cn: '正在生成 ${name}!',
    ko: '${name} 등장!',
  },
} as const;

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheAquapolis,

  triggers: [
    // ---------------- random treasure mobs ----------------
    {
      id: 'Aquapolis Goblin Treasure Hunter Spawn',
      // 5058 = Goblin Treasure Hunter
      type: 'AddedCombatant',
      netRegex: { npcNameId: '5058' },
      suppressSeconds: 1,
      infoText: (_data, matches, output) => output.spawn!({ name: matches.name }),
      outputStrings: {
        spawn: aquapolisOutputStrings.spawn,
      },
    },
    {
      id: 'Aquapolis Arges Spawn',
      // 5059 = Arges
      type: 'AddedCombatant',
      netRegex: { npcNameId: '5059' },
      suppressSeconds: 1,
      infoText: (_data, matches, output) => output.spawn!({ name: matches.name }),
      outputStrings: {
        spawn: aquapolisOutputStrings.spawn,
      },
    },
    {
      id: 'Aquapolis Arges 100-tonze Swipe',
      type: 'StartsUsing',
      netRegex: { id: '1966', source: 'Arges', capture: false },
      response: Responses.awayFromFront(),
    },
    {
      id: 'Aquapolis Arges 100-tonze Swing',
      type: 'StartsUsing',
      netRegex: { id: '1967', source: 'Arges', capture: false },
      response: Responses.getOut(),
    },
    // ---------------- cage mobs ----------------
    {
      id: 'Aquapolis Polis Pot Mysterious Light',
      type: 'StartsUsing',
      netRegex: { id: '16C8', source: 'Polis Pot', capture: false },
      response: Responses.lookAway('alert'),
    },
    {
      id: 'Aquapolis Polis Hornet Final Sting',
      type: 'StartsUsing',
      netRegex: { id: '9B2', source: 'Polis Hornet' },
      response: Responses.tankBuster(),
    },
  ],
};

export default triggerSet;
