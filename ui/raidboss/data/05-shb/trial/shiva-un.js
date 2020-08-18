'use strict';

// TODO: some sort of warning about extra tank damage during bow phase?
// TODO: should the post-staff "spread" happen unconditionally prior to marker?

[{
  zoneId: ZoneId.TheAkhAfahAmphitheatreUnreal,
  timelineFile: 'shiva-un.txt',
  timelineTriggers: [
    {
      id: 'ShivaUn Absolute Zero',
      regex: /Absolute Zero/,
      beforeSeconds: 5,
      condition: Conditions.caresAboutAOE(),
      // These are usually doubled, so avoid spamming.
      suppressSeconds: 10,
      response: Responses.aoe(),
    },
    {
      id: 'ShivaUn Icebrand',
      regex: /Icebrand/,
      beforeSeconds: 5,
      alertText: {
        en: 'Party Share Tankbuster',
        de: 'Tankbuster mit der Gruppe Teilen',
        fr: 'Partagez le Tank buster avec le groupe',
        ja: '頭割りタンクバスター',
        cn: '团队分摊死刑',
        ko: '파티 쉐어 탱버',
      },
    },
  ],
  triggers: [
    {
      id: 'ShivaUn Staff Phase',
      netRegex: NetRegexes.ability({ source: 'Shiva', id: '5367', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Shiva', id: '5367', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Shiva', id: '5367', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'シヴァ', id: '5367', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '시바', id: '5367', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '希瓦', id: '5367', capture: false }),
      response: function(data) {
        if (data.role === 'tank') {
          if (data.currentTank && data.blunt && data.blunt[data.currentTank]) {
            return {
              alertText: {
                en: 'Staff (Tank Swap)',
                de: 'Stab (Tankwechsel)',
                fr: 'Bâton (Tank Swap)',
                ja: '杖 (スイッチ)',
                cn: '权杖（换T）',
                ko: '지팡이 (탱커 교대)',
              },
            };
          }
        }

        return {
          infoText: {
            en: 'Staff',
            de: 'Stab',
            fr: 'Bâton',
            ja: '杖',
            cn: '权杖',
            ko: '지팡이',
          },
        };
      },
      run: function(data) {
        data.soonAfterWeaponChange = true;
      },
    },
    {
      id: 'ShivaUn Sword Phase',
      netRegex: NetRegexes.ability({ source: 'Shiva', id: '5366', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Shiva', id: '5366', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Shiva', id: '5366', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'シヴァ', id: '5366', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '시바', id: '5366', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '希瓦', id: '5366', capture: false }),
      response: function(data) {
        if (data.role === 'tank') {
          if (data.currentTank && data.slashing && data.slashing[data.currentTank]) {
            return {
              alertText: {
                en: 'Sword (Tank Swap)',
                de: 'Schwert (Tankwechsel)',
                fr: 'Épée (Tank Swap)',
                ja: '剣 (スイッチ)',
                cn: '剑（换T）',
                ko: '검 (탱커 교대)',
              },
            };
          }
        }

        return {
          infoText: {
            en: 'Sword',
            de: 'Schwert',
            fr: 'Épée',
            ja: '剣',
            cn: '剑',
            ko: '검',
          },
        };
      },
      run: function(data) {
        data.soonAfterWeaponChange = true;
      },
    },
    {
      id: 'ShivaUn Weapon Change Delayed',
      netRegex: NetRegexes.ability({ source: 'Shiva', id: ['5366', '5367'], capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Shiva', id: ['5366', '5367'], capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Shiva', id: ['5366', '5367'], capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'シヴァ', id: ['5366', '5367'], capture: false }),
      netRegexKo: NetRegexes.ability({ source: '시바', id: ['5366', '5367'], capture: false }),
      netRegexCn: NetRegexes.ability({ source: '希瓦', id: ['5366', '5367'], capture: false }),
      delaySeconds: 30,
      run: function(data) {
        data.soonAfterWeaponChange = false;
      },
    },
    {
      id: 'ShivaUn Slashing Resistance Down Gain',
      netRegex: NetRegexes.gainsEffect({ effectId: '23C' }),
      run: function(data, matches) {
        data.slashing = data.slashing || {};
        data.slashing[matches.target] = true;
      },
    },
    {
      id: 'ShivaUn Slashing Resistance Down Lose',
      netRegex: NetRegexes.losesEffect({ effectId: '23C' }),
      run: function(data, matches) {
        data.slashing = data.slashing || {};
        data.slashing[matches.target] = false;
      },
    },
    {
      id: 'ShivaUn Blunt Resistance Down Gain',
      netRegex: NetRegexes.gainsEffect({ effectId: '23D' }),
      run: function(data, matches) {
        data.blunt = data.blunt || {};
        data.blunt[matches.target] = true;
      },
    },
    {
      id: 'ShivaUn Blunt Resistance Down Lose',
      netRegex: NetRegexes.losesEffect({ effectId: '23D' }),
      run: function(data, matches) {
        data.blunt = data.blunt || {};
        data.blunt[matches.target] = false;
      },
    },
    {
      id: 'ShivaUn Current Tank',
      netRegex: NetRegexes.ability({ source: 'Shiva', id: '5365' }),
      netRegexDe: NetRegexes.ability({ source: 'Shiva', id: '5365' }),
      netRegexFr: NetRegexes.ability({ source: 'Shiva', id: '5365' }),
      netRegexJa: NetRegexes.ability({ source: 'シヴァ', id: '5365' }),
      netRegexKo: NetRegexes.ability({ source: '시바', id: '5365' }),
      netRegexCn: NetRegexes.ability({ source: '希瓦', id: '5365' }),
      run: function(data, matches) {
        data.currentTank = matches.target;
      },
    },
    {
      id: 'ShivaUn Hailstorm Marker',
      netRegex: NetRegexes.headMarker({ id: '001D' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread('alert'),
    },
    {
      id: 'ShivaUn Glacier Bash',
      netRegex: NetRegexes.startsUsing({ id: '5375', capture: false }),
      response: Responses.getBehind('info'),
    },
    {
      id: 'ShivaUn Whiteout',
      netRegex: NetRegexes.startsUsing({ id: '5376', capture: false }),
      response: Responses.getIn('alert'),
    },
    {
      id: 'ShivaUn Diamond Dust',
      netRegex: NetRegexes.ability({ source: 'Shiva', id: '536C', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Shiva', id: '536C', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Shiva', id: '536C', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'シヴァ', id: '536C', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '시바', id: '536C', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '希瓦', id: '536C', capture: false }),
      run: function(data) {
        data.seenDiamondDust = true;
      },
    },
    {
      id: 'ShivaUn Frost Bow',
      netRegex: NetRegexes.ability({ source: 'Shiva', id: '5368', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Shiva', id: '5368', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Shiva', id: '5368', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'シヴァ', id: '5368', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '시바', id: '5368', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '希瓦', id: '5368', capture: false }),
      response: Responses.getBehind('alarm'),
      run: function(data) {
        // Just in case ACT has crashed or something, make sure this state is correct.
        data.seenDiamondDust = true;
      },
    },
    {
      id: 'ShivaUn Avalanche Marker Me',
      netRegex: NetRegexes.headMarker({ id: '001A' }),
      condition: Conditions.targetIsYou(),
      // Responses.knockback does not quite give the 'laser cleave' aspect here.
      alarmText: {
        en: 'Knockback Laser on YOU',
        de: 'Rückstoß-Laser auf DIR',
        fr: 'Poussée-Laser sur VOUS',
        ja: '自分にノックバックレザー',
        cn: '击退激光点名',
        ko: '넉백 레이저 대상자',
      },
    },
    {
      id: 'ShivaUn Avalanche Marker Other',
      netRegex: NetRegexes.headMarker({ id: '001A' }),
      condition: Conditions.targetIsNotYou(),
      infoText: {
        en: 'Avoid Laser',
        de: 'Laser ausweichen',
        fr: 'Évitez le laser',
        ja: 'ノックバックレザーを避け',
        cn: '躲避击退激光',
        ko: '레이저 피하기',
      },
    },
    {
      id: 'ShivaUn Shiva Circles',
      netRegex: NetRegexes.abilityFull({ source: 'Shiva', id: '537B' }),
      netRegexDe: NetRegexes.abilityFull({ source: 'Shiva', id: '537B' }),
      netRegexFr: NetRegexes.abilityFull({ source: 'Shiva', id: '537B' }),
      netRegexJa: NetRegexes.abilityFull({ source: 'シヴァ', id: '537B' }),
      netRegexKo: NetRegexes.abilityFull({ source: '시바', id: '537B' }),
      netRegexCn: NetRegexes.abilityFull({ source: '希瓦', id: '537B' }),
      condition: function(data, matches) {
        // Ignore other middle circles and try to only target the Icicle Impact x9.
        if (!data.seenDiamondDust || data.soonAfterWeaponChange)
          return false;

        let x = parseFloat(matches.x);
        let y = parseFloat(matches.y);
        return Math.abs(x) < 0.1 && Math.abs(y) < 0.1;
      },
      // This can hit multiple people.
      suppressSeconds: 10,
      response: Responses.goMiddle('info'),
    },
    {
      id: 'ShivaUn Permafrost',
      netRegex: NetRegexes.startsUsing({ id: '5369', capture: false }),
      response: Responses.stopMoving('alert'),
    },
    {
      id: 'ShivaUn Ice Boulder',
      netRegex: NetRegexes.ability({ id: '537A' }),
      condition: Conditions.targetIsNotYou(),
      infoText: function(data, matches) {
        return {
          en: 'Free ' + data.ShortName(matches.target),
          de: 'Befreie ' + data.ShortName(matches.target),
          fr: 'Libérez ' + data.ShortName(matches.target),
          ja: data.ShortName(matches.target) + 'を救って',
          cn: '解救' + data.ShortName(matches.target),
          ko: data.ShortName(matches.target) + '감옥 해제',
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
        'Avalanche': 'Lawine',
        'Diamond Dust': 'Diamantenstaub',
        'Dreams Of Ice': 'Eisige Träume',
        'Frost Blade': 'Frostklinge',
        'Frost Bow': 'Frostbogen',
        'Frost Staff': 'Froststab',
        'Glacier Bash': 'Gletscherlauf',
        'Glass Dance': 'Gläserner Tanz',
        'Hailstorm': 'Hagelsturm',
        'Heavenly Strike': 'Himmelszorn',
        'Icebrand': 'Eisbrand',
        'Icicle Impact': 'Eiszapfen-Schlag',
        'Melt': 'Schmelzen',
        'Permafrost': 'Permafrost',
        'Whiteout': 'Schneeblindheit',
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
        'Avalanche': 'Avalanche',
        'Diamond Dust': 'Poussière de diamant',
        'Dreams Of Ice': 'Illusions glacées',
        'Frost Blade': 'Lame glaciale',
        'Frost Bow': 'Arc glacial',
        'Frost Staff': 'Bâton glacial',
        'Glacier Bash': 'Effondrement de glacier',
        'Glass Dance': 'Danse de glace',
        'Hailstorm': 'Averse de grêle',
        'Heavenly Strike': 'Frappe céleste',
        'Icebrand': 'Épée de glace',
        'Icicle Impact': 'Impact de stalactite',
        'Melt': 'Fonte',
        'Permafrost': 'Permafrost',
        'Whiteout': 'Fusion Glaciation',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Ice Soldier': 'アイスソルジャー',
        'Shiva': 'シヴァ',
      },
      'replaceText': {
        '\\?': ' ?',
        '\\(circle\\)': '(輪)',
        '\\(cross\\)': '(十字)',
        '--frozen--': '--凍結--',
        'Absolute Zero': '絶対零度',
        'Avalanche': 'アバランチ',
        'Diamond Dust': 'ダイアモンドダスト',
        'Dreams Of Ice': '氷結の幻想',
        'Frost Blade': '凍てつく剣',
        'Frost Bow': '凍てつく弓',
        'Frost Staff': '凍てつく杖',
        'Glacier Bash': 'グレイシャーバッシュ',
        'Glass Dance': '氷雪乱舞',
        'Hailstorm': 'ヘイルストーム',
        'Heavenly Strike': 'ヘヴンリーストライク',
        'Icebrand': 'アイスブランド',
        'Icicle Impact': 'アイシクルインパクト',
        'Melt': 'ウェポンメルト',
        'Permafrost': 'パーマフロスト',
        'Whiteout': 'ホワイトアウト',
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
        'Avalanche': '雪崩',
        'Diamond Dust': '钻石星尘',
        'Dreams Of Ice': '寒冰的幻想',
        'Frost Blade': '冰霜之剑',
        'Frost Bow': '冰霜之弓',
        'Frost Staff': '冰霜之杖',
        'Glacier Bash': '冰河怒击',
        'Glass Dance': '冰雪乱舞',
        'Hailstorm': '冰雹',
        'Heavenly Strike': '天降一击',
        'Icebrand': '冰印剑',
        'Icicle Impact': '冰柱冲击',
        'Melt': '武器融化',
        'Permafrost': '永久冻土',
        'Whiteout': '白化视界',
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
        'Avalanche': '눈사태',
        'Diamond Dust': '다이아몬드 더스트',
        'Dreams Of Ice': '빙결의 환상',
        'Frost Blade': '얼어붙은 검',
        'Frost Bow': '얼어붙은 활',
        'Frost Staff': '얼어붙은 지팡이',
        'Glacier Bash': '빙하 강타',
        'Glass Dance': '빙설난무',
        'Hailstorm': '우박 폭풍',
        'Heavenly Strike': '천상의 일격',
        'Icebrand': '얼음의 낙인',
        'Icicle Impact': '고드름 낙하',
        'Melt': '무기 용해',
        'Permafrost': '영구동토',
        'Whiteout': '폭설',
      },
    },
  ],
}];
