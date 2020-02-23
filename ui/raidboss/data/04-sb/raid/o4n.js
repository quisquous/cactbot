'use strict';

// O4N - Deltascape 4.0 Normal

[{

  zoneRegex: /^Deltascape \(V4\.0\)$/,
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
      },
    },
    {
      id: 'O4N Standard Thunder',
      regex: Regexes.startsUsing({ id: '24BD', source: 'Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '24BD', source: 'Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '24BD', source: 'Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: '24BD', source: 'エクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '24BD', source: '艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: '24BD', source: '엑스데스', capture: false }),
      infoText: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'Tank cleave soon!',
          };
        }
        return {
          en: 'Avoid tank cleave',
        };
      },
    },
    {
      id: 'O4N Standard Fire',
      regex: Regexes.startsUsing({ id: '24BA', source: 'Exdeath' }),
      regexDe: Regexes.startsUsing({ id: '24BA', source: 'Exdeath' }),
      regexFr: Regexes.startsUsing({ id: '24BA', source: 'Exdeath' }),
      regexJa: Regexes.startsUsing({ id: '24BA', source: 'エクスデス' }),
      regexCn: Regexes.startsUsing({ id: '24BA', source: '艾克斯迪司' }),
      regexKo: Regexes.startsUsing({ id: '24BA', source: '엑스데스' }),
      alertText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Spread for Fire',
          };
        }
      },
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
      infoText: {
        en: 'Stop everything',
      },
    },
    {
      id: 'O4N Empowered Thunder',
      regex: Regexes.startsUsing({ id: '24C1', source: 'Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '24C1', source: 'Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '24C1', source: 'Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: '24C1', source: 'エクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '24C1', source: '艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: '24C1', source: '엑스데스', capture: false }),
      alertText: {
        en: 'Get out',
      },
    },
    {
      id: 'O4N Decisive Battle ',
      regex: Regexes.startsUsing({ id: '2408', source: 'Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2408', source: 'Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2408', source: 'Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2408', source: 'エクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2408', source: '艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2408', source: '엑스데스', capture: false }),
      delaySeconds: 6,
      infoText: {
        en: 'Stand in the gap',
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
      alertText: {
        en: 'Knockback',
      },
    },
    {
      id: 'O4N Flare',
      regex: Regexes.headMarker({ id: '0057' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Flare on YOU',
      },
    },
    {
      id: 'O4N Holy',
      regex: Regexes.headMarker({ id: '003E' }),
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Stack on YOU',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches.target),
        };
      },
    },
    {
      id: 'O4N Meteor',
      regex: Regexes.startsUsing({ id: '24C6', source: 'Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '24C6', source: 'Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '24C6', source: 'Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: '24C6', source: 'エクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '24C6', source: '艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: '24C6', source: '엑스데스', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      alertText: {
        en: 'Heavy raid damage',
      },
    },
  ],
},
];
