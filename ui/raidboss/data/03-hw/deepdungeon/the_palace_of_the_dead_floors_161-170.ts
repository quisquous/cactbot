import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// Palace of the Dead Floors 161-170

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.ThePalaceOfTheDeadFloors161_170,

  triggers: [
    // ---------------- Floor 161-169 Mobs ----------------
    {
      id: 'PotD 161-170 Deep Palace Diplocaulus Mucin',
      // gains Stoneskin (practically immune to damage for 7s)
      type: 'StartsUsing',
      netRegex: { id: '1B66', source: 'Deep Palace Diplocaulus' },
      response: Responses.stunOrInterruptIfPossible(),
    },
    {
      id: 'PotD 161-170 Deep Palace Diplocaulus Foregone Gleam',
      // front cone gaze
      type: 'StartsUsing',
      netRegex: { id: '1B2D', source: 'Deep Palace Diplocaulus', capture: false },
      response: Responses.lookAway('alert'),
    },
    // ---------------- Floor 170 Boss: Yulunggu ----------------
    // intentionally blank
  ],
};

export default triggerSet;
