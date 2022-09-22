import { defineTriggerSet } from '../../../../../resources/api_define_trigger_set';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';

export default defineTriggerSet({
  zoneId: ZoneId.TheStoneVigilHard,
  triggers: [
    {
      id: 'Stone Vigil Hard Swinge',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '8F7', source: 'Gorynich', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      id: 'Stone Vigil Hard Lion\'s Breath',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '8F6', source: 'Gorynich', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      id: 'Stone Vigil Hard Rake',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '8F5', source: 'Gorynich' }),
      response: Responses.tankBuster(),
    },
  ],
});
