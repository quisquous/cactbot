//import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
//import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.Snowcloak,
  triggers: [
    {
      id: 'Snowcloak Lunar Cry',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: 'C1F', source: 'Fenrir' , capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Hide behind Ice',
          fr: 'Cachez vous derrière un pilier de glace',
        },
      },
    },
  ],
};

export default triggerSet;
