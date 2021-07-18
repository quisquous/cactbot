import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheDrownedCityOfSkalla,
  timelineFile: 'drowned_city_of_skalla.txt',
  timelineTriggers: [
    {
      // There is a startsUsing line, but the cast time is under 3 seconds.
      id: 'Skalla Torpedo',
      regex: /Torpedo/,
      beforeSeconds: 4,
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'Skalla Bubble Burst',
      regex: /Bubble Burst/,
      beforeSeconds: 3,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Avoid Bubble Explosions',
        },
      },
    },
  ],
  triggers: [
    {
      id: 'Skalla Rising Seas',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '2650', source: 'Kelpie', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      id: 'Skalla Hydro Pull',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '2651', source: 'Kelpie', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'Skalla Hydro Push',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '2652', source: 'Kelpie', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'Skalla Bloody Puddle',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '002B' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Skalla Rusting Claw',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '2661', source: 'Hrodric Poisontongue' }),
      netRegexDe: NetRegexes.startsUsing({ id: '2661', source: 'Hrodric Giftzunge' }),
      netRegexFr: NetRegexes.startsUsing({ id: '2661', source: 'Hrodric Le Médisant' }),
      netRegexJa: NetRegexes.startsUsing({ id: '2661', source: '直言のフロドリック' }),
      netRegexCn: NetRegexes.startsUsing({ id: '2661', source: '直言不讳 赫罗德里克' }),
      netRegexKo: NetRegexes.startsUsing({ id: '2661', source: '입바른 흐로드릭' }),
      response: Responses.tankCleave(),
    },
    {
      id: 'Skalla Tail Drive',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '2663', source: 'Hrodric Poisontongue', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2663', source: 'Hrodric Giftzunge', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2663', source: 'Hrodric Le Médisant', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2663', source: '直言のフロドリック', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2663', source: '直言不讳 赫罗德里克', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2663', source: '입바른 흐로드릭', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'tail cleave',
          de: 'schweifattacke',
          fr: 'évitez la queue',
          ja: 'しっぽ！',
          cn: '尾巴攻击',
          ko: '꼬리쓸기',
        },
      },
    },
    {
      id: 'Skalla The Spin',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '2664', source: 'Hrodric Poisontongue', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'Skalla Ring Of Chaos',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0079' }),
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Ring on YOU',
        },
      },
    },
    {
      id: 'Skalla Cross Of Chaos',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '007A' }),
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Cross on YOU',
        },
      },
    },
    {
      id: 'Skalla Circle Of Chaos',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '001C' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Skalla Eye Of The Fire',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '2665', source: 'Hrodric Poisontongue', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2665', source: 'Hrodric Giftzunge', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2665', source: 'Hrodric Le Médisant', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2665', source: '直言のフロドリック', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2665', source: '直言不讳 赫罗德里克', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2665', source: '입바른 흐로드릭', capture: false }),
      response: Responses.lookAway(),
    },
    {
      id: 'Skalla Words Of Woe',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '2662', source: 'Hrodric Poisontongue', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2662', source: 'Hrodric Giftzunge', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2662', source: 'Hrodric Le Médisant', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2662', source: '直言のフロドリック', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2662', source: '直言不讳 赫罗德里克', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2662', source: '입바른 흐로드릭', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'avoid eye lasers',
          de: 'Augenlaser ausweichen',
          fr: 'Évitez les lasers',
          ja: '前方レーザーを避ける',
          cn: '避开眼部激光',
          ko: '레이저 피하기',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Cross Of Chaos/Circle Of Chaos': 'Circle/Cross',
        'Ring Of Chaos/Cross Of Chaos': 'Cross/Ring',
        'Ring Of Chaos/Circle Of Chaos': 'Circle/Ring',
        'Hydro Pull/Hydro Push': 'Hydro Pull/Push',
        'Order To Detonate \\(cast\\)': 'Order To Detonate',
      },
    },
  ],
};

export default triggerSet;
