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
      netRegex: NetRegexes.startsUsing({ id: '89E', source: 'Sasquatch'}),
      netRegexDe: NetRegexes.startsUsing({ id: '89E'}),
      netRegexFr: NetRegexes.startsUsing({ id: '89E'}),
      netRegexJa: NetRegexes.startsUsing({ id: '89E'}),
      response: Responses.aoe(),
    },
    {
      id: 'Hullbreaker Isle Chest Thump',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '89F', source: 'Sasquatch'}),
      netRegexDe: NetRegexes.ability({ id: '89F'}),
      netRegexFr: NetRegexes.ability({ id: '89F'}),
      netRegexJa: NetRegexes.ability({ id: '89F'}),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Give banna to Harambee',
          de: '',
          fr: 'Secouez le bananier',
          ja: '',
          cn: '',
          ko: '',
        },
      },
    },
  ],
};

export default triggerSet;
