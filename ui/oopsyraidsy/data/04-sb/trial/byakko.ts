import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

// TODO: what is the failure for State of Shock / Clutch / Highest Stakes?
// When solo, 27E2 hits player and 2A36 hits nobody.
// When in a party, 2A36 hits everybody stacking and 27E2 hits nobody.
// Is 27E2 the "kills you when no friends" damage? (It was like ~100k at level 80).

export type Data = OopsyData;

// Byakko Normal
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheJadeStoa,
  damageWarn: {
    'Byakko Sweep the Leg': '2A2E', // 270 degree get behind
    'Byakko Aratama Force Aratama': '2A48', // popping Unrelenting Anguish bubbles
    'Byakko Fire and Lightning': '2A2C', // large red/purple line aoe
    'Byakko Hakutei Aratama': '2A29', // targeted ground circle during tiger phase
    'Byakko Hundredfold Havoc 1': '2A38', // lightning puddles initial
    'Byakko Hundredfold Havoc 2': '2A39', // lightning puddles moving
    'Byakko Distant Clap': '2A30', // donut
  },
  damageFail: {
    'Byakko Aratama Midphase': '2A42', // popping a bubble during midphase
    'Byakko Sweep The Leg': '2A46', // donut during midphase
    'Byakko Imperial Guard': '2A43', // line aoe from tiger during midphase
  },
  gainsEffectWarn: {
    'Byakko Bleeding': '111', // standing in Hakutei's Aratama circle (2A29)
  },
  shareWarn: {
    'Byakko Bombogenesis': '2A3B', // red spread marker
  },
};

export default triggerSet;
