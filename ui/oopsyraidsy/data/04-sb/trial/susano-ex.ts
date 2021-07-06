import ZoneId from '../../../../../resources/zone_id';
import { SimpleOopsyTriggerSet } from '../../../../../types/oopsy';

export { OopsyData as Data } from '../../../../../types/data';

// Susano Extreme
const triggerSet: SimpleOopsyTriggerSet = {
  zoneId: ZoneId.ThePoolOfTributeExtreme,
  damageWarn: {
    'SusEx Churning': '203F',
  },
  damageFail: {
    'SusEx Rasen Kaikyo': '202E',
  },
};

export default triggerSet;
