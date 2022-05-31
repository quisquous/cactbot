import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export interface Data extends OopsyData {
  assault?: string[];
}

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.AlexanderTheArmOfTheFather,
  damageWarn: {
    'A3N Protean Wave': '12F0',
    'A3N Sluice Puddles': '12F4', // Puddle AoEs
    'A3N Ultramagnetism': '1308', // Attracting magnets too close
    'A3N Current Leakeage 1': '130C', // Gear Lubricant escaping
    'A3N Current Leakeage 2': '130D', // Piston Lubricant escaping
  },
  gainsEffectWarn: {
    'A3N Electrocution': '120', // Arena edge debuff. (Also paralysis and stun.)
    'A3N Dropsy': '121', // Water puddle debuff. (Tornado and final phase.)
  },
  shareWarn: {
    'A3N Fluid Swing 1': '12EE', // Tank cleave, no debuff
    'A3N Fluid Swing 2': '12F5', // Tank cleave, blunt resistance down debuff
    'A3N Fluid Strike 1': '12FD', // Tank cleave, no debuff
    'A3N Fluid Strike 2': '12FE', // Tank cleave, blunt resistance down debuff
  },
};

export default triggerSet;
