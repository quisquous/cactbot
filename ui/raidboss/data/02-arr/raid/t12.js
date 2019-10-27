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
          de: 'Bennu Add',
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
            de: 'Offenbarung auf DIR',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches[1] != data.me) {
          return {
            en: 'Away from ' + data.ShortName(matches[1]),
            de: 'Weg von ' + data.ShortName(matches[1]),
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
        de: 'Schwarzfeuer verteilen',
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
        de: 'Weißfeuer auf DIR',
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
        de: 'Blaufeuer wegbringen',
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
            de: 'Kette auf DIR',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches[1] != data.me) {
          return {
            en: 'Chain on ' + data.ShortName(matches[1]),
            de: 'Kette auf ' + data.ShortName(matches[1]),
          };
        }
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Engage!': 'Start!',
        'Phoenix-Egi': 'Phönix-Egi',
        'Phoenix': 'Phönix',
      },
      'replaceText': {
        'Bennu Add': 'Bennu Add',
        'Blackfire': 'Schwarzfeuer',
        'Bluefire': 'Blaufeuer',
        'Brand Of Purgatory': 'Zeichen der Läuterung',
        'Flames Of Rebirth': 'Flammen der Wiedergeburt',
        'Flames Of Unforgiveness': 'Zeichen der Läuterung',
        'Fountain': 'Quell des Feuers',
        'Fountain Of Fire': 'Quell des Feuers',
        'Rebirth': 'Wiedergeburt',
        'Redfire Plume': 'Rotfeuer-Feder',
        'Redfire': 'Rotfeuer',
        'Revelation': 'Offenbarung',
        'Scorched Pinion': 'Versengte Schwinge',
        'Summon': 'Beschwörung',
        'Whitefire': 'Weißfeuer',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Engage!': 'À l\'attaque !',
        'Phoenix-Egi': 'Phénix-Egi',
        'Phoenix': 'Phénix',
      },
      'replaceText': {
        'Bennu Add': 'Bénou Add',
        'Blackfire': 'Flamme noire',
        'Bluefire': 'Flamme bleue',
        'Brand Of Purgatory': 'Tison du purgatoire',
        'Flames Of Rebirth': 'Feu résurrecteur',
        'Flames Of Unforgiveness': 'Flammes du purgatoire',
        'Fountain Of Fire': 'Flamme de la vie',
        'Fountain': 'Flamme de la vie',
        'Rebirth': 'Résurrection',
        'Redfire Plume': 'Panache rouge',
        'Redfire': 'Flambée rouge',
        'Revelation': 'Révélation',
        'Scorched Pinion': 'Aile embrasante',
        'Summon': 'Invocation',
        'Whitefire': 'Flamme blanche',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Engage!': '戦闘開始！',
        'Phoenix-Egi': 'フェニックス・エギ',
        'Phoenix': 'フェニックス',
      },
      'replaceText': {
        'Bennu Add': 'ベンヌ Add',
        'Blackfire': '漆黒の炎',
        'Bluefire': '青碧の炎',
        'Brand Of Purgatory': '煉獄の炎',
        'Flames Of Rebirth': '転生の炎',
        'Flames Of Unforgiveness': '煉獄の爆炎',
        'Fountain Of Fire': '霊泉の炎',
        'Fountain': '霊泉の炎',
        'Rebirth': '新生',
        'Redfire Plume': '赤熱の炎柱',
        'Redfire': '紅蓮の炎',
        'Revelation': 'リヴァレーション',
        'Scorched Pinion': '炎の翼',
        'Summon': '召喚',
        'Whitefire': '白熱の炎',
      },
    },
  ],
}];
