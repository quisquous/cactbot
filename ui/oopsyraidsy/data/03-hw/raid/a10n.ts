import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.AlexanderTheBreathOfTheCreator,
  damageWarn: {
    'A10N Lamebrix Illuminati Hand Cannon': '1AD2', // Rectangle AoE
    'A10N Blizzard Arrow Frostbite': '1AC7', // Ice trap AoE on edges
    'A10N Weight Of The World Impact': '1AC6', // Mace traps in the center
    'A10N Gobpress Steam Roller': '1AB4', // Intermission Demon Wall AoE
    'A10N Lamebrix Gobswipe Conklops': '1ACB', // Single Charge dynamo/green
    'A10N Lamebrix Gobspin Whooshdrop': '1ACC', // Single Charge chariot/red
    'A10N Buzzsaw Laceration': '1AC8',
  },
  damageFail: {
    'A10N Goblin Of Fortune Gobbieboom': '1AD3', // Add enrage
  },
  gainsEffectWarn: {
    'A10N Electrocution': '120', // Arena danger walls
    'A10N Stab Wound': '45D', // Activation of the spike trap. (No info on who did it.)
  },
  shareWarn: {
    'A10N Lamebrix Gobslash Slicetops': '1AD1', // Stretchy tether AoE
    'A10N Lamebrix Critical Wrath': '1ACD', // Fire spread circles
  },
  soloWarn: {
    'A10N Lamebrix Bomb Toss': '1ACE', // Standard stack marker
  },
};

export default triggerSet;
