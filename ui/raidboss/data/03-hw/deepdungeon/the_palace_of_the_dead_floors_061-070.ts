// import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// Palace of the Dead Floors 061-070

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.ThePalaceOfTheDeadFloors61_70,

  triggers: [
    // ---------------- Floor 061-069 Mobs ----------------
    // ---------------- Floor 070 Boss: Yaquaru ----------------
  ],
};

export default triggerSet;
