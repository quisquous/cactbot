import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

const triggerSet: OopsyTriggerSet<OopsyData> = {
  zoneId: ZoneId.AlexanderTheCuffOfTheSon,
  damageWarn: {
    'A6N Minefield': '170D', // Circle AoE, mines.
    'A6N Mine': '170E', // Mine explosion.
    'A6N Supercharge': '1713', // Mirage charge.
    'A6N Height Error': '171D', // Incorrect panel for Height.
    'A6N Earth Missile': '1726', // Circle AoE, fire puddles.
  },
  damageFail: {
    'A6N Ultra Flash': '1722', // Room-wide death AoE, if not LoS'd.
  },
  shareWarn: {
    'A6N Ice Missile': '1727', // Ice headmarker AoE circles.
  },
  shareFail: {
    'A6N Single Buster': '1717', // Single laser Attachment. Non-tanks are *probably* dead.
  },
  soloWarn: {
    'A6N Double Buster': '1718', // Twin laser Attachment.
    'A6N Enumeration': '171E', // Enumeration circle.
  },
};

export default triggerSet;
