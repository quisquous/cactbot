import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

// Baelsar's Wall
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.BaelsarsWall,
  damageWarn: {
    'Baelsar 3rd Cohort Laquerius Overpower': '2D0', // Conal AoE, before boss 1
    'Baelsar 3rd Cohort Canis Pugnax Bellowing Grunt': '150', // Targeted circle AoE, before boss 1
    'Baelsar 3rd Cohort Signifier Dark Fire III': '519', // Targeted circle AoE, before boss 1

    'Baelsar Magitek Predator Magitek Ray': '1CB3', // Line AoE, boss 1

    'Baelsar Adamantite Claw Shred': '1257', // Rectangle AoE, before boss 2
    'Baelsar Magitek Colossus Exhaust': '593', // Line AoE, before boss 2
    'Baelsar Magitek Colossus Grand Sword': '126A', // Conal AoE, before boss 2

    'Baelsar Armored Weapon Dynamic Sensory Jammer': '1CBA', // Extreme Caution failure, boss 2
    'Baelsar Armored Weapon Diffractive Laser': '1CBB', // Targeted circle AoE, boss 2
    'Baelsar Magitek Bit Assault Cannon': '1CC0', // Checkerboard line AoEs, boss 2

    'Baelsar Magitek Gunship Carpet Bomb': '1CCF', // Targeted circle AoE, after boss 2
    'Baelsar Lance-Wielding Loyalist Heartstopper': '362', // Rectangle AoE, after boss 2

    'Baelsar The Griffin Sanguine Blade': '1CC5', // Arena cleave, boss 3
    'Baelsar Blade Of The Griffin Corrosion': '1CCC', // Circle AoE, boss 3
  },
  gainsEffectWarn: {
    'Baelsar The Griffin Accuracy Down': '1C', // Flash Powder failure, boss 3
  },
};

export default triggerSet;
