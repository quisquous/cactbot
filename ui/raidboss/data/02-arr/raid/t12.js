'use strict';

[{
  zoneRegex: /^The Final Coil Of Bahamut - Turn \(3\)$/,
  timelineFile: 't12.txt',
  triggers: [
    {
      id: 'T12 Phase 3',
      regex: / 15:\y{ObjectId}:Phoenix:B96:/,
      regexDe: / 15:\y{ObjectId}:Phönix:B96:/,
      regexFr: / 15:\y{ObjectId}:Phénix:B96:/,
      regexJa: / 15:\y{ObjectId}:フェニックス:B96:/,
      sound: 'Long',
      run: function(data) {
        data.phase = 3;
      },
    },
    {
      id: 'T12 Bennu',
      regex: / 03:\y{ObjectId}:Added new combatant Bennu\./,
      regexDe: / 03:\y{ObjectId}:Added new combatant Bennu\./,
      regexFr: / 03:\y{ObjectId}:Added new combatant Bénou\./,
      regexJa: / 03:\y{ObjectId}:Added new combatant ベンヌ\./,
      delaySeconds: 55,
      durationSeconds: 4.5,
      infoText: function(data) {
        if (data.phase >= 3)
          return;
        return {
          en: 'Bennu Soon',
        };
      },
    },
    {
      id: 'T12 Revelation',
      regex: / 14:B87:Phoenix starts using Revelation on (\y{Name})\./,
      regexDe: / 14:B87:Phönix starts using Offenbarung on (\y{Name})\./,
      regexFr: / 14:B87:Phénix starts using Révélation on (\y{Name})\./,
      regexJa: / 14:B87:フェニックス starts using リヴァレーション on (\y{Name})\./,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Revelation on YOU',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches[1] != data.me) {
          return {
            en: 'Away from ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'T12 Blackfire',
      regex: / 14:B8C:Phoenix starts using Blackfire/,
      regexDe: / 14:B8C:Phönix starts using Schwarzfeuer/,
      regexFr: / 14:B8C:Phénix starts using Flamme Noire/,
      regexJa: / 14:B8C:フェニックス starts using 漆黒の炎/,
      infoText: {
        en: 'Blackfire Spread',
      },
    },
    {
      id: 'T12 Whitefire',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0020:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Whitefire on YOU',
      },
    },
    {
      id: 'T12 Bluefire',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0021:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Bluefire Away',
      },
    },
    {
      id: 'T12 Chain',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Chain Of Purgatory/,
      regexDe: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Kette Der Purgation/,
      regexFr: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Souffle Du Purgatoire/,
      regexJa: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of 誘爆/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Chain on YOU',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches[1] != data.me) {
          return {
            en: 'Chain on ' + data.ShortName(matches[1]),
          };
        }
      },
    },
  ],
}];
