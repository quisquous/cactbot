import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  id: 'TheLimitlessBlueExtreme',
  zoneId: ZoneId.TheLimitlessBlueExtreme,
  triggers: [
    {
      id: 'Bismarck Sharp Gust',
      type: 'StartsUsing',
      netRegex: { id: 'FAF', source: 'Bismarck', capture: false },
      response: Responses.knockback(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Bismarck': 'Bismarck',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Bismarck': 'Bismarck',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Bismarck': 'ビスマルク',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Bismarck': '俾斯麦',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Bismarck': '비스마르크',
      },
    },
  ],
};

export default triggerSet;
