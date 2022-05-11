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
      netRegexDe: NetRegexes.startsUsing({ id: '450', source: 'Chimära', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '450', source: 'Chimère', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '450', source: 'キマイラ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '450', source: '奇美拉', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '450', source: '키마이라', capture: false }),
      response: Responses.outOfMelee(),
    },
    {
      id: 'Chimera Dragon Voice',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '5A2', source: 'Chimera', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '5A2', source: 'Chimära', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '5A2', source: 'Chimère', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '5A2', source: 'キマイラ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '5A2', source: '奇美拉', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '5A2', source: '키마이라', capture: false }),
      response: Responses.getIn(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Chimera': 'Chimära',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Chimera': 'Chimère',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Chimera': 'キマイラ',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Chimera': '奇美拉',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Chimera': '키마이라',
      },
    },
  ],
};

export default triggerSet;
