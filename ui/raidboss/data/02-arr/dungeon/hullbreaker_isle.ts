//import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.HullbreakerIsle,
  triggers: [
    {
      id: 'Hullbreaker Isle Stool Pelt',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '89E', source: 'Sasquatch', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Hullbreaker Isle Chest Thump',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '89F', source: 'Sasquatch'}),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Give banna to Harambee',
          fr: 'Secouez le bananier',
        },
      },
    },
  ],
};

export default triggerSet;
