'use strict';

[{
  zoneRegex: {
    en: /^The Drowned City Of Skalla$/,
    cn: /^沉没神殿斯卡拉遗迹$/,
  },
  triggers: [
    {
      id: 'Hrodric Tank',
      regex: Regexes.startsUsing({ id: '2661', source: 'Hrodric Poisontongue' }),
      regexDe: Regexes.startsUsing({ id: '2661', source: 'Hrodric Giftzunge' }),
      regexFr: Regexes.startsUsing({ id: '2661', source: 'Hrodric Le Médisant' }),
      regexJa: Regexes.startsUsing({ id: '2661', source: '直言のフロドリック' }),
      regexCn: Regexes.startsUsing({ id: '2661', source: '直言不讳 赫罗德里克' }),
      regexKo: Regexes.startsUsing({ id: '2661', source: '입바른 흐로드릭' }),
      response: Responses.tankCleave(),
    },
    {
      id: 'Hrodric Tail',
      regex: Regexes.startsUsing({ id: '2663', source: 'Hrodric Poisontongue', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2663', source: 'Hrodric Giftzunge', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2663', source: 'Hrodric Le Médisant', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2663', source: '直言のフロドリック', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2663', source: '直言不讳 赫罗德里克', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2663', source: '입바른 흐로드릭', capture: false }),
      alertText: function(data) {
        return data.role != 'tank' ? 'tail cleave' : '';
      },
      infoText: function(data) {
        return data.role == 'tank' ? 'tail cleave' : '';
      },
      tts: {
        en: 'tail attack',
        de: 'schweifattacke',
        fr: 'attaque queue',
        cn: '尾巴攻击',
      },
    },
    {
      id: 'Hrodric Eye',
      regex: Regexes.startsUsing({ id: '2665', source: 'Hrodric Poisontongue', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2665', source: 'Hrodric Giftzunge', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2665', source: 'Hrodric Le Médisant', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2665', source: '直言のフロドリック', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2665', source: '直言不讳 赫罗德里克', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2665', source: '입바른 흐로드릭', capture: false }),
      response: Responses.lookAway(),
    },
    {
      id: 'Hrodric Words',
      regex: Regexes.startsUsing({ id: '2662', source: 'Hrodric Poisontongue', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2662', source: 'Hrodric Giftzunge', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2662', source: 'Hrodric Le Médisant', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2662', source: '直言のフロドリック', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2662', source: '直言不讳 赫罗德里克', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2662', source: '입바른 흐로드릭', capture: false }),
      infoText: {
        en: 'avoid eye lasers',
        de: 'Augenlaser ausweichen',
        fr: 'Evitez les lasers',
        cn: '避开眼部激光',
      },
      tts: {
        en: 'eye laser',
        de: 'augen lesa',
        fr: 'laser',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Hrodric Poisontongue': 'Hrodric Giftzunge',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Hrodric Poisontongue': 'Hrodric le Médisant',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Hrodric Poisontongue': '直言のフロドリック',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Hrodric Poisontongue': '直言不讳 赫罗德里克',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Hrodric Poisontongue': '입바른 흐로드릭',
      },
    },
  ],
}];
