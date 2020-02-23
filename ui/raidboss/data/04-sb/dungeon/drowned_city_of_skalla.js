'use strict';

[{
  zoneRegex: /^The Drowned City Of Skalla$/,
  triggers: [
    {
      id: 'Hrodric Tank',
      regex: Regexes.startsUsing({ id: '2661', source: 'Hrodric Poisontongue', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2661', source: 'Hrodric Giftzunge', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2661', source: 'Hrodric Le Médisant', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2661', source: '直言のフロドリック', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2661', source: '直言不讳 赫罗德里克', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2661', source: '입바른 흐로드릭', capture: false }),
      infoText: function(data) {
        return data.role != 'tank' ? 'tank cleave' : '';
      },
      alertText: function(data) {
        return data.role == 'tank' ? 'tank cleave' : '';
      },
      tts: {
        en: 'tank cleave',
        de: 'tenk klief',
        fr: 'tank clive',
      },
    },
    {
      id: 'Hrodric Tail',
      regex: Regexes.startsUsing({ id: '2663', source: 'Hrodric Poisontongue', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2663', source: 'Hrodric Giftzunge', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2663', source: 'Hrodric Le Médisant', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2663', source: '直言のフロドリック', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2663', source: '直言不讳 赫罗德里克', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2663', source: '입바른 흐로드릭', capture: false }),
      infoText: function(data) {
        return data.role == 'tank' ? 'tail cleave' : '';
      },
      alertText: function(data) {
        return data.role != 'tank' ? 'tail cleave' : '';
      },
      tts: {
        en: 'tail attack',
        de: 'schweifattacke',
        fr: 'attaque queue',
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
      alertText: {
        en: 'look away',
        de: 'wegschauen',
        fr: 'Détournez le regard',
      },
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
      },
      tts: {
        en: 'eye laser',
        de: 'augen lesa',
        fr: 'laser',
      },
    },
  ],
}];
