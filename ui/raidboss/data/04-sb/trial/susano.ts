import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

// Susano Normal
const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.ThePoolOfTribute,
  timelineNeedsFixing: true,
  timelineFile: 'susano.txt',
  timelineTriggers: [
    {
      id: 'Susano Assail',
      regex: /Assail/,
      beforeSeconds: 6,
      response: Responses.miniBuster(),
    },
  ],
  triggers: [
    {
      id: 'Susano Brightstorm',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '003E' }),
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Susano Seasplitter',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0017' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Knockback on YOU',
        },
      },
    },
    {
      id: 'Susano Ukehi',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Susano', id: '2026', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Susano Stormsplitter',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Susano', id: '2023' }),
      response: Responses.tankCleave('alert'),
    },
  ],
};

export default triggerSet;
