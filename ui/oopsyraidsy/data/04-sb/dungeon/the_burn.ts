import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheBurn,
  damageWarn: {
    'The Burn Falling Rock': '31A3', // Environmental line AoE
    'The Burn Aetherial Blast': '328B', // Line AoE, Kukulkan trash
    'The Burn Mole-a-whack': '328D', // Circle AoE, Desert Desman trash
    'The Burn Head Butt': '328E', // Small conal AoE, Desert Desman trash
    'The Burn Shardfall': '3191', // Roomwide AoE, LoS for safety, Hedetet, boss 1
    'The Burn Dissonance': '3192', // Donut AoE, Hedetet, boss 1
    'The Burn Crystalline Fracture': '3197', // Circle AoE, Dim Crystal, boss 1
    'The Burn Resonant Frequency': '3198', // Circle AoE, Dim Crystal, boss 1
    'The Burn Rotoswipe': '3291', // Frontal cone AoE, Charred Dreadnaught trash
    'The Burn Wrecking Ball': '3292', // Circle AoE, Charred Dreadnaught trash
    'The Burn Shatter': '3294', // Large circle AoE, Charred Doblyn trash
    'The Burn Auto-Cannons': '3295', // Line AoE, Charred Drone trash
    'The Burn Self-Detonate': '3296', // Circle AoE, Charred Drone trash
    'The Burn Full Throttle': '2D75', // Line AoE, Defective Drone, boss 2
    'The Burn Throttle': '2D76', // Line AoE, Mining Drone adds, boss 2
    'The Burn Adit Driver': '2D78', // Line AoE, Rock Biter adds, boss 2
    'The Burn Tremblor': '3297', // Large circle AoE, Veiled Gigaworm trash
    'The Burn Desert Spice': '3298', // The frontal cleaves must flow
    'The Burn Toxic Spray': '329A', // Frontal cone AoE, Gigaworm Stalker trash
    'The Burn Venom Spray': '329B', // Targeted circle AoE, Gigaworm Stalker trash
    'The Burn White Death': '3143', // Reactive during invulnerability, Mist Dragon, boss 3
    'The Burn Fog Plume 1': '3145', // Star AoE, Mist Dragon, boss 3
    'The Burn Fog Plume 2': '3146', // Line AoEs after stars, Mist Dragon, boss 3
    'The Burn Cauterize': '3148', // Line/Swoop AoE, Mist Dragon, boss 3
  },
  damageFail: {
    'The Burn Cold Fog': '3142', // Growing circle AoE, Mist Dragon, boss 3
  },
  gainsEffectWarn: {
    'The Burn Leaden': '43', // Puddle effect, boss 2. (Also inflicts 11F, Sludge.)
    'The Burn Puddle Frostbite': '11D', // Ice puddle effect, boss 3. (NOT the conal-inflicted one, 10C.)
  },
  shareWarn: {
    'The Burn Hailfire': '3194', // Head marker line AoE, Hedetet, boss 1
    'The Burn Shardstrike': '3195', // Orange spread head markers, Hedetet, boss 1
    'The Burn Chilling Aspiration': '314D', // Head marker cleave, Mist Dragon, boss 3
    'The Burn Frost Breath': '314C', // Tank cleave, Mist Dragon, boss 3
  },
};

export default triggerSet;
