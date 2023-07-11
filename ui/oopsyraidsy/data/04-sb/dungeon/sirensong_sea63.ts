import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheSirensongSea63,
  damageWarn: {
    'Sirensong63 Ancient Ymir Head Snatch': '2353', // frontal conal
    'Sirensong63 Reflection of Karlabos Tail Screw': '12B7', // targeted circle
    'Sirensong63 Lugat Amorphous Applause': '1F56', // frontal 180 cleave
    'Sirensong63 Lugat Concussive Oscillation': '1F5B', // 5 or 7 circles
    'Sirensong63 The Jane Guy Ball of Malice': '1F6A', // ambient cannon circle
    'Sirensong63 Dark': '19DF', // Skinless Skipper / Fleshless Captive targeted circle
    'Sirensong63 The Governor Shadowstrike': '1F5D', // standing in shadows
    'Sirensong63 Undead Warden March of the Dead': '2351', // frontal conal
    'Sirensong63 Fleshless Captive Flood': '218B', // centered circle after seductive scream
    'Sirensong63 Lorelei Void Water III': '1F68', // large targeted circle
  },
};

export default triggerSet;
