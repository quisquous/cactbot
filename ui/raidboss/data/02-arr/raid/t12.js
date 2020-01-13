'use strict';

[{
  zoneRegex: /^The Final Coil Of Bahamut - Turn \(3\)$/,
  timelineFile: 't12.txt',
  triggers: [
    {
      id: 'T12 Phase 3',
      regex: Regexes.ability({ id: 'B96', source: 'Phoenix', capture: false }),
      regexDe: Regexes.ability({ id: 'B96', source: 'Phönix', capture: false }),
      regexFr: Regexes.ability({ id: 'B96', source: 'Phénix', capture: false }),
      regexJa: Regexes.ability({ id: 'B96', source: 'フェニックス', capture: false }),
      regexCn: Regexes.ability({ id: 'B96', source: '不死鸟', capture: false }),
      regexKo: Regexes.ability({ id: 'B96', source: '피닉스', capture: false }),
      sound: 'Long',
      run: function(data) {
        data.phase = 3;
      },
    },
    {
      id: 'T12 Bennu',
      regex: Regexes.addedCombatant({ name: 'Bennu', capture: false }),
      regexDe: Regexes.addedCombatant({ name: 'Bennu', capture: false }),
      regexFr: Regexes.addedCombatant({ name: 'Bénou', capture: false }),
      regexJa: Regexes.addedCombatant({ name: 'ベンヌ', capture: false }),
      regexCn: Regexes.addedCombatant({ name: '贝努鸟', capture: false }),
      regexKo: Regexes.addedCombatant({ name: '벤누', capture: false }),
      delaySeconds: 55,
      durationSeconds: 4.5,
      infoText: function(data) {
        if (data.phase >= 3)
          return;
        return {
          en: 'Bennu Soon',
          de: 'Bennu Add',
          fr: 'Bénou bientôt',
        };
      },
    },
    {
      id: 'T12 Revelation',
      regex: Regexes.startsUsing({ id: 'B87', source: 'Phoenix' }),
      regexDe: Regexes.startsUsing({ id: 'B87', source: 'Phönix' }),
      regexFr: Regexes.startsUsing({ id: 'B87', source: 'Phénix' }),
      regexJa: Regexes.startsUsing({ id: 'B87', source: 'フェニックス' }),
      regexCn: Regexes.startsUsing({ id: 'B87', source: '不死鸟' }),
      regexKo: Regexes.startsUsing({ id: 'B87', source: '피닉스' }),
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Revelation on YOU',
            de: 'Offenbarung auf DIR',
            fr: 'Révélationsur VOUS',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches.target != data.me) {
          return {
            en: 'Away from ' + data.ShortName(matches.target),
            de: 'Weg von ' + data.ShortName(matches.target),
            fr: 'Ecartez-vous de ' + data.ShortName(matches.target),
          };
        }
      },
    },
    {
      id: 'T12 Blackfire',
      regex: Regexes.startsUsing({ id: 'B8C', source: 'Phoenix', capture: false }),
      regexDe: Regexes.startsUsing({ id: 'B8C', source: 'Phönix', capture: false }),
      regexFr: Regexes.startsUsing({ id: 'B8C', source: 'Phénix', capture: false }),
      regexJa: Regexes.startsUsing({ id: 'B8C', source: 'フェニックス', capture: false }),
      regexCn: Regexes.startsUsing({ id: 'B8C', source: '不死鸟', capture: false }),
      regexKo: Regexes.startsUsing({ id: 'B8C', source: '피닉스', capture: false }),
      infoText: {
        en: 'Blackfire Spread',
        de: 'Schwarzfeuer verteilen',
        fr: 'Flamme noire, dispersion',
      },
    },
    {
      id: 'T12 Whitefire',
      regex: Regexes.headMarker({ id: '0020' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Whitefire on YOU',
        de: 'Weißfeuer auf DIR',
        fr: 'Flamme blanche sur VOUS',
      },
    },
    {
      id: 'T12 Bluefire',
      regex: Regexes.headMarker({ id: '0021' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Bluefire Away',
        de: 'Blaufeuer wegbringen',
        fr: 'Flame bleue, écartez-vous',
      },
    },
    {
      id: 'T12 Chain',
      regex: Regexes.gainsEffect({ effect: 'Chain Of Purgatory' }),
      regexDe: Regexes.gainsEffect({ effect: 'Kette Der Purgation' }),
      regexFr: Regexes.gainsEffect({ effect: 'Souffle Du Purgatoire' }),
      regexJa: Regexes.gainsEffect({ effect: '誘爆' }),
      regexCn: Regexes.gainsEffect({ effect: '引爆' }),
      regexKo: Regexes.gainsEffect({ effect: '유폭' }),
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Chain on YOU',
            de: 'Kette auf DIR',
            fr: 'Chaine sur VOUS',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches.target != data.me) {
          return {
            en: 'Chain on ' + data.ShortName(matches[1]),
            de: 'Kette auf ' + data.ShortName(matches[1]),
            fr: 'Chaine sur ' + data.ShortName(matches[1]),
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
