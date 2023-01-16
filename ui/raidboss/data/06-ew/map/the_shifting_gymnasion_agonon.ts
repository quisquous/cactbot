import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// TODO: lesser summons
// TODO: greater summons
// TODO: elder summons
// TODO: Hippomenes (final summon)
// TODO: Phaethon (alternate final summon)

const agononOutputStrings = {
  spawn: {
    en: '${name} spawned!',
    de: '${name} erscheint!',
    cn: '已生成 ${name}!',
    ko: '${name} 등장!',
  },
  adds: {
    en: 'Adds soon',
    de: 'Bald Adds',
    cn: '小怪即将出现',
    ko: '곧 쫄 나옴',
  },
} as const;

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheShiftingGymnasionAgonon,

  triggers: [
    // ---------------- random treasure mobs ----------------
    {
      id: 'Shifting Gymnasion Agonon Gymnasiou Lampas Spawn',
      // 12034 = Gymnasiou Lampas
      type: 'AddedCombatant',
      netRegex: { npcNameId: '12034' },
      suppressSeconds: 1,
      infoText: (_data, matches, output) => output.spawn!({ name: matches.name }),
      outputStrings: {
        spawn: agononOutputStrings.spawn,
      },
    },
    {
      id: 'Shifting Gymnasion Agonon Gymnasiou Lyssa Spawn',
      // 12035 = Gymnasiou Lyssa
      type: 'AddedCombatant',
      netRegex: { npcNameId: '12035' },
      suppressSeconds: 1,
      infoText: (_data, matches, output) => output.spawn!({ name: matches.name }),
      outputStrings: {
        spawn: agononOutputStrings.spawn,
      },
    },
    {
      id: 'Shifting Gymnasion Agonon Gymnasiou Mandragorai Spawn',
      // 12036 = Gymnastic Onion
      // 12037 = Gymnastic Eggplant
      // 12038 = Gymnastic Garlic
      // 12039 = Gymnastic Tomato
      // 12040 = Gymnastic Queen
      type: 'AddedCombatant',
      netRegex: { npcNameId: ['1203[6-9]', '12040'], capture: false },
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Gymnasiou Mandragorai spawned, kill in order!',
        },
      },
    },
    // ---------------- lesser summons ----------------
    // Gymnasiou Leon
    // Gymnasiou Satyros
    // Gymnasiou Triton
    // Gymnasiou Tigris
    // Gymnasiou Megakantha: Odious Atmosphere - persistent front 180 channeled cleave
    // Gymnasiou Megakantha: Vine Whip - tankbuster
    // Gymnasiou Megakantha: Sludge Bomb - aoe under random player?
    // Gymnasiou Megakantha: Odious Air - front cone
    // ---------------- greater summons ----------------
    // Gymnasiou Styphnolobion: Earth Quaker - pboe followed by donut aoe; later does earthshakers simultaneously
    // Gymnasiou Styphnolobion: Rake - tankbuster
    // Gymnasiou Styphnolobion: Stone III - aoe under random players?
    // Gymnasiou Styphnolobion: Earth Shaker - earth shakers on random players
    // Gymnasiou Styphnolobion: Tiiimbeeer - raidwide
    // Gymnasiou Acheloios: Double Hammer - left/right or right/left cleaves
    // Gymnasiou Acheloios: Tail Swing - pbaoe
    // Gymnasiou Acheloios: Quadruple Hammer - 4x rotating left/right or right/left cleaves
    // Gymnasiou Acheloios: Left Hammer - 180 left cleave, used during Double/Quadruple Hammer
    // Gymnasiou Acheloios: Right Hammer - 180 right cleave, used during Double/Quadruple Hammer
    // Gymnasiou Acheloios: Deadly Hold - tankbuster
    // Gymnasiou Meganereis: Wave of Turmoil - knockback with 4x aoes on outside edge of arena
    // Gymnasiou Meganereis: Waterspout - aoe under random players?
    // Gymnasiou Meganereis: Falling Water - spread aoe on random players (simultaneous with Wave of Turmoil)
    // Gymnasiou Meganereis: Ceras - tankbuster w/ bleed
    // Gymnasiou Sphinx: Feather Wind - summons adds (Verdant Plume: cast Explosion - donut aoe)
    // Gymnasiou Sphinx: Fervid Pulse - large cross aoe
    // Gymnasiou Sphinx: Frigid Pulse - large donut aoe
    // Gymnasiou Sphinx: Feather Rain - spread aoe on all? players, simultaneous with Frigid Pulse
    // Gymnasiou Sphinx: Scratch - tankbuster
    // ---------------- elder summons ----------------
    // Lyssa Chrysine: Icicall - summons ice pillars
    // Lyssa Chrysine: Skull Dasher - tankbuster
    // Lyssa Chrysine: Howl - summons adds?
    // Lyssa Chrysine: Circle of Ice - donut aoe followed by pbaoe
    // Lyssa Chrysine: Heavy Smash - stack
    // Lyssa Chrysine: Frigid Stone - aoe under random players?
    // Lyssa Chrysine: Frigid Needle - pbaoe followed by donut aoe
    // Lampas Chrysine: Aetherial Light - front/back cones
    // Lampas Chrysine: Lightburst - tankbuster
    // Lampas Chrysine: Shine - aoe under random players?
    // Lampas Chrysine: Summon - summons adds (Gymnasiou Lampas)
    // Lampas Chrysine: Aetherial Light (alternate) - 3x rotating front/back cones
    {
      id: 'Shifting Gymnasion Agonon Gymnasiou Mandragoras Ram',
      type: 'StartsUsing',
      netRegex: { id: '7E29', source: 'Gymnasiou Mandragoras' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Shifting Gymnasion Agonon Gymnasiou Mandragoras Saibai Mandragora',
      type: 'StartsUsing',
      netRegex: { id: '7E2C', source: 'Gymnasiou Mandragoras', capture: false },
      infoText: (_data, _matches, output) => output.adds!(),
      outputStrings: {
        adds: agononOutputStrings.adds,
      },
    },
    // ---------------- final summon: Hippomenes ----------------
    // Hippomenes: Charge Blaster - applies 270 cone buffs to boss
    // Hippomenes: Dibrid Blaster - fires two 270 cones back-to-back, direction indicated by boss buffs from Charge Blaster
    // Hippomenes: Gouge - tankbuster
    // Hippomenes: Rumbling Thunder - aoe under random players?
    // Hippomenes: Electric Whisker - cardinal cones plus spread aoes on players?
    // Hippomenes: Tetrabrid Blaster - fires four 270 cones back-to-back, direction indicated by boss buffs from Charge Blaster
    // Hippomenes: Electric Burst - raidwide, summons adds (Ball of Levin: cast Shock - large pbaoe)
    // ---------------- alternate final summon: Phaethon ----------------
    // Phaethon: Illusive Fire - summons adds (Phantasmal Phaethon: cast Gallop - line aoe across arena)
    // Phaethon: Heat Blast - raidwide
    // Phaethon: Shining Sun - summons adds (Ball of Fire: cast Flame Blast - cross aoe)
    // Phaethon: Flare - two? flare markers on random? players
    // Phaethon: Flame Burst - tankbuster
    // Phaethon: Eruption - aoe under random players?
  ],
};

export default triggerSet;
