import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.AbyssosTheEighthCircle,
  timelineFile: 'p8n.txt',
  triggers: [],
};

export default triggerSet;
