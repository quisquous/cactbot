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
      netRegex: { id: '415', source: 'Demon Wall', capture: false },
      response: Responses.goSides(),
    },
    {
      id: 'Amdapor Keep Liquefy Sides',
      type: 'StartsUsing',
      netRegex: { id: '416', source: 'Demon Wall', capture: false },
      response: Responses.goMiddle(),
    },
    {
      id: 'Amdapor Keep Repel',
      type: 'StartsUsing',
      netRegex: { id: '417', source: 'Demon Wall', capture: false },
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
};

export default triggerSet;
