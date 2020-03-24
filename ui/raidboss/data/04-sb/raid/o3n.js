'use strict';

// O3 - Deltascape 3.0 Normal
[{
  zoneRegex: {
    en: /^Deltascape \(V3\.0\)$/,
  },
  timelineFile: 'o3n.txt',
  timelineTriggers: [
    {
      id: 'O3N Frost Breath',
      regex: /Frost Breath/,
      beforeSeconds: 4,
      condition: function(data) {
        return data.role == 'tank'&& !data.activeTank == data.me;
      },
      // This will at least warn the Dragon tank that they need to be careful.
      response: Responses.tankCleave('alert'),
    },
  ],
  triggers: [
    {
      id: 'O3N Phase Initialization',
      regex: Regexes.ability({ id: '367', source: 'Halicarnassus', capture: false }),
      regexDe: Regexes.ability({ id: '367', source: 'Halikarnassos', capture: false }),
      regexFr: Regexes.ability({ id: '367', source: 'Halicarnasse', capture: false }),
      regexJa: Regexes.ability({ id: '367', source: 'ハリカルナッソス', capture: false }),
      regexCn: Regexes.ability({ id: '367', source: '哈利卡纳苏斯', capture: false }),
      regexKo: Regexes.ability({ id: '367', source: '할리카르나소스', capture: false }),
      condition: function(data) {
        return !data.phaseNumber;
      },
      run: function(data) {
        data.phaseNumber = 1;
      },
    },
    {
      id: 'O3N Phase Tracker',
      regex: Regexes.startsUsing({ id: '2304', source: 'Halicarnassus', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2304', source: 'Halikarnassos', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2304', source: 'Halicarnasse', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2304', source: 'ハリカルナッソス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2304', source: '哈利卡纳苏斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2304', source: '할리카르나소스', capture: false }),
      run: function(data) {
        data.phaseNumber += 1;
      },
    },
    {
      // Normal spellblade holy with one stack point.
      // "64" is a stack marker.  "65" is the prey marker.
      // The debuff order in the logs is:
      //   (1) stack marker
      //   (2) prey marker
      //   (3) prey marker
      id: 'O3N Spellblade Holy Standard',
      regex: Regexes.headMarker({ id: ['0064', '0065'] }),
      condition: function(data, matches) {
        // Cave phase has no stack markers.
        if (data.phaseNumber == 2)
          return false;

        data.holyTargets = data.holyTargets || [];
        data.holyTargets.push(matches.target);
        return data.holyTargets.length == 3;
      },
      alertText: function(data) {
        if (data.holyTargets[0] == data.me) {
          return {
            en: 'Stack on YOU',
            de: 'Stack auf DIR',
          };
        }
        for (let i = 1; i < 3; i++) {
          if (data.holyTargets[i] == data.me) {
            return {
              en: 'Get out',
              de: 'Raus da',
            };
          }
        }
        return {
          en: 'Stack on ' + data.holyTargets[0],
          de: 'Stack auf ' + data.holyTargets[0],
        };
      },
      run: function(data) {
        delete data.holyTargets;
      },
    },
    {
      id: 'O3N Spellblade Holy Cave',
      regex: Regexes.headMarker({ id: '0065' }),
      condition: function(data, matches) {
        return data.phaseNumber == 2 && data.me == matches.target;
      },
      response: Responses.spread(),
    },
    {
      id: 'O3N Spellblade Holy Mindjack',
      regex: Regexes.headMarker({ id: '0064' }),
      condition: function(data) {
        if (data.phaseNumber < 3)
          return false;
        data.holyCounter = data.holyCounter || 0;
        return (data.holyCounter % 2 == 0);
      },
      response: Responses.stackOn(),
      run: function(data) {
        data.holyCounter += 1;
        delete data.holyTargets;
      },
    },
    {
      id: 'O3N The Queen\'s Waltz: Crystal Square',
      regex: Regexes.startsUsing({ id: '2471', source: 'Halicarnassus', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2471', source: 'Halikarnassos', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2471', source: 'Halicarnasse', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2471', source: 'ハリカルナッソス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2471', source: '哈利卡纳苏斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2471', source: '할리카르나소스', capture: false }),
      infoText: {
        en: 'Get on crystal square',
        de: 'Kristallfeld',
      },
      tts: {
        en: 'blue square',
        de: 'blaues feld',
      },
    },
    {
      id: 'O3N Great Dragon',
      regex: Regexes.addedCombatant({ name: 'Great Dragon', capture: false }),
      regexDe: Regexes.addedCombatant({ name: 'Riesendrache', capture: false }),
      regexFr: Regexes.addedCombatant({ name: 'dragon suprême', capture: false }),
      regexJa: Regexes.addedCombatant({ name: 'ドラゴングレイト', capture: false }),
      regexCn: Regexes.addedCombatant({ name: '巨龙', capture: false }),
      regexKo: Regexes.addedCombatant({ name: '거대 드래곤', capture: false }),
      condition: function(data) {
        return data.role == 'tank';
      },
      infoText: {
        en: 'Grab dragon--point away',
      },
    },
    {
      id: 'O3N Game Counter Initialize',
      regex: Regexes.startsUsing({ id: '2304', source: 'Halicarnassus', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2304', source: 'Halikarnassos', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2304', source: 'Halicarnasse', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2304', source: 'ハリカルナッソス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2304', source: '哈利卡纳苏斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2304', source: '할리카르나소스', capture: false }),
      run: function(data) {
        data.gameCount = data.gameCount || 1;
      },
    },
    {
      id: 'O3N Good Ribbit',
      regex: Regexes.startsUsing({ id: '2466', source: 'Halicarnassus', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2466', source: 'Halikarnassos', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2466', source: 'Halicarnasse', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2466', source: 'ハリカルナッソス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2466', source: '哈利卡纳苏斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2466', source: '할리카르나소스', capture: false }),
      condition: function(data) {
        return data.phaseNumber == 3 && data.gameCount % 2 == 0;
      },
      alertText: {
        en: 'Get hit by Ribbit',
      },
    },
    {
      id: 'O3N Bad Ribbit',
      regex: Regexes.startsUsing({ id: '2466', source: 'Halicarnassus', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2466', source: 'Halikarnassos', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2466', source: 'Halicarnasse', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2466', source: 'ハリカルナッソス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2466', source: '哈利卡纳苏斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2466', source: '할리카르나소스', capture: false }),
      condition: function(data) {
        return !(data.phaseNumber == 3 && data.gameCount % 2 == 0);
      },
      response: Responses.awayFromFront(),
    },
    {
      id: 'O3N The Game',
      regex: Regexes.startsUsing({ id: '246D', source: 'Halicarnassus', capture: false }),
      regexDe: Regexes.startsUsing({ id: '246D', source: 'Halikarnassos', capture: false }),
      regexFr: Regexes.startsUsing({ id: '246D', source: 'Halicarnasse', capture: false }),
      regexJa: Regexes.startsUsing({ id: '246D', source: 'ハリカルナッソス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '246D', source: '哈利卡纳苏斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '246D', source: '할리카르나소스', capture: false }),
      // No point in checking whether the user has the frog debuff,
      // if they didn't get it, or got it when they shouldn't have, there's no fixing things.
      infoText: function(data) {
        if (data.phaseNumber == 3 && data.gameCount % 2 == 0) {
          return {
            en: 'Stand on frog tile',
          };
        }
        return {
          // Maybe there's a cleaner way to do this than just enumerating roles?
          'tank': {
            en: 'Stand on shield',
          },
          'healer': {
            en: 'Stand on cross',
          },
          'dps': {
            en: 'Stand on sword',
          },
        }[data.role];
      },
      run: function(data) {
        data.gameCount += 1;
      },
    },
    {
      id: 'O3N Mindjack Forward',
      regex: Regexes.startsUsing({ id: '2467', source: 'Halicarnassus', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2467', source: 'Halikarnassos', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2467', source: 'Halicarnasse', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2467', source: 'ハリカルナッソス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2467', source: '哈利卡纳苏斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2467', source: '할리카르나소스', capture: false }),
      infoText: {
        en: 'Mindjack: Forward',
        de: 'Geistlenkung: Vorwärts',
      },
    },
    {
      id: 'O3N Mindjack Backward',
      regex: Regexes.startsUsing({ id: '2468', source: 'Halicarnassus', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2468', source: 'Halikarnassos', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2468', source: 'Halicarnasse', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2468', source: 'ハリカルナッソス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2468', source: '哈利卡纳苏斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2468', source: '할리카르나소스', capture: false }),
      infoText: {
        en: 'Mindjack: Back',
        de: 'Geistlenkung: Zurück',
      },
    },
    {
      id: 'O3N Mindjack Left',
      regex: Regexes.startsUsing({ id: '2469', source: 'Halicarnassus', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2469', source: 'Halikarnassos', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2469', source: 'Halicarnasse', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2469', source: 'ハリカルナッソス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2469', source: '哈利卡纳苏斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2469', source: '할리카르나소스', capture: false }),
      infoText: {
        en: 'Mindjack: Left',
        de: 'Geistlenkung: Links',
      },
    },
    {
      id: 'O3N Mindjack Right',
      regex: Regexes.startsUsing({ id: '246A', source: 'Halicarnassus', capture: false }),
      regexDe: Regexes.startsUsing({ id: '246A', source: 'Halikarnassos', capture: false }),
      regexFr: Regexes.startsUsing({ id: '246A', source: 'Halicarnasse', capture: false }),
      regexJa: Regexes.startsUsing({ id: '246A', source: 'ハリカルナッソス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '246A', source: '哈利卡纳苏斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '246A', source: '할리카르나소스', capture: false }),
      infoText: {
        en: 'Mindjack: Right',
        de: 'Geistlenkung: Rechts',
      },
    },
  ],
  timelineReplace: [

  ],
}];
