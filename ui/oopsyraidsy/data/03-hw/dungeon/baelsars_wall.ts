import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

// Baelsar's Wall
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.BaelsarsWall,
  damageWarn: {
    'Baelsar Overpower': '2D0', // Conal AoE, 3rd Cohort Laquerius trash, before boss 1
    'Baelsar Bellowing Grunt': '150', // Targeted circle AoE, 3rd Cohort Canis Pugnax trash, before boss 1
    'Baelsar Dark Fire III': '519', // Targeted circle AoE, 3rd Cohort Signifier trash, before boss 1

    'Baelsar Magitek Ray': '1CB3', // Line AoE, Magitek Predator, boss 1

    'Baelsar Shred': '1257', // Rectangle AoE, Adamantite Claw trash, before boss 2
    'Baelsar Exhaust': '593', // Line AoE, Magitek Colossus trash, before boss 2
    'Baelsar Grand Sword': '126A', // Conal AoE, Magitek Colossus trash, before boss 2

    'Baelsar Dynamic Sensory Jammer': '1CBA', // Extreme Caution failure, boss 2
    'Baelsar Diffractive Laser': '1CBB', // Targeted circle AoE, Armored Weapon, boss 2
    'Baelsar Assault Cannon': '1CC0', // Checkerboard line AoEs, Magitek Bit, boss 2

    'Baelsar Carpet Bomb': '1CCF', // Targeted circle AoE, Magitek Gunship trash, after boss 2
    'Baelsar Heartstopper': '362', // Rectangle AoE, Lance-Wielding Loyalist trash, after boss 2

    'Baelsar Sanguine Blade': '1CC5', // Arena cleave, The Griffin, boss 3
    'Baelsar Corrosion': '1CCC', // Circle AoE, Blade of the Griffin, boss 3
  },
  gainsEffectWarn: {
    'Baelsar Accuracy Down': '1C', // Flash Powder failure, boss 3
  },
};

export default triggerSet;
