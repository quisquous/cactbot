import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

// Susano Normal
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.ThePoolOfTribute,
  damageWarn: {
    'Susano Rasen Kaikyo': '201E', // circles
    'Susano Seasplitter 1': '2028', // knockback + skinny line safe zone
    'Susano Seasplitter 2': '2029', // knockback + skinny line safe zone
    'Susano Seasplitter 3': '202A', // knockback + skinny line safe zone
    'Susano Seasplitter 4': '202B', // knockback + skinny line safe zone
    'Susano Dark Cloud The Parting Clouds': '259F', // purple line aoes from clouds
  },
  damageFail: {
    'Susano Ame-No-Murakumo': '218C', // standing in the red line after midphase
    'Susano Ama-No-Iwato The Sealed Gate': '2025', // not killing the rock jails in time
  },
  shareWarn: {
    'Susano Dark Levin Shock': '2043', // orbs during midphase
    'Susano Stormsplitter': '2023', // tank buster cleave
  },
  soloWarn: {
    'Susano Brightstorm': '2020', // stack marker
  },
};

export default triggerSet;
