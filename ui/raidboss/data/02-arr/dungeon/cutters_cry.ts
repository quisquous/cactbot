import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.CuttersCry,
  triggers: [
    {
      id: 'Chimera Ram Voice',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '450', source: 'Chimera', capture: false }),
      response: Responses.outOfMelee(),
    },
    {
      id: 'Chimera Dragon Voice',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '5A2', source: 'Chimera', capture: false }),
      response: Responses.getIn(),
    },
  ],
};

export default triggerSet;
