import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// Palace of the Dead Floors 191-200

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.ThePalaceOfTheDeadFloors191_200,

  triggers: [
    // ---------------- Floor 191-199 Mobs ----------------
    {
      id: 'PotD 191-200 Deep Palace Wraith Scream',
      // inflicts Terror (42)
      // same as Floors 141-150
      type: 'StartsUsing',
      netRegex: { id: '190A', source: 'Deep Palace Wraith' },
      response: Responses.stunOrInterruptIfPossible(),
    },
    {
      id: 'PotD 191-200 Onyx Dragon Evil Eye',
      // gaze, inflicts Terror (42), combos with Miasma Breath (1B82)
      // same as Floors 141-150
      type: 'StartsUsing',
      netRegex: { id: '1B83', source: 'Onyx Dragon', capture: false },
      response: Responses.lookAway('alert'),
    },
    {
      id: 'PotD 191-200 Deep Palace Fachan Level 5 Death',
      // untelegraphed cone AoE that causes instant death
      type: 'StartsUsing',
      netRegex: { id: '1BAC', source: 'Deep Palace Fachan', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'PotD 191-200 Deep Palace Knight Death Spiral',
      // donut AoE
      type: 'StartsUsing',
      netRegex: { id: '1BAA', source: 'Deep Palace Knight', capture: false },
      response: Responses.getIn(),
    },
  ],
};

export default triggerSet;
