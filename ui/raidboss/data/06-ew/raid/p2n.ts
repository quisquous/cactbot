// import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  zoneId: ZoneId.AsphodelosTheSecondCircle,
  timelineFile: 'p2n.txt',
  triggers: [
    {
      id: 'P2N Murky Depths',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '680F', source: 'Hippokampos', capture: false }),
      response: Responses.aoe(),
    },
  ],
};

export default triggerSet;
