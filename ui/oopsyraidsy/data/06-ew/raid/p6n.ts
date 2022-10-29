import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.AbyssosTheSixthCircle,
  damageWarn: {
    'P6N Polyominous Dark IV': '7855', // Radiating AoEs from totems
    'P6N Choros Ixou Front Back': '7859',
    'P6N Choros Ixou Sides': '785A',
    'P6N Reek Havoc': '79ED', // Parasite conal
    'P6N Pathogenic Cells': '7A14', // Front portion of Strophe Ixou spinny conal
    'P6N Chelic Vector': '7A15', // Rear portion of Strophe Ixou spinny conal
  },
  shareWarn: {
    'P6N Dark Ashes': '785F', // Orange spread circles
  },
  shareFail: {
    'P6N Synergy 1': '785C', // Off-tank buster
    'P6N Synergy 2': '785D', // Main tank buster (Square, why??)
  },
};

export default triggerSet;
