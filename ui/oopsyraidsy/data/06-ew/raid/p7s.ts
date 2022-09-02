import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

// TODO: many things still missing here

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.AbyssosTheSeventhCircleSavage,
  damageWarn: {
    'P7S Bough of Attis Close': '7822', // left/right arrow (from 7821 cast)
    'P7S Bough of Attis Arrow': '7825', // bough hit south (from 7823 cast)
    'P7S Bough of Attis Far': '7827', // bought hit north (from 7826 cast)
    'P7S Bullish Swipe': '7819', // baited Minotaur cleaves (from 7818 cast)
    'P7S Hemitheos\'s Glare': '782A', // chasing aoe
  },
  shareWarn: {
    'P7S Static Path': '7814', // Immature Io tether line aoe
  },
  shareFail: {
    'P7S Dispersed Aero II': '7837', // spread tankbuster
  },
  soloWarn: {
    'P7S Condensed Aero II': '7838', // shared tankbuster
  },
};

export default triggerSet;
