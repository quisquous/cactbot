'use strict';

// O4N - Deltascape 4.0 Normal

[{

  zoneRegex: {
    en: /^Deltascape \(V4\.0\)$/,
    cn: /^欧米茄时空狭缝 \(德尔塔幻境4\)$/,
  },
  timelineFile: 'o4n.txt',
  triggers: [
    {
      id: 'O4N Doom',
      regex: Regexes.startsUsing({ id: '24B7', source: 'Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '24B7', source: 'Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '24B7', source: 'Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: '24B7', source: 'エクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '24B7', source: '艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: '24B7', source: '엑스데스', capture: false }),
      condition: function(data) {
        return data.CanCleanse();
      },
      alertText: {
        en: 'Cleanse Doom soon',
        de: 'Reinige Verhängnis bald',
        cn: '驱散死宣',
      },
    },
    {
      id: 'O4N Standard Thunder',
      regex: Regexes.startsUsing({ id: '24BD', source: 'Exdeath' }),
      regexDe: Regexes.startsUsing({ id: '24BD', source: 'Exdeath' }),
      regexFr: Regexes.startsUsing({ id: '24BD', source: 'Exdeath' }),
      regexJa: Regexes.startsUsing({ id: '24BD', source: 'エクスデス' }),
      regexCn: Regexes.startsUsing({ id: '24BD', source: '艾克斯迪司' }),
      regexKo: Regexes.startsUsing({ id: '24BD', source: '엑스데스' }),
      response: Responses.tankCleave(),
    },
    {
      id: 'O4N Standard Fire',
      regex: Regexes.startsUsing({ id: '24BA', source: 'Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '24BA', source: 'Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '24BA', source: 'Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: '24BA', source: 'エクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '24BA', source: '艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: '24BA', source: '엑스데스', capture: false }),
      suppressSeconds: 5,
      response: Responses.spread(),
    },
    {
      id: 'O4N Empowered Blizzard',
      regex: Regexes.startsUsing({ id: '24C0', source: 'Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '24C0', source: 'Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '24C0', source: 'Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: '24C0', source: 'エクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '24C0', source: '艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: '24C0', source: '엑스데스', capture: false }),
      infoText: {
        en: 'Move around',
        de: 'Bewegen',
        cn: '不停移动',
      },
    },
    {
      id: 'O4N Empowered Fire',
      regex: Regexes.startsUsing({ id: '24BF', source: 'Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '24BF', source: 'Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '24BF', source: 'Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: '24BF', source: 'エクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '24BF', source: '艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: '24BF', source: '엑스데스', capture: false }),
      response: Responses.stopEverything(),
    },
    {
      id: 'O4N Empowered Thunder',
      regex: Regexes.startsUsing({ id: '24C1', source: 'Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '24C1', source: 'Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '24C1', source: 'Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: '24C1', source: 'エクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '24C1', source: '艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: '24C1', source: '엑스데스', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'O4N Decisive Battle ',
      regex: Regexes.startsUsing({ id: '2408', source: 'Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2408', source: 'Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2408', source: 'Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2408', source: 'エクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2408', source: '艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2408', source: '엑스데스', capture: false }),
      condition: function(data) {
        // Without a condition, this notifies on the first one, where it's meaningless.
        data.battleCount = data.battleCount || 0;
        data.battleCount += 1;
        return data.battleCount > 1;
      },
      delaySeconds: 6,
      infoText: {
        en: 'Stand in the gap',
        de: 'In der Lücke stehen',
        cn: '远离中间位置',
      },
    },
    {
      id: 'O4N Zombie Breath',
      regex: Regexes.startsUsing({ id: '240A', source: 'Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '240A', source: 'Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '240A', source: 'Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: '240A', source: 'エクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '240A', source: '艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: '240A', source: '엑스데스', capture: false }),
      delaySeconds: 6,
      infoText: {
        en: 'Behind head--Avoid zombie breath',
        de: 'Hinter den Kopf - Vermeide den Zombie-Atem',
        cn: '站头后方',
      },
    },
    {
      id: 'O4N Black Hole',
      regex: Regexes.startsUsing({ id: '24C8', source: 'Exdeath', target: 'Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '24C8', source: 'Exdeath', target: 'Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '24C8', source: 'Exdeath', target: 'Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: '24C8', source: 'エクスデス', target: 'エクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '24C8', source: '艾克斯迪司', target: '艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: '24C8', source: '엑스데스', target: '엑스데스', capture: false }),
      infoText: {
        en: 'Avoid black holes',
        de: 'Weiche den Schwarzen Löchern aus',
        cn: '远离黑洞',
      },
    },
    {
      id: 'O4N Vacuum Wave',
      regex: Regexes.startsUsing({ id: '24B8', source: 'Exdeath', target: 'Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '24B8', source: 'Exdeath', target: 'Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '24B8', source: 'Exdeath', target: 'Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: '24B8', source: 'エクスデス', target: 'エクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '24B8', source: '艾克斯迪司', target: '艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: '24B8', source: '엑스데스', target: '엑스데스', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'O4N Flare',
      regex: Regexes.headMarker({ id: '0057' }),
      condition: Conditions.targetIsYou(),
      alertText: {
        en: 'Flare on YOU',
        de: 'Flare auf DIR',
        cn: '核爆点名',
      },
    },
    {
      id: 'O4N Holy',
      regex: Regexes.headMarker({ id: '003E' }),
      response: Responses.stackOn(),
    },
    {
      id: 'O4N Meteor',
      regex: Regexes.startsUsing({ id: '24C6', source: 'Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '24C6', source: 'Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '24C6', source: 'Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: '24C6', source: 'エクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '24C6', source: '艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: '24C6', source: '엑스데스', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.bigAoe(),
    },
  ],
},
];
