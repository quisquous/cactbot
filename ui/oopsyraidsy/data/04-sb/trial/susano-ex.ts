import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

// TODO: Electrocution (203D) comes from the levinbolt not moving
// We could blame the person with 006E and blame the person hit with 006F (the stun)?
// TODO: add death reason for Sinking (4F9) effect?

export type Data = OopsyData;

// Susano Extreme
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.ThePoolOfTributeExtreme,
  damageWarn: {
    'SusanoEx Seasplitter 1': '2038', // knockback + skinny line safe zone
    'SusanoEx Seasplitter 2': '2039', // knockback + skinny line safe zone
    'SusanoEx Seasplitter 3': '203A', // knockback + skinny line safe zone
    'SusanoEx Seasplitter 4': '203B', // knockback + skinny line safe zone
    'SusanoEx Rasen Kaikyo': '202E', // circles
    'SusanoEx Churning': '203F', // not stopping
    'SusanoEx Thunderhead The Parting Clouds': '2041', // purple lightning line
  },
  damageFail: {
    'SusanoEx Ame-No-Murakumo': '218C', // standing in red line after midphase
    'SusanoEx Ama-No-Iwato The Sealed Gate': '2035', // not killing the rock jails in time
  },
  shareWarn: {
    'SusanoEx Dark Levin Shock': '2044', // midphase orb
    'SusanoEx Stormsplitter': '2033', // tank buster lceave
  },
  soloWarn: {
    'SusanoEx Brightstorm': '2030', // stack marker
  },
};

export default triggerSet;
