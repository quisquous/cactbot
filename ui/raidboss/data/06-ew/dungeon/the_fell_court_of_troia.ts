import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheFellCourtOfTroia,
  timelineFile: 'the_fell_court_of_troia.txt',
  triggers: [],
};

export default triggerSet;
