import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// Palace of the Dead Floors 111-120
// TODO: Deep Palace Slime Rupture, high damage AoE enrage

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.ThePalaceOfTheDeadFloors111_120,

  triggers: [
    // ---------------- Floor 111-119 Mobs ----------------
    {
      id: 'PotD 111-120 Deep Palace Salamander Mucin',
      // gains Stoneskin (97)
      type: 'StartsUsing',
      netRegex: { id: '1B66', source: 'Deep Palace Salamander' },
      response: Responses.stunOrInterruptIfPossible(),
    },
    // ---------------- Floor 120 Boss: Kirtimukha ----------------
    {
      id: 'PotD 111-120 Kirtimukha Leafstorm',
      type: 'StartsUsing',
      netRegex: { id: '1BE0', source: 'Kirtimukha', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'PotD 111-120 Kirtimukha Adds Spawn',
      // 5366 = Deep Palace Hornet, use Final Sting 70% max HP enrage attack if not killed fast enough
      type: 'AddedCombatant',
      netRegex: { npcNameId: '5366', capture: false },
      suppressSeconds: 1,
      response: Responses.killAdds('alert'),
    },
  ],
};

export default triggerSet;
