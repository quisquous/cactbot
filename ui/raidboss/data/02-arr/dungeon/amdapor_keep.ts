//import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.AmdaporKeep,
  triggers: [
    {
      id: 'Amdapor Keep Liquefy Middle',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '415', source: 'Demon Wall'}),
      netRegexDe: NetRegexes.startsUsing({ id: '415'}),
      netRegexFr: NetRegexes.startsUsing({ id: '415'}),
      netRegexJa: NetRegexes.startsUsing({ id: '415'}),
      response: Responses.goMiddle(),
    },
    {
      id: 'Amdapor Keep Liquefy Sides',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '416', source: 'Demon Wall'}),
      netRegexDe: NetRegexes.startsUsing({ id: '416'}),
      netRegexFr: NetRegexes.startsUsing({ id: '416'}),
      netRegexJa: NetRegexes.startsUsing({ id: '416'}),
      response: Responses.goSides(),
    },
    {
      id: 'Amdapor Keep Repel',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '417', source: 'Demon Wall'}),
      netRegexDe: NetRegexes.startsUsing({ id: '417'}),
      netRegexFr: NetRegexes.startsUsing({ id: '417'}),
      netRegexJa: NetRegexes.startsUsing({ id: '417'}),
      response: Responses.knockback(),
    },
  ],
};

export default triggerSet;
