import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// Triggers applicable to all Palace of the Dead floors.

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: [
    ZoneId.ThePalaceOfTheDeadFloors1_10,
    ZoneId.ThePalaceOfTheDeadFloors11_20,
    ZoneId.ThePalaceOfTheDeadFloors21_30,
    ZoneId.ThePalaceOfTheDeadFloors31_40,
    ZoneId.ThePalaceOfTheDeadFloors41_50,
    ZoneId.ThePalaceOfTheDeadFloors51_60,
    ZoneId.ThePalaceOfTheDeadFloors61_70,
    ZoneId.ThePalaceOfTheDeadFloors71_80,
    ZoneId.ThePalaceOfTheDeadFloors81_90,
    ZoneId.ThePalaceOfTheDeadFloors91_100,
    ZoneId.ThePalaceOfTheDeadFloors101_110,
    ZoneId.ThePalaceOfTheDeadFloors111_120,
    ZoneId.ThePalaceOfTheDeadFloors121_130,
    ZoneId.ThePalaceOfTheDeadFloors131_140,
    ZoneId.ThePalaceOfTheDeadFloors141_150,
    ZoneId.ThePalaceOfTheDeadFloors151_160,
    ZoneId.ThePalaceOfTheDeadFloors161_170,
    ZoneId.ThePalaceOfTheDeadFloors171_180,
    ZoneId.ThePalaceOfTheDeadFloors181_190,
    ZoneId.ThePalaceOfTheDeadFloors191_200,
  ],

  triggers: [
  ],
};

export default triggerSet;
