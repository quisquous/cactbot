import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// Palace of the Dead Floors 141-150

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.ThePalaceOfTheDeadFloors141_150,

  triggers: [
    // ---------------- Floor 141-149 Mobs ----------------
    {
      id: 'PotD 141-150 Deep Palace Bhoot Paralyze III',
      // gives Paralyze
      type: 'StartsUsing',
      netRegex: { id: '18F2', source: 'Deep Palace Bhoot' },
      response: Responses.stunOrInterruptIfPossible(),
    },
    {
      id: 'PotD 141-150 Deep Palace Persona Paralyze III',
      // same ability name, different mob
      // gives Paralyze
      type: 'StartsUsing',
      netRegex: { id: '18F4', source: 'Deep Palace Persona' },
      response: Responses.stunOrInterruptIfPossible(),
    },
    {
      id: 'PotD 141-150 Deep Palace Wraith Scream',
      // gives Terror (42)
      type: 'StartsUsing',
      netRegex: { id: '190A', source: 'Deep Palace Wraith' },
      response: Responses.stunOrInterruptIfPossible(),
    },
    {
      id: 'PotD 141-150 Deep Palace Succubus Void Fire IV',
      // very large AoE
      type: 'StartsUsing',
      netRegex: { id: '1B81', source: 'Deep Palace Succubus' },
      response: Responses.stunOrInterruptIfPossible(),
    },
    {
      id: 'PotD 141-150 Deep Palace Manticore Ripper Claw',
      // untelegraphed front cone AoE
      type: 'StartsUsing',
      netRegex: { id: '18FA', source: 'Deep Palace Manticore', capture: false },
      response: Responses.awayFromFront(),
    },
    {
      id: 'PotD 141-150 Onyx Dragon Evil Eye',
      // gaze, gives Terror (42), combos with Miasma Breath (1B82)
      type: 'StartsUsing',
      netRegex: { id: '1B83', source: 'Onyx Dragon', capture: false },
      response: Responses.lookAway('alert'),
    },
    // ---------------- Floor 150 Boss: Tisiphone ----------------
    {
      id: 'PotD 141-150 Tisiphone Blood Rain',
      // big roomwide AoE
      type: 'StartsUsing',
      netRegex: { id: '1BF1', source: 'Tisiphone', capture: false },
      response: Responses.bigAoe('alert'),
    },
  ],
};

export default triggerSet;
