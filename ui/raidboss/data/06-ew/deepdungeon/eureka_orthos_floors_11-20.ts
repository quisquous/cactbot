import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// Eureka Orthos Floors 11-20
// TODO: Cloning Node cone AoE safe-spots?

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.EurekaOrthosFloors11_20,

  triggers: [
    // ---------------- Floor 11-19 Mobs ----------------
    // intentionally blank
    // ---------------- Floor 20 Boss: Cloning Node ----------------
    // intentionally blank
  ],
};

export default triggerSet;
