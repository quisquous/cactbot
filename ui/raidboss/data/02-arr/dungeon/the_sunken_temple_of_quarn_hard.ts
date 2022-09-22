import { defineTriggerSet } from '../../../../../resources/api_define_trigger_set';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';

export default defineTriggerSet({
  zoneId: ZoneId.TheSunkenTempleOfQarnHard,
  triggers: [
    {
      id: 'Sunken Quarn Hard Light of Anathema',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: 'C26', source: 'Vicegerent to the Warden', capture: false }),
      response: Responses.awayFromFront(),
    },
  ],
});
