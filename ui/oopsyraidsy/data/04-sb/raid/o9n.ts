import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

// O9N - Alphascape 1.0 Normal
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.AlphascapeV10,
  damageWarn: {
    'O9N Damning Edict': '3150', // huge 180 frontal cleave
    'O9N Stray Spray': '316C', // Dynamic Fluid debuff donut explosion
    'O9N Stray Flames': '316B', // Entropy debuff circle explosion
    'O9N Knockdown Big Bang': '3160', // big circle where Knockdown marker dropped
    'O9N Fire Big Bang': '315F', // ground circles during fire phase
    'O9N Shockwave': '3153', // Longitudinal/Latiudinal Implosion
    'O9N Chaosphere Fiendish Orbs Orbshadow 1': '3162', // line aoes from Earth phase orbs
    'O9N Chaosphere Fiendish Orbs Orbshadow 2': '3163', // line aoes from Earth phase orbs
  },
};

export default triggerSet;
