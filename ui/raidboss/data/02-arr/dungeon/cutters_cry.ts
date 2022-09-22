import { defineTriggerSet } from '../../../../../resources/api_define_trigger_set';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';

export default defineTriggerSet({
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
});
