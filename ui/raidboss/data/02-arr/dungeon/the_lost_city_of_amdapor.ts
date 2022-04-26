import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheLostCityOfAmdapor,
  triggers: [
    {
      id: 'Lost City Amdapor Devour',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '736', source: 'Chudo-Yudo', capture: false }),
      response: Responses.killAdds(),
    },
    {
      id: 'Lost City Amdapor Graviball',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '762', source: 'Diabolos' }),
      condition: Conditions.targetIsYou(),
      infoText: (data, matches, output) => output.text!({ player: data.ShortName(matches.target) }),
      outputStrings: {
        text: {
          en: 'Go far to drop graviball',
        },
      },
    },
    {
      id: 'Lost City Amdapor Ultimate Terror',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '766', source: 'Diabolos', capture: false }),
      response: Responses.getIn(),
    },
  ],
};

export default triggerSet;
