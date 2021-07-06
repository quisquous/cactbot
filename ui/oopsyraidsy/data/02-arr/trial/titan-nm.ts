import ZoneId from '../../../../../resources/zone_id';
import { SimpleOopsyTriggerSet } from '../../../../../types/oopsy';

// Titan Story Mode
const triggerSet: SimpleOopsyTriggerSet = {
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
