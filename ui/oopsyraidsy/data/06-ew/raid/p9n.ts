import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

// TODO: Standing in the puddles left from Charybdis

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.AnabaseiosTheNinthCircle,
  damageWarn: {
    'P9N Blizzard III (Large)': '811F',
    'P9N Blizzard III (Small)': '8121',
    'P9N Swinging Kick (Front Combination) ': '812D',
    'P9N Swinging Kick (Rear Combination)': '812E',
    'P9N Archaic Rockbreaker': '812A',
    'P9N Ice Sphere Shatter (Large)': '86E5',
    'P9N Ice Sphere Shatter (Small)': '86E4',
    'P9N Fire Sphere Explosion (Large)': '86E3',
    'P9N Fire Sphere Explosion (Small)': '86E2',
  },
  shareWarn: {
    'P9N Fire III, large': '8120',
    'P9N Fire III, small': '811E',
  },
  soloWarn: {
    'P9N Pulverizing Pounce': '813F',
  },
};

export default triggerSet;
