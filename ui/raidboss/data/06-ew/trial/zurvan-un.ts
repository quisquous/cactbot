import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  id: 'ContainmentBayZ1T9Unreal',
  zoneId: ZoneId.ContainmentBayZ1T9Unreal,
  timelineFile: 'zurvan-un.txt',
  triggers: [],
};

export default triggerSet;
