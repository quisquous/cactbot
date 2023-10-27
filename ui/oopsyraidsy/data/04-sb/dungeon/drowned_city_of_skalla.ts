import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheDrownedCityOfSkalla,
  damageWarn: {
    'Skalla Hydrocannon': '2697', // Line AoE, Salt Swallow trash, before boss 1
    'Skalla Stagnant Spray': '2699', // Conal AoE, Skalla Nanka trash, before boss 1

    'Skalla Bubble Burst': '261B', // Bubble explosion, Hydrosphere, boss 1

    'Skalla Plain Pound': '269A', // Large circle AoE, Dhara Sentinel trash, before boss 2
    'Skalla Boulder Toss': '269B', // Small circle AoE, Stone Phoebad trash, before boss 2
    'Skalla Landslip': '269C', // Conal AoE, Stone Phoebad trash, before boss 2

    'Skalla Mystic Light': '2657', // Conal AoE, The Old One, boss 2
    'Skalla Mystic Flame': '2659', // Large circle AoE, The Old One, boss 2. 2658 is the cast-time ability.

    'Skalla Dark II': '110E', // Thin cone AoE, Lightless Homunculus trash, after boss 2
    'Skalla Implosive Curse': '269E', // Conal AoE, Zangbeto trash, after boss 2
    'Skalla Undying FIre': '269F', // Circle AoE, Zangbeto trash, after boss 2
    'Skalla Fire II': '26A0', // Circle AoE, Accursed Idol trash, after boss 2

    'Skalla Rusting Claw': '2661', // Frontal cleave, Hrodric Poisontongue, boss 3
    'Skalla Words Of Woe': '2662', // Eye lasers, Hrodric Poisontongue, boss 3
    'Skalla Tail Drive': '2663', // Rear cleave, Hrodric Poisontongue, boss 3
    'Skalla Ring Of Chaos': '2667', // Ring headmarker, Hrodric Poisontongue, boss 3
  },
  damageFail: {
    'Skalla Self-Detonate': '265C', // Roomwide explosion, Subservient, boss 2
  },
  gainsEffectWarn: {
    'Skalla Dropsy': '11B', // Standing in Bloody Puddles, or being knocked outside the arena, boss 1
    'Skalla Confused': '0B', // Failing the gaze attack, boss 3
  },
  shareWarn: {
    'Skalla Bloody Puddle': '2655', // Large watery spread circles, Kelpie, boss 1
    'Skalla Cross Of Chaos': '2668', // Cross headmarker, Hrodric Poisontongue, boss 3
    'Skalla Circle Of Chaos': '2669', // Spread circle headmarker, Hrodric Poisontongue, boss 3
  },
};

export default triggerSet;
