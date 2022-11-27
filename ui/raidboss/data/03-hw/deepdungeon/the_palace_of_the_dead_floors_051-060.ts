// import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// Palace of the Dead Floors 051-060

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.ThePalaceOfTheDeadFloors51_60,

  triggers: [
    // ---------------- Floor 051-059 Mobs ----------------
    // ---------------- Floor 060 Boss: The Black Rider ----------------
  ],
};

export default triggerSet;
