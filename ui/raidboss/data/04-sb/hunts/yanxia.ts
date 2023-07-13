import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  id: 'Yanxia',
  zoneId: ZoneId.Yanxia,
  triggers: [
    {
      id: 'Angada Scythe Tail',
      type: 'StartsUsing',
      netRegex: { id: '1FFE', source: 'Angada', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getOut(),
    },
    {
      id: 'Angada Butcher',
      type: 'StartsUsing',
      netRegex: { id: '1FFF', source: 'Angada', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getBehind(),
    },
  ],
};

export default triggerSet;
