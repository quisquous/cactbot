import Conditions from '../../../../../resources/conditions.js';
import NetRegexes from '../../../../../resources/netregexes.js';
import { Responses } from '../../../../../resources/responses.js';
import ZoneId from '../../../../../resources/zone_id.js';
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
      condition: Conditions.caresAboutMagical(),
      response: Responses.tankCleave(),
    },
    {
      id: 'E12N Boulders Impact',
      netRegex: NetRegexes.ability({ id: '586E', source: 'Titanic Bomb Boulder', capture: false }),
      suppressSeconds: 5,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Between small boulders',
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
      id: 'E12N Diamond Dust',
      netRegex: NetRegexes.startsUsing({ id: '5864', source: 'Eden\'s Promise', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Spread, don\'t move',
        },
      },
    },
    {
      id: 'E12N Frigid Stone',
      netRegex: NetRegexes.headMarker({ id: '0060' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
  ],
};
