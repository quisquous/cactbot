//import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheStoneVigilHard,
  triggers: [
    {
      id: 'Stone Vigil Hard Swinge',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '8F7', source: 'Gorynich'}),
      netRegexDe: NetRegexes.startsUsing({ id: '8F7'}),
      netRegexFr: NetRegexes.startsUsing({ id: '8F7'}),
      netRegexJa: NetRegexes.startsUsing({ id: '8F7'}),
      response: Responses.awayFromFront(),
    },
    {
      id: 'Stone Vigil Hard Lion\'s Breath',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '8F6', source: 'Gorynich'}),
      netRegexDe: NetRegexes.startsUsing({ id: '8F6'}),
      netRegexFr: NetRegexes.startsUsing({ id: '8F6'}),
      netRegexJa: NetRegexes.startsUsing({ id: '8F6'}),
      response: Responses.awayFromFront(),
    },
    {
      id: 'Stone Vigil Hard Rake',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '8F5', source: 'Gorynich'}),
      netRegexDe: NetRegexes.startsUsing({ id: '8F5'}),
      netRegexFr: NetRegexes.startsUsing({ id: '8F5'}),
      netRegexJa: NetRegexes.startsUsing({ id: '8F5'}),
      response: Responses.tankBuster(),
    },
  ],
};

export default triggerSet;
