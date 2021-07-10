import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

// O1N - Deltascape 1.0 Normal
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.DeltascapeV10,
  damageWarn: {
    'O1N Burn': '23D5', // Fireball explosion circle AoEs
    'O1N Clamp': '23E2', // Frontal rectangle knockback AoE, Alte Roite
  },
  shareWarn: {
    'O1N Levinbolt': '23DA', // small spread circles
  },
};

export default triggerSet;
