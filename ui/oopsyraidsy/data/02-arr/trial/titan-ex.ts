import ZoneId from '../../../../../resources/zone_id';
import { SimpleOopsyTriggerSet } from '../../../../../types/oopsy';

// Titan Extreme
const triggerSet: SimpleOopsyTriggerSet = {
  zoneId: ZoneId.TheNavelExtreme,
  damageWarn: {
    'TitanEx Weight Of The Land': '5BE',
    'TitanEx Burst': '5BF',
  },
  damageFail: {
    'TitanEx Landslide': '5BB',
    'TitanEx Gaoler Landslide': '5C3',
  },
  shareWarn: {
    'TitanEx Rock Buster': '5B7',
  },
  shareFail: {
    'TitanEx Mountain Buster': '5B8',
  },
};

export default triggerSet;
