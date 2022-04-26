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
      netRegex: NetRegexes.ability({ id: '736', source: 'Chudo-Yudo'}),
      netRegexDe: NetRegexes.ability({ id: '736'}),
      netRegexFr: NetRegexes.ability({ id: '736'}),
      netRegexJa: NetRegexes.ability({ id: '736'}),
      response: Responses.killAdds(),
    },
    {
      id: 'Lost City Amdapor Graviball',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '762', source: 'Diabolos' }),
      netRegexDe: NetRegexes.startsUsing({ id: '762'}),
      netRegexFr: NetRegexes.startsUsing({ id: '762'}),
      netRegexJa: NetRegexes.startsUsing({ id: '762'}),
      condition: Conditions.targetIsYou(),
      infoText: (data, matches, output) => output.text!({ player: data.ShortName(matches.target) }),
      outputStrings: {
        text: {
          en: 'Go far to drop graviball',
          de: '',
          fr: '',
          ja: '',
          cn: '',
          ko: '',
        },
      },
    },
    {
      id: 'Lost City Amdapor Ultimate Terror',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '766', source: 'Diabolos'}),
      netRegexDe: NetRegexes.startsUsing({ id: '766'}),
      netRegexFr: NetRegexes.startsUsing({ id: '766'}),
      netRegexJa: NetRegexes.startsUsing({ id: '766'}),
      response: Responses.getIn(),
    },
  ],
};

export default triggerSet;
