import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

// Titan Story Mode
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheNavel,
  damageWarn: {
    'TitanNm Weight Of The Land': '3CD',
  },
  damageFail: {
    'TitanNm Landslide': '28A',
  },
  shareWarn: {
    'TitanNm Rock Buster': '281',
  },
};

export default triggerSet;
