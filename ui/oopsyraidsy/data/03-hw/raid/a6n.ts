import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

const triggerSet: OopsyTriggerSet<OopsyData> = {
  zoneId: ZoneId.AlexanderTheCuffOfTheSon,
  damageWarn: {
    'Minefield': '170D', // Circle AoE, mines.
    'Mine': '170E', // Mine explosion.
    'Supercharge': '1713', // Mirage charge.
    'Height Error': '171D', // Incorrect panel for Height.
    'Earth Missile': '1726', // Circle AoE, fire puddles.
  },
  damageFail: {
    'Ultra Flash': '1722', // Room-wide death AoE, if not LoS'd.
  },
  shareWarn: {
    'Ice Missile': '1727', // Ice headmarker AoE circles.
  },
  shareFail: {
    'Single Buster': '1717', // Single laser Attachment. Non-tanks are *probably* dead.
  },
  soloWarn: {
    'Double Buster': '1718', // Twin laser Attachment.
    'Enumeration': '171E', // Enumeration circle.
  },
};

export default triggerSet;
