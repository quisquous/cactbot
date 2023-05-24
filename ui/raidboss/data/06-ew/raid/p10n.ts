import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  id: 'AnabaseiosTheTenthCircle',
  zoneId: ZoneId.AnabaseiosTheTenthCircle,
  timelineFile: 'p10n.txt',
  triggers: [],
};

export default triggerSet;
