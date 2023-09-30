import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTrigger, OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

// For reasons not completely understood at the time this was merged,
// but likely related to the fact that no nameplates are visible during the encounter,
// and that nothing in the encounter actually does damage,
// we can't use damageWarn or gainsEffect helpers on the Bardam fight.
// Instead, we use this helper function to look for failure flags.
// If the flag is present,a full trigger object is returned that drops in seamlessly.
const abilityWarn = (args: { abilityId: string; id: string }): OopsyTrigger<Data> => {
  if (!args.abilityId)
    console.error(`Missing ability ${JSON.stringify(args)}`);
  const trigger: OopsyTrigger<Data> = {
    id: args.id,
    type: 'Ability',
    netRegex: NetRegexes.abilityFull({ id: args.abilityId }),
    condition: (_data, matches) => matches.flags.endsWith('0E'),
    mistake: (_data, matches) => {
      return {
        type: 'warn',
        blame: matches.target,
        reportId: matches.targetId,
        text: matches.ability,
      };
    },
  };
  return trigger;
};

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.BardamsMettle63,
  damageWarn: {
    'Bardam63 Dirty Claw': '21A8', // Frontal cleave, Gulo Gulo trash
    'Bardam63 Epigraph': '23AF', // Line AoE, Wall of Bardam trash
    'Bardam63 The Dusk Star': '2187', // Circle AoE, environment before first boss
    'Bardam63 The Dawn Star': '2186', // Circle AoE, environment before first boss
    'Bardam63 Crumbling Crust': '1F13', // Circle AoEs, Garula, first boss
    'Bardam63 Ram Rush': '1EFC', // Line AoEs, Steppe Yamaa, first boss.
    'Bardam63 Lullaby': '24B2', // Circle AoEs, Steppe Sheep, first boss.
    'Bardam63 Heave': '1EF7', // Frontal cleave, Garula, first boss
    'Bardam63 Wide Blaster': '24B3', // Enormous frontal cleave, Steppe Coeurl, first boss
    'Bardam63 Double Smash': '26A', // Circle AoE, Mettling Dhara trash
    'Bardam63 Transonic Blast': '1262', // Circle AoE, Steppe Eagle trash
    'Bardam63 Wild Horn': '2208', // Frontal cleave, Khun Gurvel trash
    'Bardam63 Heavy Strike 1': '2578', // 1 of 3 270-degree ring AoEs, Bardam, second boss
    'Bardam63 Heavy Strike 2': '2579', // 2 of 3 270-degree ring AoEs, Bardam, second boss
    'Bardam63 Heavy Strike 3': '257A', // 3 of 3 270-degree ring AoEs, Bardam, second boss
    'Bardam63 Tremblor 1': '257B', // 1 of 2 concentric ring AoEs, Bardam, second boss
    'Bardam63 Tremblor 2': '257C', // 2 of 2 concentric ring AoEs, Bardam, second boss
    'Bardam63 Throwing Spear': '257F', // Checkerboard AoE, Throwing Spear, second boss
    'Bardam63 Bardam\'s Ring': '2581', // Donut AoE headmarkers, Bardam, second boss
    'Bardam63 Comet': '257D', // Targeted circle AoEs, Bardam, second boss
    'Bardam63 Comet Impact': '2580', // Circle AoEs, Star Shard, second boss
    'Bardam63 Iron Sphere Attack': '16B6', // Contact damage, Iron Sphere trash, before third boss
    'Bardam63 Tornado': '247E', // Circle AoE, Khun Shavara trash
    'Bardam63 Pinion': '1F11', // Line AoE, Yol Feather, third boss
    'Bardam63 Feather Squall': '1F0E', // Dash attack, Yol, third boss
    'Bardam63 Flutterfall Untargeted': '1F12', // Rotating circle AoEs, Yol, third boss
  },
  gainsEffectWarn: {
    'Bardam63 Confused': '0B', // Failed gaze attack, Yol, third boss
  },
  gainsEffectFail: {
    'Bardam63 Fetters': '56F', // Failing two mechanics in any one phase on Bardam, second boss.
  },
  shareWarn: {
    'Bardam63 Garula Rush': '1EF9', // Line AoE, Garula, first boss.
    'Bardam63 Flutterfall Targeted': '1F0C', // Circle AoE headmarker, Yol, third boss
    'Bardam63 Wingbeat': '1F0F', // Conal AoE headmarker, Yol, third boss
  },
  triggers: [
    // 1 of 3 270-degree ring AoEs, Bardam, second boss
    abilityWarn({ id: 'Bardam63 Heavy Strike 1', abilityId: '2578' }),
    // 2 of 3 270-degree ring AoEs, Bardam, second boss
    abilityWarn({ id: 'Bardam63 Heavy Strike 2', abilityId: '2579' }),
    // 3 of 3 270-degree ring AoEs, Bardam, second boss
    abilityWarn({ id: 'Bardam63 Heavy Strike 3', abilityId: '257A' }),
    // 1 of 2 concentric ring AoEs, Bardam, second boss
    abilityWarn({ id: 'Bardam63 Tremblor 1', abilityId: '257B' }),
    // 2 of 2 concentric ring AoEs, Bardam, second boss
    abilityWarn({ id: 'Bardam63 Tremblor 2', abilityId: '257C' }),
    // Checkerboard AoE, Throwing Spear, second boss
    abilityWarn({ id: 'Bardam63 Throwing Spear', abilityId: '257F' }),
    // Gaze attack, Warrior of Bardam, second boss
    abilityWarn({ id: 'Bardam63 Empty Gaze', abilityId: '1F04' }),
    // Donut AoE headmarkers, Bardam, second boss
    abilityWarn({ id: 'Bardam63\'s Ring', abilityId: '2581' }),
    // Targeted circle AoEs, Bardam, second boss
    abilityWarn({ id: 'Bardam63 Comet', abilityId: '257D' }),
    // Circle AoEs, Star Shard, second boss
    abilityWarn({ id: 'Bardam63 Comet Impact', abilityId: '2580' }),
  ],
};

export default triggerSet;
