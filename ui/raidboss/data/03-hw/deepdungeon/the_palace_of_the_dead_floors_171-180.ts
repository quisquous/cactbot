import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// Palace of the Dead Floors 171-180
// TODO: Deep Palace Snowclops 100-tonze Swing (untelegraphed PBAoE)
// TODO: Deep Palace Wisent Khoomii (draw-in + heavy, combos with Horroisonous Blast, can avoid with knockback-prevent)
// TODO: Deep Palace Wisent Horroisonous Blast (large, high damage PBAoE, can be interrupted)

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.ThePalaceOfTheDeadFloors171_180,

  triggers: [
    // ---------------- Floor 171-179 Mobs ----------------
    {
      id: 'PotD 171-180 Deep Palace Snowclops Glower',
      // untelegraphed front line AoE
      type: 'StartsUsing',
      netRegex: { id: '1B95', source: 'Deep Palace Snowclops', capture: false },
      response: Responses.awayFromFront(),
    },
    {
      id: 'PotD 171-180 Bird of the Deep Palace Tropical Wind',
      // gains Haste and Attack Boost
      type: 'StartsUsing',
      netRegex: { id: '1B94', source: 'Bird of the Deep Palace' },
      response: Responses.interrupt(),
    },
    // ---------------- Floor 180 Boss: Dendainsonne ----------------
    // intentionally blank
  ],
};

export default triggerSet;
