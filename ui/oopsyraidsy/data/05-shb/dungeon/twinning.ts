import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheTwinning,
  damageWarn: {
    'Twinning Auto Cannons': '43A9',
    'Twinning Heave': '3DB9',
    'Twinning 32 Tonze Swipe': '3DBB',
    'Twinning Sideswipe': '3DBF',
    'Twinning Wind Spout': '3DBE',
    'Twinning Shock': '3DF1',
    'Twinning Laserblade': '3DEC',
    'Twinning Vorpal Blade': '3DC2',
    'Twinning Thrown Flames': '3DC3',
    'Twinning Magitek Ray': '3DF3',
    'Twinning High Gravity': '3DFA',
  },
  damageFail: {
    'Twinning 128 Tonze Swipe': '3DBA',
  },
};

export default triggerSet;
