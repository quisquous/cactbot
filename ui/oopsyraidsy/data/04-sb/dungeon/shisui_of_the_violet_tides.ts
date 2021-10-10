import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

// TODO: can Mucal Glob (1F73) hit multiple people?

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.ShisuiOfTheVioletTides,
  damageWarn: {
    'Shisui Violet Coralshell Bubble Shower': '236', // frontal conal
    'Shisui Hikagiri Defibrillate': '11C1', // centered circle
    'Shisui Buried Monkfish Fish Out Of Water': '1F88', // untelegraphed triggered monkfish mine
    'Shisui Ango Flounder': '91F', // line aoe
    'Shisui Hikagiri Electrogenesis': '11C2', // targeted circle
    'Shisui Amikiri Shuck': '1F75', // not killing Amikiri's leg
    'Shisui Palace Guard Heartstopper': '362', // dragoon guard line aoe
    'Shisui Palace Guard Fire Arrow': '1F89', // ambient untargeted circles
    'Shisui Captain Of The Guard Tenka Goken': '23B7', // wide conal
    'Shisui Ruby Princess Coriolis Kick': '1F7B', // large centered circle (seduce always paired with this)
    'Shisui Ruby Princess Abyssal Volcano': '1F7C', // centered circle paired with chase aoe
    'Shisui Ruby Princess Geothermal Flatulence 1': '24D7', // chase aoe initial
    'Shisui Ruby Princess Geothermal Flatulence 2': '1F7D', // chase aoe x10
    'Shisui Violet Bombfish 1000 Spines': '1FF7', // roaming bombfish triggered circle
    'Shisui Blue Unkiu Flush': '21A4', // interruptible centered circle
    'Shisui Shisui Yohi Black Tide': '1F81', // reappearance after thick fog
    'Shisui Shisui Yohi Churn Bubble Burst': '1F84', // not killing bubble during thick fog
    'Shisui Shisui Yohi Naishi-No-Kami Bite And Run': '1F85', // not killing shark add
    'Shisui Shisui Yohi Naishi-No-Jo Bite And Run': '1F86', // not killing small shark add
  },
  gainsEffectWarn: {
    // Note: Dropsy (213, with count field) is the effect during Shisui Yohi Thick Fog
    'Shisui Dropsy': '121', // standing in Kamikiri digestive fluid puddle
    'Shisui Hysteria': '128', // failing Shisui Yohi Mad Stare (1F82)
  },
  shareWarn: {
    'Shisui Amikiri Digest': '1F79', // Kamikiri digestive fluid puddle landing
  },
};

export default triggerSet;
