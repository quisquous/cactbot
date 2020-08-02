'use strict';

// TODO: should the post-staff "spread" happen unconditionally prior to marker?

[{
  zoneRegex: {
    en: /^Akh Afah Amphitheatre \(Hard\)$/,
    cn: /^希瓦歼灭战$/,
  },
  zoneId: ZoneId.AkhAfahAmphitheatreHard,
  timelineFile: 'shiva-hm.txt',
  timelineTriggers: [
    {
      id: 'ShivaHm Absolute Zero',
      regex: /Absolute Zero/,
      beforeSeconds: 5,
      condition: Conditions.caresAboutAOE(),
      // These are usually doubled, so avoid spamming.
      suppressSeconds: 10,
      response: Responses.aoe(),
    },
    {
      id: 'ShivaHm Icebrand',
      regex: /Icebrand/,
      beforeSeconds: 5,
      response: Responses.tankCleave(),
    },
  ],
  triggers: [
    {
      id: 'ShivaHm Hailstorm Marker',
      netRegex: NetRegexes.headMarker({ id: '001D' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread('alert'),
    },
    {
      id: 'ShivaHm Glacier Bash',
      netRegex: NetRegexes.startsUsing({ id: '9A1', capture: false }),
      response: Responses.getBehind('info'),
    },
    {
      id: 'ShivaHm Permafrost',
      netRegex: NetRegexes.startsUsing({ id: '999', capture: false }),
      response: Responses.stopMoving('alert'),
    },
    {
      id: 'ShivaHm Ice Boulder',
      netRegex: NetRegexes.ability({ id: '9A3' }),
      condition: Conditions.targetIsNotYou(),
      infoText: function(data, matches) {
        return {
          en: 'Free ' + data.ShortName(matches.target),
          de: 'Befreie ' + data.ShortName(matches.target),
          fr: 'Libérez ' + data.ShortName(matches.target),
          cn: '解救' + data.ShortName(matches.target),
        };
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Ice Soldier': 'Eissoldat',
        'Shiva': 'Shiva',
      },
      'replaceText': {
        '\\(circle\\)': '(Kreis)',
        '\\(cross\\)': '(Kreuz)',
        '--frozen--': '--eingefroren--',
        'Absolute Zero': 'Absoluter Nullpunkt',
        'Diamond Dust': 'Diamantenstaub',
        'Dreams Of Ice': 'Eisige Träume',
        'Frost Blade': 'Frostklinge',
        'Frost Staff': 'Froststab',
        'Glacier Bash': 'Gletscherlauf',
        'Hailstorm': 'Hagelsturm',
        'Heavenly Strike': 'Himmlischer Schlag',
        'Icebrand': 'Eisbrand',
        'Icicle Impact': 'Eiszapfen-Schlag',
        'Melt': 'Schmelzen',
        'Permafrost': 'Permafrost',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Ice Soldier': 'soldat de glace',
        'Shiva': 'Shiva',
      },
      'replaceText': {
        '\\?': ' ?',
        '\\(circle\\)': '(cercle)',
        '\\(cross\\)': '(croix)',
        '--frozen--': '--gelé--',
        'Absolute Zero': 'Zéro absolu',
        'Diamond Dust': 'Poussière de diamant',
        'Dreams Of Ice': 'Illusions glacées',
        'Frost Blade': 'Lame glaciale',
        'Frost Staff': 'Bâton glacial',
        'Glacier Bash': 'Effondrement de glacier',
        'Hailstorm': 'Averse de grêle',
        'Heavenly Strike': 'Frappe céleste',
        'Icebrand': 'Épée de glace',
        'Icicle Impact': 'Impact de stalactite',
        'Melt': 'Fonte',
        'Permafrost': 'Permafrost',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Ice Soldier': 'アイスソルジャー',
        'Shiva': 'シヴァ',
      },
      'replaceText': {
        'Absolute Zero': '絶対零度',
        'Diamond Dust': 'ダイアモンドダスト',
        'Dreams Of Ice': '氷結の幻想',
        'Frost Blade': '凍てつく剣',
        'Frost Staff': '凍てつく杖',
        'Glacier Bash': 'グレイシャーバッシュ',
        'Hailstorm': 'ヘイルストーム',
        'Heavenly Strike': '天雷掌',
        'Icebrand': 'アイスブランド',
        'Icicle Impact': 'アイシクルインパクト',
        'Melt': 'ウェポンメルト',
        'Permafrost': 'パーマフロスト',
      },
    },
    {
      'locale': 'cn',
      'missingTranslations': true,
      'replaceSync': {
        'Ice Soldier': '寒冰士兵',
        'Shiva': '希瓦',
      },
      'replaceText': {
        'Absolute Zero': '绝对零度',
        'Diamond Dust': '钻石星尘',
        'Dreams Of Ice': '寒冰的幻想',
        'Frost Blade': '冰霜之剑',
        'Frost Staff': '冰霜之杖',
        'Glacier Bash': '冰河怒击',
        'Hailstorm': '冰雹',
        'Heavenly Strike': '天雷掌',
        'Icebrand': '冰印剑',
        'Icicle Impact': '冰柱冲击',
        'Melt': '武器融化',
        'Permafrost': '永久冻土',
      },
    },
    {
      'locale': 'ko',
      'missingTranslations': true,
      'replaceSync': {
        'Ice Soldier': '얼음 병사',
        'Shiva': '시바',
      },
      'replaceText': {
        'Absolute Zero': '절대영도',
        'Diamond Dust': '다이아몬드 더스트',
        'Dreams Of Ice': '빙결의 환상',
        'Frost Blade': '얼어붙은 검',
        'Frost Staff': '얼어붙은 지팡이',
        'Glacier Bash': '빙하 강타',
        'Hailstorm': '우박 폭풍',
        'Heavenly Strike': '천뢰장',
        'Icebrand': '얼음의 낙인',
        'Icicle Impact': '고드름 낙하',
        'Melt': '무기 용해',
        'Permafrost': '영구동토',
      },
    },
  ],
}];
