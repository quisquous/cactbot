import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  wraithCount?: number;
}

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheForbiddenLandEurekaAnemos,
  resetWhenOutOfCombat: false,
  triggers: [
    {
      id: 'Eureka Garm Dragon Voice',
      type: 'StartsUsing',
      netRegex: { id: '2AD5', source: 'Void Garm', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Dragon\'s Voice',
          de: 'Stimme Des Drachen',
          fr: 'Voix du dragon',
          ja: '雷電の咆哮',
          cn: '雷电咆哮',
          ko: '뇌전의 포효',
        },
      },
    },
    {
      id: 'Eureka Sabotender Stack Marker',
      type: 'StartsUsing',
      netRegex: { id: '29EB', source: 'Sabotender Corrido' },
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Eureka Poly Swipe',
      type: 'StartsUsing',
      netRegex: { id: '2A71', source: 'Polyphemus', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Swipe',
          de: 'Hieb',
          fr: 'Fauche',
          ja: 'スワイプ',
          cn: '横扫',
          ko: '휘두르기',
        },
      },
    },
    {
      id: 'Eureka Poly Swing',
      type: 'StartsUsing',
      netRegex: { id: '2A6E', source: 'Polyphemus', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'Eureka Poly Eye',
      type: 'StartsUsing',
      netRegex: { id: '2A73', source: 'Polyphemus', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Eye Donut',
          de: 'Augendonut',
          fr: 'Donut œil',
          ja: 'アイ・オブ・ビホルダー',
          cn: '月环',
          ko: '눈알 도넛 장판',
        },
      },
    },
    {
      id: 'Eureka Poly Glower',
      type: 'StartsUsing',
      netRegex: { id: '2A72', source: 'Polyphemus', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Glower Laser',
          de: 'Blick Laser',
          fr: 'Regard laser',
          ja: 'グラワー',
          cn: '怒视',
          ko: '광선',
        },
      },
    },
    {
      id: 'Eureka Caym Eye',
      type: 'StartsUsing',
      netRegex: { id: '2A64', source: 'Caym', capture: false },
      response: Responses.lookAway(),
    },
    {
      id: 'Eureka Fafnir Terror',
      type: 'StartsUsing',
      netRegex: { id: '29B7', source: 'Fafnir', capture: false },
      response: Responses.lookAway(),
    },
    {
      id: 'Eureka Voidscale Ice',
      type: 'StartsUsing',
      netRegex: { id: '29C3', source: 'Voidscale' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Ice ball on you!',
          de: 'Eisball auf dir!',
          fr: 'Boule de glace sur vous !',
          ja: '自分に氷玉',
          cn: '点名冰球！',
          ko: '얼음 구슬 대상자',
        },
      },
    },
    {
      id: 'Eureka Pazuzu Dread Wind',
      type: 'StartsUsing',
      netRegex: { id: '2899', source: 'Pazuzu', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'Eureka Pazuzu Camisado',
      type: 'StartsUsing',
      netRegex: { id: '289F', source: 'Pazuzu' },
      condition: Conditions.targetIsYou(),
      response: Responses.tankBuster(),
    },
    {
      id: 'Eureka Pazuzu Cloud of Locust',
      type: 'StartsUsing',
      netRegex: { id: '2897', source: 'Pazuzu', capture: false },
      response: Responses.outOfMelee(),
    },
    {
      id: 'Eureka Pazuzu Plague of Locust',
      type: 'StartsUsing',
      netRegex: { id: '2896', source: 'Pazuzu', capture: false },
      alarmText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Plague Donut',
          de: 'Plagen-Donut',
          fr: 'Donut Nuée',
          ja: 'ローカストプレイグ',
          cn: '月环',
          ko: '역병 도넛 장판',
        },
      },
    },
    {
      id: 'Eureka Wraith Count',
      type: 'WasDefeated',
      netRegex: NetRegexes.wasDefeated({ target: 'Shadow Wraith', capture: false }),
      soundVolume: 0,
      infoText: (data, _matches, output) => {
        data.wraithCount = (data.wraithCount ?? 0) + 1;
        return output.text!({ num: data.wraithCount });
      },
      outputStrings: {
        text: {
          en: 'wraiths: ${num}',
          de: 'Geister: ${num}',
          fr: 'spectres: ${num}',
          ja: 'レイス: ${num}',
          cn: '幽灵击杀: ${num}',
          ko: '망령: ${num}',
        },
      },
    },
    {
      id: 'Eureka Pazuzu Pop',
      type: 'AddedCombatant',
      netRegex: NetRegexes.addedCombatant({ name: 'Pazuzu', capture: false }),
      run: (data) => data.wraithCount = 0,
    },
    {
      id: 'Eureka Falling Asleep',
      type: 'GameLog',
      netRegex: NetRegexes.gameLog({ line: '7 minutes have elapsed since your last activity..*?', capture: false }),
      response: Responses.wakeUp(),
    },
  ],
};

export default triggerSet;
