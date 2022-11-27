// import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// Palace of the Dead Floors 081-090

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.ThePalaceOfTheDeadFloors81_90,

  triggers: [
    // ---------------- Floor 081-089 Mobs ----------------
    // ---------------- Floor 090 Boss: The Godmother ----------------
  ],
};

export default triggerSet;
