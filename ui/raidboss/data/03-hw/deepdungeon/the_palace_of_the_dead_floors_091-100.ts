import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// Palace of the Dead Floors 091-100

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.ThePalaceOfTheDeadFloors91_100,

  triggers: [
    // ---------------- Floor 091-099 Mobs ----------------
    {
      id: 'PotD 091-100 Palace Wraith Scream',
      // inflicts Terror (42)
      type: 'StartsUsing',
      netRegex: { id: '190A', source: 'Palace Wraith' },
      response: Responses.stunOrInterruptIfPossible(),
    },
    // ---------------- Floor 100 Boss: Nybeth Obdilord ----------------
    {
      id: 'PotD 091-100 Nybeth Obdilord Summon Darkness',
      // 5357 = Giant Corse
      // 5358 = Bicephalic Corse
      // 5359 = Iron Corse
      type: 'Ability',
      netRegex: { id: '1ADC', source: 'Nybeth Obdilord', capture: false },
      response: Responses.killAdds('alert'),
    },
  ],
};

export default triggerSet;
