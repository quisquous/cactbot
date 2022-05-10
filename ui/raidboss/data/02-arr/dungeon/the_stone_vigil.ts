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
      netRegex: NetRegexes.startsUsing({ id: '387', source: 'Chudo-Yudo', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '387', source: 'Chudo-Yudo', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '387', source: 'Chudo-Yudo', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '387', source: 'チョドーユドー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '387', source: '丘都尤都', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '387', source: '추도유도', capture: false }),
      response: Responses.awayFromFront(),
    },
  ],
};

export default triggerSet;
