import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheForbiddenLandEurekaPyros,
  resetWhenOutOfCombat: false,
  triggers: [
    {
      id: 'Eureka Pyros Skoll Hoarhound Halo',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '36E0', source: 'Skoll', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '36E0', source: 'Skalli', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '36E0', source: 'Sköll', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '36E0', source: 'スコル', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '36E0', source: '斯库尔', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '36E0', source: '스콜', capture: false }),
      response: Responses.goFrontOrSides(),
    },
    {
      id: 'Eureka Pyros Skoll Heavensward Howl',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '46BD', source: 'Skoll', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '46BD', source: 'Skalli', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '46BD', source: 'Sköll', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '46BD', source: 'スコル', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '46BD', source: '斯库尔', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '46BD', source: '스콜', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      id: 'Eureka Pyros Falling Asleep',
      type: 'GameLog',
      netRegex: NetRegexes.gameLog({ line: '7 minutes have elapsed since your last activity..*?', capture: false }),
      netRegexDe: NetRegexes.gameLog({ line: 'Seit deiner letzten Aktivität sind 7 Minuten vergangen..*?', capture: false }),
      netRegexFr: NetRegexes.gameLog({ line: 'Votre personnage est inactif depuis 7 minutes.*?', capture: false }),
      netRegexJa: NetRegexes.gameLog({ line: '操作がない状態になってから7分が経過しました。.*?', capture: false }),
      netRegexCn: NetRegexes.gameLog({ line: '已经7分钟没有进行任何操作.*?', capture: false }),
      netRegexKo: NetRegexes.gameLog({ line: '7분 동안 아무 조작을 하지 않았습니다..*?', capture: false }),
      response: Responses.wakeUp(),
    },
  ],
};

export default triggerSet;
