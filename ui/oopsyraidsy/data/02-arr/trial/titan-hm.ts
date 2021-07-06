import ZoneId from '../../../../../resources/zone_id';
import { SimpleOopsyTriggerSet } from '../../../../../types/oopsy';

export { OopsyData as Data } from '../../../../../types/data';

// Titan Hard
const triggerSet: SimpleOopsyTriggerSet = {
  zoneId: ZoneId.TheNavelHard,
  damageWarn: {
    'TitanHm Weight Of The Land': '553',
    'TitanHm Burst': '41C',
  },
  damageFail: {
    'TitanHm Landslide': '554',
  },
  shareWarn: {
    'TitanHm Rock Buster': '550',
  },
  shareFail: {
    'TitanHm Mountain Buster': '283',
  },
};

export default triggerSet;
