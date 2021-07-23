import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

// Susano Extreme
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.ThePoolOfTributeExtreme,
  damageWarn: {
    'SusEx Churning': '203F',
  },
  damageFail: {
    'SusEx Rasen Kaikyo': '202E',
  },
};

export default triggerSet;
