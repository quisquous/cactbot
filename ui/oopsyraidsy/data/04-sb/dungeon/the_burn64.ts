import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheBurn64,
  damageWarn: {
    'TheBurn64 Falling Rock': '31A3', // Environmental line AoE
    'TheBurn64 Aetherial Blast': '328B', // Line AoE, Kukulkan trash
    'TheBurn64 Mole-a-whack': '328D', // Circle AoE, Desert Desman trash
    'TheBurn64 Head Butt': '328E', // Small conal AoE, Desert Desman trash
    'TheBurn64 Shardfall': '3191', // Roomwide AoE, LoS for safety, Hedetet, boss 1
    'TheBurn64 Dissonance': '3192', // Donut AoE, Hedetet, boss 1
    'TheBurn64 Crystalline Fracture': '3197', // Circle AoE, Dim Crystal, boss 1
    'TheBurn64 Resonant Frequency': '3198', // Circle AoE, Dim Crystal, boss 1
    'TheBurn64 Rotoswipe': '3291', // Frontal cone AoE, Charred Dreadnaught trash
    'TheBurn64 Wrecking Ball': '3292', // Circle AoE, Charred Dreadnaught trash
    'TheBurn64 Shatter': '3294', // Large circle AoE, Charred Doblyn trash
    'TheBurn64 Auto-Cannons': '3295', // Line AoE, Charred Drone trash
    'TheBurn64 Self-Detonate': '3296', // Circle AoE, Charred Drone trash
    'TheBurn64 Full Throttle': '2D75', // Line AoE, Defective Drone, boss 2
    'TheBurn64 Throttle': '2D76', // Line AoE, Mining Drone adds, boss 2
    'TheBurn64 Adit Driver': '2D78', // Line AoE, Rock Biter adds, boss 2
    'TheBurn64 Tremblor': '3297', // Large circle AoE, Veiled Gigaworm trash
    'TheBurn64 Desert Spice': '3298', // The frontal cleaves must flow
    'TheBurn64 Toxic Spray': '329A', // Frontal cone AoE, Gigaworm Stalker trash
    'TheBurn64 Venom Spray': '329B', // Targeted circle AoE, Gigaworm Stalker trash
    'TheBurn64 White Death': '3143', // Reactive during invulnerability, Mist Dragon, boss 3
    'TheBurn64 Fog Plume 1': '3145', // Star AoE, Mist Dragon, boss 3
    'TheBurn64 Fog Plume 2': '3146', // Line AoEs after stars, Mist Dragon, boss 3
    'TheBurn64 Cauterize': '3148', // Line/Swoop AoE, Mist Dragon, boss 3
  },
  damageFail: {
    'TheBurn64 Cold Fog': '3142', // Growing circle AoE, Mist Dragon, boss 3
  },
  gainsEffectWarn: {
    'TheBurn64 Leaden': '43', // Puddle effect, boss 2. (Also inflicts 11F, Sludge.)
    'TheBurn64 Puddle Frostbite': '11D', // Ice puddle effect, boss 3. (NOT the conal-inflicted one, 10C.)
  },
  shareWarn: {
    'TheBurn64 Hailfire': '3194', // Head marker line AoE, Hedetet, boss 1
    'TheBurn64 Shardstrike': '3195', // Orange spread head markers, Hedetet, boss 1
    'TheBurn64 Chilling Aspiration': '314D', // Head marker cleave, Mist Dragon, boss 3
    'TheBurn64 Frost Breath': '314C', // Tank cleave, Mist Dragon, boss 3
  },
};

export default triggerSet;
