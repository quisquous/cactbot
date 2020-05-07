'use strict';

[{
  zoneRegex: {
    en: /^The Final Coil Of Bahamut - Turn \(3\)$/,
    cn: /^巴哈姆特大迷宫 \(真源之章3\)$/,
  },
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
          de: 'Bennu Add bald',
          fr: 'Bénou bientôt',
          cn: '小鸟即将出现',
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
            fr: 'Révélation sur VOUS',
            cn: '天启点名',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches.target != data.me) {
          return {
            en: 'Away from ' + data.ShortName(matches.target),
            de: 'Weg von ' + data.ShortName(matches.target),
            fr: 'Éloignez-vous de ' + data.ShortName(matches.target),
            cn: '远离' + data.ShortName(matches.target),
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
        fr: 'Flamme noire, dispersez-vous',
        cn: '黑火分散',
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
        cn: '白火点名',
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
        fr: 'Flamme bleue, éloignez-vous',
        cn: '蓝火远离',
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
            cn: '毒点名',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches.target != data.me) {
          return {
            en: 'Chain on ' + data.ShortName(matches.target),
            de: 'Kette auf ' + data.ShortName(matches.target),
            fr: 'Chaine sur ' + data.ShortName(matches.target),
            cn: '毒点名' + data.ShortName(matches.target),
          };
        }
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Bennu': 'Bennu',
        'Phoenix(?!-)': 'Phönix',
        'Phoenix-Egi': 'Phönix-Egi',
      },
      'replaceText': {
        '(?<! )Rebirth': 'Wiedergeburt',
        'Bennu Add': 'Bennu Add',
        'Blackfire': 'Schwarzfeuer',
        'Bluefire': 'Blaufeuer',
        'Brand Of Purgatory': 'Zeichen der Läuterung',
        'Flames Of Rebirth': 'Flammen der Wiedergeburt',
        'Flames Of Unforgiveness': 'Zeichen der Läuterung',
        'Fountain Of Fire': 'Quell des Feuers',
        'Fountain(?! Of Fire)': 'Quell',
        'Redfire Plume': 'Rotfeuer-Feder',
        'Redfire(?! )': 'Rotfeuer',
        'Revelation': 'Offenbarung',
        'Scorched Pinion': 'Versengte Schwinge',
        'Summon': 'Beschwörung',
        'Whitefire': 'Weißfeuer',
      },
      '~effectNames': {
        'Chain Of Purgatory': 'Kette der Purgation',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Bennu': 'Bénou',
        'Phoenix(?!-)': 'Phénix',
        'Phoenix-Egi': 'Phénix-Egi',
      },
      'replaceText': {
        '(?<! )Rebirth': 'Résurrection',
        'Bennu Add': 'Add Bénou',
        'Blackfire': 'Flamme noire',
        'Bluefire': 'Flamme bleue',
        'Brand Of Purgatory': 'Tison du purgatoire',
        'Flames Of Rebirth': 'Feu résurrecteur',
        'Flames Of Unforgiveness': 'Flammes du purgatoire',
        'Fountain Of Fire': 'Flamme de la vie',
        'Fountain Tick': 'Fontaine tick',
        'Redfire Plume': 'Panache rouge',
        'Redfire(?! )': 'Flambée rouge',
        'Revelation': 'Révélation',
        'Scorched Pinion': 'Aile embrasante',
        'Summon': 'Invocation',
        'Whitefire': 'Flamme blanche',
      },
      '~effectNames': {
        'Chain Of Purgatory': 'Souffle du purgatoire',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Bennu': 'ベンヌ',
        'Phoenix(?!-)': 'フェニックス',
        'Phoenix-Egi': 'フェニックス・エギ',
      },
      'replaceText': {
        '(?<! )Rebirth': '新生',
        'Bennu Add': 'ベンヌ Add',
        'Blackfire': '漆黒の炎',
        'Bluefire': '青碧の炎',
        'Brand Of Purgatory': '煉獄の炎',
        'Flames Of Rebirth': '転生の炎',
        'Flames Of Unforgiveness': '煉獄の爆炎',
        'Fountain Of Fire': '霊泉の炎',
        'Redfire Plume': '赤熱の炎柱',
        'Redfire(?! )': '紅蓮の炎',
        'Revelation': 'リヴァレーション',
        'Scorched Pinion': '炎の翼',
        'Summon': '召喚',
        'Whitefire': '白熱の炎',
      },
      '~effectNames': {
        'Chain Of Purgatory': '誘爆',
      },
    },
    {
      'locale': 'cn',
      'missingTranslations': true,
      'replaceSync': {
        'Bennu': '贝努鸟',
        'Phoenix(?!-)': '不死鸟',
        'Phoenix-Egi': '不死鸟之灵',
      },
      'replaceText': {
        '(?<! )Rebirth': '重生',
        'Bennu Add': '贝努鸟 Add',
        'Blackfire': '漆黑之炎',
        'Bluefire': '青蓝之炎',
        'Brand Of Purgatory': '炼狱之炎',
        'Flames Of Rebirth': '转生之炎',
        'Flames Of Unforgiveness': '炼狱之燎火',
        'Fountain Of Fire': '灵泉之炎',
        'Redfire Plume': '赤红之炎柱',
        'Redfire(?! )': '红莲之炎',
        'Revelation': '天启',
        'Scorched Pinion': '炎之翼',
        'Summon': '召唤',
        'Whitefire': '白热之炎',
      },
      '~effectNames': {
        'Chain Of Purgatory': '引爆',
      },
    },
    {
      'locale': 'ko',
      'missingTranslations': true,
      'replaceSync': {
        'Bennu': '벤누',
        'Phoenix(?!-)': '피닉스',
        'Phoenix-Egi': '피닉스 에기',
      },
      'replaceText': {
        '(?<! )Rebirth': '소생',
        'Bennu Add': '벤누 Add',
        'Blackfire': '칠흑의 불꽃',
        'Bluefire': '청벽의 불꽃',
        'Brand Of Purgatory': '연옥의 불꽃',
        'Flames Of Rebirth': '윤회의 불꽃',
        'Flames Of Unforgiveness': '연옥의 폭염',
        'Fountain Of Fire': '영검의 불꽃',
        'Redfire Plume': '작열 불기둥',
        'Redfire(?! )': '홍련의 불꽃',
        'Revelation': '계시',
        'Scorched Pinion': '타오르는 날개',
        'Summon': '소환',
        'Whitefire': '백열의 불꽃',
      },
      '~effectNames': {
        'Chain Of Purgatory': '유폭',
      },
    },
  ],
}];
