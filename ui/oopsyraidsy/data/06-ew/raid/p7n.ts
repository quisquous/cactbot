import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.AbyssosTheSeventhCircle,
  damageWarn: {
    'P7N Bough Of Attis Out': '77FA',
    'P7N Bough Of Attis In': '77FF',
    'P7N Bough Of Attis Sides': '77FD',
    'P7N Hemitheos Glare III 1': '77F8', // Donut attack alongside Hemitheos's Holy
    'P7N Hemitheos Glare III 2': '79FA', // Donut attack alongside platform regeneration
    'P7N Static Moon': '7802', // Behemoths' chariot attack
    'P7N Stymphalian Strike': '7803', // Birds' line attack
    'P7N Big Burst': '783E', // Missed tower
    'P7N Blades Of Attis Stationary': '7805', // Exaflare initial hit
    'P7N Blades Of Attis Exaflares': '7806',
  },
  shareWarn: {
    'P7N Hemitheos Holy': '7808', // Purple spread circles
  },
  shareFail: {
    'P7N Hemitheos Aero II': '780A', // Tank cleave
  },
};

export default triggerSet;
