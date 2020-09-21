'use strict';

[{
  zoneId: ZoneId.TheFinalCoilOfBahamutTurn3,
  timelineFile: 't12.txt',
  triggers: [
    {
      id: 'T12 Phase 3',
      netRegex: NetRegexes.ability({ id: 'B96', source: 'Phoenix', capture: false }),
      netRegexDe: NetRegexes.ability({ id: 'B96', source: 'Phönix', capture: false }),
      netRegexFr: NetRegexes.ability({ id: 'B96', source: 'Phénix', capture: false }),
      netRegexJa: NetRegexes.ability({ id: 'B96', source: 'フェニックス', capture: false }),
      netRegexCn: NetRegexes.ability({ id: 'B96', source: '不死鸟', capture: false }),
      netRegexKo: NetRegexes.ability({ id: 'B96', source: '피닉스', capture: false }),
      sound: 'Long',
      run: function(data) {
        data.phase = 3;
      },
    },
    {
      id: 'T12 Bennu',
      netRegex: NetRegexes.addedCombatant({ name: 'Bennu', capture: false }),
      netRegexDe: NetRegexes.addedCombatant({ name: 'Bennu', capture: false }),
      netRegexFr: NetRegexes.addedCombatant({ name: 'Bénou', capture: false }),
      netRegexJa: NetRegexes.addedCombatant({ name: 'ベンヌ', capture: false }),
      netRegexCn: NetRegexes.addedCombatant({ name: '贝努鸟', capture: false }),
      netRegexKo: NetRegexes.addedCombatant({ name: '벤누', capture: false }),
      delaySeconds: 55,
      durationSeconds: 4.5,
      infoText: function(data) {
        if (data.phase >= 3)
          return;
        return {
          en: 'Bennu Soon',
          de: 'Bennu Add bald',
          fr: 'Bénou bientôt',
          ja: 'まもなくベンヌ',
          cn: '小鸟即将出现',
        };
      },
    },
    {
      id: 'T12 Revelation',
      netRegex: NetRegexes.startsUsing({ id: 'B87', source: 'Phoenix' }),
      netRegexDe: NetRegexes.startsUsing({ id: 'B87', source: 'Phönix' }),
      netRegexFr: NetRegexes.startsUsing({ id: 'B87', source: 'Phénix' }),
      netRegexJa: NetRegexes.startsUsing({ id: 'B87', source: 'フェニックス' }),
      netRegexCn: NetRegexes.startsUsing({ id: 'B87', source: '不死鸟' }),
      netRegexKo: NetRegexes.startsUsing({ id: 'B87', source: '피닉스' }),
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Revelation on YOU',
            de: 'Offenbarung auf DIR',
            fr: 'Révélation sur VOUS',
            ja: '自分にリヴァレーション',
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
            ja: data.ShortName(matches.target) + 'に離れ',
            cn: '远离' + data.ShortName(matches.target),
          };
        }
      },
    },
    {
      id: 'T12 Blackfire',
      netRegex: NetRegexes.startsUsing({ id: 'B8C', source: 'Phoenix', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: 'B8C', source: 'Phönix', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: 'B8C', source: 'Phénix', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: 'B8C', source: 'フェニックス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: 'B8C', source: '不死鸟', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: 'B8C', source: '피닉스', capture: false }),
      infoText: {
        en: 'Blackfire Spread',
        de: 'Schwarzfeuer verteilen',
        fr: 'Flamme noire, dispersez-vous',
        ja: '漆黒の炎、散開',
        cn: '黑火分散',
      },
    },
    {
      id: 'T12 Whitefire',
      netRegex: NetRegexes.headMarker({ id: '0020' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Whitefire on YOU',
        de: 'Weißfeuer auf DIR',
        fr: 'Flamme blanche sur VOUS',
        ja: '自分に白熱の炎',
        cn: '白火点名',
      },
    },
    {
      id: 'T12 Bluefire',
      netRegex: NetRegexes.headMarker({ id: '0021' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Bluefire Away',
        de: 'Blaufeuer wegbringen',
        fr: 'Flamme bleue, éloignez-vous',
        ja: '青碧の炎、離れ',
        cn: '蓝火远离',
      },
    },
    {
      // Chain Of Purgatory
      id: 'T12 Chain',
      netRegex: NetRegexes.gainsEffect({ effectId: '24D' }),
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Chain on YOU',
            de: 'Kette auf DIR',
            fr: 'Chaine sur VOUS',
            ja: '自分に誘爆',
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
            ja: data.ShortName(matches.target) + 'に誘爆',
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
        'Summon': 'Incidence',
        'Whitefire': 'Flamme blanche',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Bennu': 'ベンヌ',
        'Phoenix(?!-)': 'フェニックス',
        'Phoenix-Egi': 'フェニックス・エギ',
      },
      'replaceText': {
        '(?<! )Rebirth': '新生',
        'Bennu Add': '雑魚: ベンヌ',
        'Blackfire': '漆黒の炎',
        'Bluefire': '青碧の炎',
        'Brand Of Purgatory': '煉獄の炎',
        'Flames Of Rebirth': '転生の炎',
        'Flames Of Unforgiveness': '煉獄の爆炎',
        'Fountain Of Fire': '霊泉の炎',
        'Fountain Tick': '霊泉の炎: ',
        'Redfire Plume': '赤熱の炎柱',
        'Redfire(?! )': '紅蓮の炎',
        'Revelation': 'リヴァレーション',
        'Scorched Pinion': '炎の翼',
        'Summon': '招来',
        'Whitefire': '白熱の炎',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Bennu': '贝努鸟',
        'Phoenix(?!-)': '不死鸟',
        'Phoenix-Egi': '不死鸟之灵',
      },
      'replaceText': {
        '(?<! )Rebirth': '重生',
        'Bennu Add': '贝努鸟出现',
        'Blackfire': '漆黑之炎',
        'Bluefire': '青蓝之炎',
        'Brand Of Purgatory': '炼狱之炎',
        'Flames Of Rebirth': '转生之炎',
        'Flames Of Unforgiveness': '炼狱之燎火',
        'Fountain Of Fire': '灵泉之炎',
        'Fountain(?! Of Fire)': '灵泉',
        'Redfire Plume': '赤红之炎柱',
        'Redfire(?! )': '红莲之炎',
        'Revelation': '天启',
        'Scorched Pinion': '炎之翼',
        'Summon': '召唤',
        'Whitefire': '白热之炎',
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
    },
  ],
}];
