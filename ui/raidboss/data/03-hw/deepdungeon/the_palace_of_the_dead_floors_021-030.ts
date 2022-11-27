import Conditions from '../../../../../resources/conditions';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// Palace of the Dead Floors 021-030
// TODO: Palace Peiste Stone Gaze front cone AoE gaze attack

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.ThePalaceOfTheDeadFloors21_30,

  triggers: [
    // ---------------- Floor 021-029 Mobs ----------------
    {
      id: 'PotD 021-030 Palace Minotaur 111-tonze Swing',
      // untelegraphed PBAoE with knockback
      type: 'StartsUsing',
      netRegex: { id: '18DC', source: 'Palace Minotaur', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'PotD 021-030 Palace Skatene Chirp',
      // untelegraphed PBAoE Sleep
      type: 'StartsUsing',
      netRegex: { id: '18DD', source: 'Palace Skatene', capture: false },
      response: Responses.getOut(),
    },
    // ---------------- Floor 030 Boss: Ningishzida ----------------
    {
      id: 'PotD 021-030 Ningishzida Ball of Fire',
      // persistent AoE that inflicts Burns (11C)
      type: 'NetworkAOEAbility',
      netRegex: { id: '191B', source: 'Ningishzida' },
      condition: Conditions.targetIsYou(),
      response: Responses.moveAway(),
    },
    {
      id: 'PotD 021-030 Ningishzida Ball of Ice',
      // persistent AoE that inflicts Frostbite
      type: 'NetworkAOEAbility',
      netRegex: { id: '191C', source: 'Ningishzida' },
      condition: Conditions.targetIsYou(),
      response: Responses.moveAway(),
    },
    {
      id: 'PotD 021-030 Ningishzida Fear Itself',
      // roomwide donut AoE that inflicts Terror (42), need to be inside boss hitbox to avoid
      // Ningishzida always moves to the center of the room first before casting this
      type: 'StartsUsing',
      netRegex: { id: '191D', source: 'Ningishzida', capture: false },
      response: Responses.getUnder('alert'),
    },
  ],
};

export default triggerSet;
