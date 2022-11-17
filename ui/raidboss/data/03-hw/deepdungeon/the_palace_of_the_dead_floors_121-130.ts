import Conditions from '../../../../../resources/conditions';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// Palace of the Dead Floors 121-130
// TODO: missing Deep Palace Dullahan Blade of Suffering (interruptable cast)

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.ThePalaceOfTheDeadFloors121_130,

  triggers: [
    // ---------------- Floor 121-129 Mobs ----------------
    {
      id: 'PotD 121-130 Deep Palace Minotaur 111-tonze Swing',
      // untelegraphed PBAoE with knockback
      type: 'StartsUsing',
      netRegex: { id: '18DC', source: 'Deep Palace Minotaur', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'PotD 121-130 Deep Palace Skatene Chirp',
      // untelegraphed PBAoE sleep
      type: 'StartsUsing',
      netRegex: { id: '18DD', source: 'Deep Palace Skatene', capture: false },
      response: Responses.getOut(),
    },
    // ---------------- Floor 130 Boss: Alfard ----------------
    {
      id: 'PotD 121-130 Alfard Ball of Fire',
      // persistent AoE that gives Burns (11C)
      type: 'NetworkAOEAbility',
      netRegex: { id: '1BE3', source: 'Alfard' },
      condition: Conditions.targetIsYou(),
      response: Responses.moveAway(),
    },
    {
      id: 'PotD 121-130 Alfard Ball of Ice',
      // persistent AoE that gives Frostbite
      type: 'NetworkAOEAbility',
      netRegex: { id: '1BE4', source: 'Alfard' },
      condition: Conditions.targetIsYou(),
      response: Responses.moveAway(),
    },
    {
      id: 'PotD 121-130 Alfard Fear Itself',
      // roomwide donut AoE that gives Terror, need to be inside boss hitbox to avoid
      // Alfard always moves to the center of the room first before casting this
      type: 'StartsUsing',
      netRegex: { id: '1BE5', source: 'Alfard', capture: false },
      response: Responses.getUnder(),
    },
  ],
};

export default triggerSet;
