import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  id: 'TheForbiddenLandEurekaPagos',
  zoneId: ZoneId.TheForbiddenLandEurekaPagos,
  resetWhenOutOfCombat: false,
  triggers: [
    {
      id: 'Eureka Pagos Falling Asleep',
      type: 'GameLog',
      netRegex: { line: '7 minutes have elapsed since your last activity..*?', capture: false },
      response: Responses.wakeUp(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        '7 minutes have elapsed since your last activity..*?':
          'Seit deiner letzten Aktivität sind 7 Minuten vergangen.',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        '7 minutes have elapsed since your last activity.':
          'Votre personnage est inactif depuis 7 minutes',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        '7 minutes have elapsed since your last activity.': '操作がない状態になってから7分が経過しました。',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        '7 minutes have elapsed since your last activity.': '已经7分钟没有进行任何操作',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        '7 minutes have elapsed since your last activity..*?': '7분 동안 아무 조작을 하지 않았습니다',
      },
    },
  ],
};

export default triggerSet;
