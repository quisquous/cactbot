import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

// Titan Unreal
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheNavelUnreal,
  damageWarn: {
    'TitanUn Weight Of The Land': '58FE',
    'TitanUn Burst': '5ADF',
  },
  damageFail: {
    'TitanUn Landslide': '5ADC',
    'TitanUn Gaoler Landslide': '5902',
  },
  shareWarn: {
    'TitanUn Rock Buster': '58F6',
  },
  shareFail: {
    'TitanUn Mountain Buster': '58F7',
  },
};

export default triggerSet;
