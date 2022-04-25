//import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheStoneVigil,
  triggers: [
    {
      id: 'Stone Vigil Swinge',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '387', source: 'Chudo-Yudo'}),
      netRegexDe: NetRegexes.startsUsing({ id: '387'}),
      netRegexFr: NetRegexes.startsUsing({ id: '387'}),
      netRegexJa: NetRegexes.startsUsing({ id: '387'}),
      response: Responses.awayFromFront(),
    },
  ],
};

export default triggerSet;
