import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  id: 'AnabaseiosTheTwelfthCircle',
  zoneId: ZoneId.AnabaseiosTheTwelfthCircle,
  timelineFile: 'p12n.txt',
  triggers: [],
};

export default triggerSet;
