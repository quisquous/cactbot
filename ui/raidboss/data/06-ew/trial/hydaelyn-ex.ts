import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheMinstrelsBalladHydaelynsCall,
  timelineFile: 'hydaelyn-ex.txt',
  triggers: [
      {
      id: 'HydaelenEx Shining Saber',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '68C8', source: 'Hydaelyn' }),
      response: Responses.stackMarkerOn(),
    },
  ],
  timelineReplace: [
  ],
};

export default triggerSet;
