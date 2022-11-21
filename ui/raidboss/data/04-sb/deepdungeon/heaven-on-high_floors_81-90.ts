// import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// Heaven-on-High Floors 81-90

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.HeavenOnHighFloors81_90,

  triggers: [
    // ---------------- Floor 81-89 Mobs ----------------
    // ---------------- Floor 90 Boss: Onra ----------------
  ],
};

export default triggerSet;
