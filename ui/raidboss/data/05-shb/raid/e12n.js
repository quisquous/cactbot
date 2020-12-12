import Conditions from '../../../../../resources/conditions.js';
import NetRegexes from '../../../../../resources/netregexes.js';
import { Responses } from '../../../../../resources/responses.js';
import ZoneId from '../../../../../resources/zone_id.js';

// TODO: Tether mechanic callouts. Each tether type is used for one primal,
// so we could just do a collect > analyze > call system based on which tethers are seen.
// TODO: Handle the EarthShaker bait --> beam intercept mechanic during the intermission.
// TODO: Math the spawn position of the Titanic Bomb Boulders to call the safe direction like E4s.
// TODO: Fix the Rapturous Reach trigger so it doesn't double call during the intermission.


export default {
  zoneId: ZoneId.EdensPromiseEternity,
  timelineFile: 'e12n.txt',
  triggers: [
    {
      id: 'E12N Maleficium',
      netRegex: NetRegexes.startsUsing({ id: '5872', source: 'Eden\'s Promise', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'E12N Formless Judgment',
      netRegex: NetRegexes.startsUsing({ id: '5873', source: 'Eden\'s Promise' }),
      response: Responses.tankCleave(),
    },
    {
      id: 'E12N Boulders Impact',
      netRegex: NetRegexes.ability({ id: '586E', source: 'Titanic Bomb Boulder', capture: false }),
      suppressSeconds: 5,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Between small bombs',
        },
      },
    },
    {
      id: 'E12N Boulders Explosion',
      netRegex: NetRegexes.ability({ id: '586F', source: 'Titanic Bomb Boulder', capture: false }),
      suppressSeconds: 5,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Move to last explosions',
        },
      },
    },
    {
      id: 'E12N Rapturous Reach',
      netRegex: NetRegexes.headMarker({ id: '003E' }),
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'E12N Diamond Dust Spread',
      netRegex: NetRegexes.startsUsing({ id: '5864', source: 'Eden\'s Promise', capture: false }),
      response: Responses.spread(),
    },
    {
      id: 'E12N Diamond Dust Stop',
      netRegex: NetRegexes.startsUsing({ id: '5864', source: 'Eden\'s Promise', capture: false }),
      delaySeconds: 1, // Avoiding collision with the spread call
      response: Responses.stopMoving('info'),
    },
    {
      id: 'E12N Frigid Stone',
      netRegex: NetRegexes.headMarker({ id: '0060' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
  ],
};
