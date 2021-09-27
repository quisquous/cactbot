import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheSirensongSea,
  damageWarn: {
    'Sirensong Ancient Ymir Head Snatch': '2353', // frontal conal
    'Sirensong Reflection of Karlabos Tail Screw': '12B7', // targeted circle
    'Sirensong Lugat Amorphous Applause': '1F56', // frontal 180 cleave
    'Sirensong Lugat Concussive Oscillation': '1F5B', // 5 or 7 circles
    'Sirensong The Jane Guy Ball of Malice': '1F6A', // ambient cannon circle
    'Sirensong Dark': '19DF', // Skinless Skipper / Fleshless Captive targeted circle
    'Sirensong The Governor Shadowstrike': '1F5D', // standing in shadows
    'Sirensong Undead Warden March of the Dead': '2351', // frontal conal
    'Sirensong Fleshless Captive Flood': '218B', // centered circle after seductive scream
    'Sirensong Lorelei Void Water III': '1F68', // large targeted circle
  },
};

export default triggerSet;
