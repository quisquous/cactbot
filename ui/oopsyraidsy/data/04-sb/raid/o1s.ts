import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

// O1S - Deltascape 1.0 Savage
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.DeltascapeV10Savage,
  damageWarn: {
    'O1S Turbulence': '2584', // standing under the boss before downburst
    'O1S Ball Of Fire Burn': '1ECB', // fireball explosion
  },
  damageFail: {
    'O1S Clamp': '1EDE', // large frontal line aoe
  },
  shareWarn: {
    'O1S Levinbolt': '1ED2', // lightning spread
  },
};

export default triggerSet;
