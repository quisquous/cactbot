import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// Palace of the Dead Floors 081-090
// TODO: Palace Bomb Self-Destruct, high damage AoE enrage
// TODO: Palace Worm unknown high damage draw-in + PBAoE enrage
// TODO: The Godmother Giddy Bomb mechanics

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.ThePalaceOfTheDeadFloors81_90,

  triggers: [
    // ---------------- Floor 081-089 Mobs ----------------
    // intentionally blank
    // ---------------- Floor 090 Boss: The Godmother ----------------
    {
      id: 'PotD 081-090 Grey Bomb Spawn',
      // 4578 = Grey Bomb
      // kill before Burst (1BC1) finishes casting
      type: 'AddedCombatant',
      netRegex: { npcNameId: '4578' },
      alertText: (_data, matches, output) => output.kill!({ name: matches.name }),
      outputStrings: {
        kill: {
          en: 'Kill ${name}',
          de: 'Besiege ${name}',
          fr: 'Tuez ${name}',
          ja: '${name}を倒す',
          cn: '击杀 ${name}',
          ko: '${name} 처치',
        },
      },
    },
  ],
};

export default triggerSet;
