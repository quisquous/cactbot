import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheTowerOfZot,
  timelineFile: 'the_tower_of_zot.txt',
  triggers: [
    {
      id: 'ToZ Cinduruva Isitva Siddhi',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62A9', source: 'Cinduruva', capture: true }),
      response: Responses.tankBuster(),
    },
    {
      id: 'ToZ Sanduruva Isitva Siddhi',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62C0', source: 'Sanduruva', capture: true }),
      response: Responses.tankBuster(),
    },
  ],
};

export default triggerSet;
