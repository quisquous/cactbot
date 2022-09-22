import { defineTriggerSet } from '../../../../../resources/api_define_trigger_set';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';

export default defineTriggerSet({
  zoneId: ZoneId.AmdaporKeep,
  triggers: [
    {
      id: 'Amdapor Keep Liquefy Middle',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '415', source: 'Demon Wall', capture: false }),
      response: Responses.goSides(),
    },
    {
      id: 'Amdapor Keep Liquefy Sides',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '416', source: 'Demon Wall', capture: false }),
      response: Responses.goMiddle(),
    },
    {
      id: 'Amdapor Keep Repel',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '417', source: 'Demon Wall', capture: false }),
      response: Responses.knockback(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Demon Wall': 'Dämonenwand',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Demon Wall': 'mur démonique',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Demon Wall': 'デモンズウォール',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Demon Wall': '恶魔墙',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Demon Wall': '악마의 벽',
      },
    },
  ],
});
