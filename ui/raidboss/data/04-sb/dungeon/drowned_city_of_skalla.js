'use strict';

[{
  zoneId: ZoneId.TheDrownedCityOfSkalla,
  triggers: [
    {
      id: 'Hrodric Tank',
      netRegex: NetRegexes.startsUsing({ id: '2661', source: 'Hrodric Poisontongue' }),
      netRegexDe: NetRegexes.startsUsing({ id: '2661', source: 'Hrodric Giftzunge' }),
      netRegexFr: NetRegexes.startsUsing({ id: '2661', source: 'Hrodric Le Médisant' }),
      netRegexJa: NetRegexes.startsUsing({ id: '2661', source: '直言のフロドリック' }),
      netRegexCn: NetRegexes.startsUsing({ id: '2661', source: '直言不讳 赫罗德里克' }),
      netRegexKo: NetRegexes.startsUsing({ id: '2661', source: '입바른 흐로드릭' }),
      response: Responses.tankCleave(),
    },
    {
      id: 'Hrodric Tail',
      netRegex: NetRegexes.startsUsing({ id: '2663', source: 'Hrodric Poisontongue', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2663', source: 'Hrodric Giftzunge', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2663', source: 'Hrodric Le Médisant', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2663', source: '直言のフロドリック', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2663', source: '直言不讳 赫罗德里克', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2663', source: '입바른 흐로드릭', capture: false }),
      alertText: function(data) {
        return data.role != 'tank' ? 'tail cleave' : '';
      },
      infoText: function(data) {
        return data.role == 'tank' ? 'tail cleave' : '';
      },
      tts: {
        en: 'tail attack',
        de: 'schweifattacke',
        fr: 'attaquez la queue',
        cn: '尾巴攻击',
        ko: '꼬리쓸기',
      },
    },
    {
      id: 'Hrodric Eye',
      netRegex: NetRegexes.startsUsing({ id: '2665', source: 'Hrodric Poisontongue', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2665', source: 'Hrodric Giftzunge', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2665', source: 'Hrodric Le Médisant', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2665', source: '直言のフロドリック', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2665', source: '直言不讳 赫罗德里克', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2665', source: '입바른 흐로드릭', capture: false }),
      response: Responses.lookAway(),
    },
    {
      id: 'Hrodric Words',
      netRegex: NetRegexes.startsUsing({ id: '2662', source: 'Hrodric Poisontongue', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2662', source: 'Hrodric Giftzunge', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2662', source: 'Hrodric Le Médisant', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2662', source: '直言のフロドリック', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2662', source: '直言不讳 赫罗德里克', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2662', source: '입바른 흐로드릭', capture: false }),
      infoText: {
        en: 'avoid eye lasers',
        de: 'Augenlaser ausweichen',
        fr: 'Évitez les lasers',
        cn: '避开眼部激光',
        ko: '레이저 피하기',
      },
      tts: {
        en: 'eye laser',
        de: 'augen lesa',
        fr: 'laser',
        cn: '离开正面',
        ko: '레이저',
      },
    },
  ],
}];
