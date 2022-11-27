// import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// Palace of the Dead Floors 071-080

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.ThePalaceOfTheDeadFloors71_80,

  triggers: [
    // ---------------- Floor 071-079 Mobs ----------------
    // ---------------- Floor 080 Boss: Gudanna ----------------
  ],
};

export default triggerSet;
