import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  id: 'AnabaseiosTheEleventhCircleSavage',
  zoneId: ZoneId.AnabaseiosTheEleventhCircleSavage,
  timelineFile: 'p11s.txt',
  triggers: [
    {
      id: 'P11S Eunomia',
      type: 'StartsUsing',
      netRegex: { id: '822B', source: 'Themis', capture: false },
      response: Responses.bleedAoe(),
    },
  ],
};

export default triggerSet;
