import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// Palace of the Dead Floors 081-090
// TODO: Palace Bomb Self-Destruct, high damage AoE enrage
// TODO: Palace Worm unknown high damage draw-in + PBAoE enrage

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
    {
      id: 'PotD 081-090 Giddy Bomb Spawn',
      // 5477 = Giddy Bomb
      // The Godmother casts Massive Burst (1BBE), a non-interruptable, 99% HP roomwide attack
      // Lava Bomb casts Hypothermal Combustion (1BC0), a small PBAoE which will interrupt Massive Burst
      // attack Giddy Bomb to push it into The Godmother
      type: 'AddedCombatant',
      netRegex: { npcNameId: '5477' },
      alertText: (_data, matches, output) => output.pushToBoss!({ name: matches.name }),
      outputStrings: {
        pushToBoss: {
          en: 'Push ${name} into boss',
          de: 'Stoß ${name} in den Boss',
          cn: '将 ${name} 推至BOSS',
          ko: '보스쪽으로 ${name} 밀기',
        },
      },
    },
  ],
};

export default triggerSet;
