// import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// Palace of the Dead Floors 101-110

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.ThePalaceOfTheDeadFloors101_110,

  triggers: [
    // ---------------- Floor 101-109 Mobs ----------------
    // ---------------- Floor 110 Boss: Alicanto ----------------
  ],
};

export default triggerSet;
