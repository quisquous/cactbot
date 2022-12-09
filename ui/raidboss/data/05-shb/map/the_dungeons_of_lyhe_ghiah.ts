import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// TODO: confirm Fuath Trickster npcNameId
// TODO: confirm The Keeper of the Keys npcNameId
// TODO: confirm Dungeon Crew npcNameIds
// TODO: Goliath (golden Talos)
// TODO: Alichino (golden Calcabrina)

const lyheGhiahOutputStrings = {
  spawn: {
    en: '${name} spawned!',
    de: '${name} erscheint!',
    cn: '正在生成 ${name}!',
    ko: '${name} 등장!',
  },
} as const;

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheDungeonsOfLyheGhiah,

  triggers: [
    // ---------------- random treasure mobs ----------------
    {
      id: 'Dungeons of Lyhe Ghiah Fuath Trickster Spawn',
      // 9774 = Fuath Trickster
      type: 'AddedCombatant',
      netRegex: { npcNameId: '9774' },
      suppressSeconds: 1,
      infoText: (_data, matches, output) => output.spawn!({ name: matches.name }),
      outputStrings: {
        spawn: lyheGhiahOutputStrings.spawn,
      },
    },
    {
      id: 'Dungeons of Lyhe Ghiah The Keeper of the Keys Spawn',
      // 9773 = The Keeper of the Keys
      type: 'AddedCombatant',
      netRegex: { npcNameId: '9773' },
      suppressSeconds: 1,
      infoText: (_data, matches, output) => output.spawn!({ name: matches.name }),
      outputStrings: {
        spawn: lyheGhiahOutputStrings.spawn,
      },
    },
    {
      id: 'Dungeons of Lyhe Ghiah Dungeon Crew Spawn',
      // 9801 = Secret Onion
      // 9802 = Secret Egg
      // 9803 = Secret Garlic
      // 9804 = Secret Tomato
      // 9805 = Secret Queen
      type: 'AddedCombatant',
      netRegex: { npcNameId: '980[1-5]', capture: false },
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Dungeon Crew spawned, kill in order!',
        },
      },
    },
    // ---------------- final chamber boss: Goliath ----------------
    // Mechanical Blow - tankbuster?
    // Accelerate - stack?
    // Wellbore - PBAoE, leaves ground effect?
    // Compress - plus-shaped AoE?
    // Goliath's Javelin - summoned adds, cast Compress: front line AoE?
    // ---------------- alternate final chamber boss: Alichino ----------------
    // Knockout - tankbuster?
    // Heat Gaze (first variant) - front cleave?
    // Heat Gaze (second variant) - donut AoE?
    // Maniacal Laughter - summons orbs that move toward players and detonate after some time?
    // Slapstick - roomwide AoE
    // Alich - summoned adds, cast Heat Gaze (front cleave variation)
    // Ino - summoned adds, cast Heat Gaze (donut AoE variation)
  ],
};

export default triggerSet;
