import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';

// Bardam's Mettle


// For reasons not completely understood at the time this was merged,
// but likely related to the fact that no nameplates are visible during the encounter,
// and that nothing in the encounter actually does damage,
// we can't use damageWarn or gainsEffect helpers on the Bardam fight.
// Instead, we use this helper function to look for failure flags.
// If the flag is present,a full trigger object is returned that drops in seamlessly.
const abilityWarn = (args) => {
  if (!args.abilityId)
    console.error('Missing ability ' + JSON.stringify(args));
  return {
    id: args.id,
    netRegex: NetRegexes.abilityFull({ id: args.abilityId }),
    condition: (_e, _data, matches) => matches.flags.substr(-2) === '0E',
    mistake: (_e, _data, matches) => {
      return { type: 'warn', blame: matches.target, text: matches.ability };
    },
  };
};

export default {
  zoneId: ZoneId.BardamsMettle,
  damageWarn: {
    'Bardam Dirty Claw': '21A8', // Frontal cleave, Gulo Gulo trash
    'Bardam Epigraph': '23AF', // Line AoE, Wall of Bardam trash
    'Bardam The Dusk Star': '2187', // Circle AoE, environment before first boss
    'Bardam The Dawn Star': '2186', // Circle AoE, environment before first boss
    'Bardam Crumbling Crust': '1F13', // Circle AoEs, Garula, first boss
    'Bardam Ram Rush': '1EFC', // Line AoEs, Steppe Yamaa, first boss.
    'Bardam Lullaby': '24B2', // Circle AoEs, Steppe Sheep, first boss.
    'Bardam Heave': '1EF7', // Frontal cleave, Garula, first boss
    'Bardam Wide Blaster': '24B3', // Enormous frontal cleave, Steppe Coeurl, first boss
    'Bardam Double Smash': '26A', // Circle AoE, Mettling Dhara trash
    'Bardam Transonic Blast': '1262', // Circle AoE, Steppe Eagle trash
    'Bardam Wild Horn': '2208', // Frontal cleave, Khun Gurvel trash
    'Bardam Heavy Strike 1': '2578', // 1 of 3 270-degree ring AoEs, Bardam, second boss
    'Bardam Heavy Strike 2': '2579', // 2 of 3 270-degree ring AoEs, Bardam, second boss
    'Bardam Heavy Strike 3': '257A', // 3 of 3 270-degree ring AoEs, Bardam, second boss
    'Bardam Tremblor 1': '257B', // 1 of 2 concentric ring AoEs, Bardam, second boss
    'Bardam Tremblor 2': '257C', // 2 of 2 concentric ring AoEs, Bardam, second boss
    'Bardam Throwing Spear': '257F', // Checkerboard AoE, Throwing Spear, second boss
    'Bardam Bardam\'s Ring': '2581', // Donut AoE headmarkers, Bardam, second boss
    'Bardam Comet': '257D', // Targeted circle AoEs, Bardam, second boss
    'Bardam Comet Impact': '2580', // Circle AoEs, Star Shard, second boss
    'Bardam Iron Sphere Attack': '16B6', // Contact damage, Iron Sphere trash, before third boss
    'Bardam Tornado': '247E', // Circle AoE, Khun Shavara trash
    'Bardam Pinion': '1F11', // Line AoE, Yol Feather, third boss
    'Bardam Feather Squall': '1F0E', // Dash attack, Yol, third boss
    'Bardam Flutterfall Untargeted': '1F12', // Rotating circle AoEs, Yol, third boss
  },
  shareWarn: {
    'Bardam Garula Rush': '1EF9', // Line AoE, Garula, first boss.
    'Bardam Flutterfall Targeted': '1F0C', // Circle AoE headmarker, Yol, third boss
    'Bardam Wingbeat': '1F0F', // Conal AoE headmarker, Yol, third boss
  },
  gainsEffectWarn: {
    'Bardam Confused': '0B', // Failed gaze attack, Yol, third boss
  },
  gainsEffectFail: {
    'Bardam Fetters': '56F', // Failing two mechanics in any one phase on Bardam, second boss.
  },
  triggers: [
    // 1 of 3 270-degree ring AoEs, Bardam, second boss
    abilityWarn({ id: 'Bardam Heavy Strike 1', abilityId: '2578' }),
    // 2 of 3 270-degree ring AoEs, Bardam, second boss
    abilityWarn({ id: 'Bardam Heavy Strike 2', abilityId: '2579' }),
    // 3 of 3 270-degree ring AoEs, Bardam, second boss
    abilityWarn({ id: 'Bardam Heavy Strike 3', abilityId: '257A' }),
    // 1 of 2 concentric ring AoEs, Bardam, second boss
    abilityWarn({ id: 'Bardam Tremblor 1', abilityId: '257B' }),
    // 2 of 2 concentric ring AoEs, Bardam, second boss
    abilityWarn({ id: 'Bardam Tremblor 2', abilityId: '257C' }),
    // Checkerboard AoE, Throwing Spear, second boss
    abilityWarn({ id: 'Bardam Throwing Spear', abilityId: '257F' }),
    // Gaze attack, Warrior of Bardam, second boss
    abilityWarn({ id: 'Bardam Empty Gaze', abilityId: '1F04' }),
    // Donut AoE headmarkers, Bardam, second boss
    abilityWarn({ id: 'Bardam\'s Ring', abilityId: '2581' }),
    // Targeted circle AoEs, Bardam, second boss
    abilityWarn({ id: 'Bardam Comet', abilityId: '257D' }),
    // Circle AoEs, Star Shard, second boss
    abilityWarn({ id: 'Bardam Comet Impact', abilityId: '2580' }),
  ],
};
