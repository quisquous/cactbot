import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

// Titan Hard
const triggerSet: OopsyTriggerSet<Data> = {
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
