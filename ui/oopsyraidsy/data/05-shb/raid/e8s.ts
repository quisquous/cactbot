import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

// TODO: rush hitting the crystal
// TODO: adds not being killed
// TODO: taking the rush twice (when you have debuff)
// TODO: not hitting the dragon four times during wyrm's lament
// TODO: death reasons for not picking up puddle
// TODO: not being in the tower when you should
// TODO: picking up too many stacks

// Note: Banish III (4DA8) and Banish Iii Divided (4DA9) both are type=0x16 lines.
// The same is true for Banish (4DA6) and Banish Divided (4DA7).
// I'm not sure this makes any sense? But can't tell if the spread was a mistake or not.
// Maybe we could check for "Magic Vulnerability Up"?

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.EdensVerseRefulgenceSavage,
  damageWarn: {
    'E8S Biting Frost': '4D66', // 270-degree frontal AoE, Shiva
    'E8S Driving Frost': '4D67', // Rear cone AoE, Shiva
    'E8S Axe Kick': '4D6D', // Large circle AoE, Shiva
    'E8S Scythe Kick': '4D6E', // Donut AoE, Shiva
    'E8S Reflected Axe Kick': '4DB9', // Large circle AoE, Frozen Mirror
    'E8S Reflected Scythe Kick': '4DBA', // Donut AoE, Frozen Mirror
    'E8S Frigid Eruption': '4D9F', // Small circle AoE puddles, phase 1
    'E8S Frigid Needle': '4D9D', // 8-way "flower" explosion
    'E8S Icicle Impact': '4DA0', // Large circle AoE puddles, phase 1
    'E8S Reflected Biting Frost 1': '4DB7', // 270-degree frontal AoE, Frozen Mirror
    'E8S Reflected Biting Frost 2': '4DC3', // 270-degree frontal AoE, Frozen Mirror
    'E8S Reflected Driving Frost 1': '4DB8', // Cone AoE, Frozen Mirror
    'E8S Reflected Driving Frost 2': '4DC4', // Cone AoE, Frozen Mirror

    'E8S Hallowed Wings 1': '4D75', // Left cleave
    'E8S Hallowed Wings 2': '4D76', // Right cleave
    'E8S Hallowed Wings 3': '4D77', // Knockback frontal cleave
    'E8S Reflected Hallowed Wings 1': '4D90', // Reflected left 2
    'E8S Reflected Hallowed Wings 2': '4DBB', // Reflected left 1
    'E8S Reflected Hallowed Wings 3': '4DC7', // Reflected right 2
    'E8S Reflected Hallowed Wings 4': '4D91', // Reflected right 1
    'E8S Twin Stillness 1': '4D68',
    'E8S Twin Stillness 2': '4D6B',
    'E8S Twin Silence 1': '4D69',
    'E8S Twin Silence 2': '4D6A',
    'E8S Akh Rhai': '4D99',
    'E8S Embittered Dance 1': '4D70',
    'E8S Embittered Dance 2': '4D71',
    'E8S Spiteful Dance 1': '4D6F',
    'E8S Spiteful Dance 2': '4D72',
  },
  damageFail: {
    // Broken tether.
    'E8S Refulgent Fate': '4DA4',
    // Shared orb, correct is Bright Pulse (4D95)
    'E8S Blinding Pulse': '4D96',
  },
  shareFail: {
    'E8S Path of Light': '4DA1', // Protean
  },
  triggers: [
    {
      id: 'E8S Shining Armor',
      type: 'GainsEffect',
      // Stun
      netRegex: NetRegexes.gainsEffect({ effectId: '95' }),
      mistake: (_data, matches) => {
        return { type: 'fail', blame: matches.target, text: matches.effect };
      },
    },
    {
      // Interrupt
      id: 'E8S Stoneskin',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '4D85' }),
      mistake: (_data, matches) => {
        return { type: 'fail', blame: matches.target, text: matches.ability };
      },
    },
  ],
};

export default triggerSet;
