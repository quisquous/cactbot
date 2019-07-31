'use strict';

// TODO
// better callouts for cycle
// tank provoke messages when cotank has flare

[{
  zoneRegex: /(^Eden's Gate: Descent \(Savage\)$|Unknown Zone \(356\))/,
  timelineFile: 'e2s.txt',
  timelineTriggers: [
    {
      id: 'E2S Punishing Ray',
      regex: /Punishing Ray/,
      regexJa: /パニッシュレイ/,
      beforeSeconds: 9,
      infoText: {
        en: 'Get Puddles',
        fr: 'Prenez les rayons',
        ja: '踏む',
      },
    },
    {
      id: 'E2S Buddy Circles',
      regex: /Light\/Dark Circles/,
      beforeSeconds: 5,
      alarmText: {
        en: 'Stack With Partner',
      },
    },
  ],
  triggers: [
    {
      id: 'E2S Spell In Waiting Gain',
      regex: / 1A:\y{ObjectId}:Voidwalker gains the effect of Spell-In-Waiting/,
      run: function(data) {
        data.waiting = true;
      },
    },
    {
      id: 'E2S Spell In Waiting Lose',
      regex: / 1E:\y{ObjectId}:Voidwalker loses the effect of Spell-In-Waiting/,
      run: function(data) {
        data.waiting = false;
      },
    },
    {
      id: 'E2S Entropy',
      regex: / 14:3E6F:Voidwalker starts using (?:Entropy|)/,
      regexFr: / 14:3E6F:Marcheuse Du Néant starts using (?:Entropie|)/,
      regex: / 14:3E6F:ヴォイドウォーカー starts using (?:エントロピー|)/,
      condition: function(data, matches) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        fr: 'Dégâts de zone',
        ja: 'aoe',
      },
    },
    {
      id: 'E2S Quietus',
      regex: / 14:3E71:Voidwalker starts using (?:Quietus|)/,
      regexJa: / 14:3E71:ヴォイドウォーカー starts using (?:クワイタス|)/,
      condition: function(data, matches) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        fr: 'Dégâts de zone',
        ja: 'aoe',
      },
    },
    {
      id: 'E2S Shadowflame Tank',
      regex: / 14:3E6[12]:Voidwalker starts using (?:Shadowflame|Unknown_3E6[12]) on (\y{Name})/,
      regexFr: / 14:3E6[12]:Marcheuse Du Néant starts using (?:Flamme D'ombre|Unknown_3E6[12]) on (\y{Name})/,
      regexJa: / 14:3E6[12]:ヴォイドウォーカー starts using (?:シャドーフレイム|Unknown_3E6[12]) on (\y{Name})/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Tank Buster on YOU',
        de: 'Tankbuster auf DIR',
        fr: 'Tankbuster sur VOUS',
        ja: '自分にタンクバスター',
      },
    },
    {
      id: 'E2S Shadowflame Healer',
      regex: / 14:3E61:Voidwalker starts using (?:Shadowflame|Unknown_3E6[12])/,
      regexFr: / 14:3E61:Marcheuse Du Néant starts using (?:Flamme D'ombre|Unknown_3E6[12])/,
      regexJa: / 14:3E61:ヴォイドウォーカー starts using (?:Shadowflame|Unknown_3E6[12])/,
      condition: function(data, matches) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'tank busters',
        fr: 'Tank busters',
        ja: 'タンクバスター',
      },
    },
    {
      id: 'E2S Doomvoid Cleaver',
      regex: / 14:3E63:Voidwalker starts using (?:Doomvoid Cleaver|)/,
      regexJa: / 14:3E63:ヴォイドウォーカー starts using (?:ドゥームヴォイド・クリーバー|)/,
      alertText: {
        en: 'Protean',
        ja: '散開',
      },
    },
    {
      id: 'E2S Doomvoid Guillotine',
      regex: / 14:3E4F:Voidwalker starts using (?:Doomvoid Guillotine|)/,
      regexJa: / 14:3E4F:ヴォイドウォーカー starts using (?:ドゥームヴォイド・ギロチン|)/,
      alertText: {
        en: 'Sides',
        ja: '横へ',
      },
    },
    {
      id: 'E2S Doomvoid Slicer',
      regex: / 14:3E50:Voidwalker starts using (:?:Doomvoid Slicer|)/,
      regexFr: / 14:3E50:Marcheuse Du Néant starts using (?:Entaille Du Néant Ravageur|)/,
      regexJa: / 14:3E50:ヴォイドウォーカー starts using (:?:ドゥームヴォイド・スライサー|)/,
      infoText: {
        en: 'Get Under',
        fr: 'Intérieur',
        ja: '中へ',
      },
    },
    {
      id: 'E2S Empty Hate',
      regex: / 14:3E59:The Hand Of Erebos starts using (?:Empty Hate|)/,
      regexFr: / 14:3E59:Bras D'érèbe starts using (?:Vaine Malice)/,
      regexJa: / 14:3E59:エレボスの巨腕 starts using (?:虚ろなる悪意|)/,
      infoText: {
        en: 'Knockback',
        fr: 'Poussée',
        ja: 'ノックバック',
      },
    },
    {
      id: 'E2S Empty Rage',
      regex: / 14:3E6B:The Hand Of Erebos starts using (?:Empty Rage|)/,
      regexJa: / 14:3E6B:エレボスの巨腕 starts using (?:虚ろなる害意|)/,
      alertText: {
        en: 'Away From Hand',
        ja: '手から離れて',
      },
    },
    {
      id: 'E2S Unholy Darkness No Waiting',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:003E:/,
      condition: function(data) {
        return !data.waiting;
      },
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Stack on YOU',
            fr: 'Package sur VOUS',
            ja: '自分にスタック',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches[1]),
          fr: 'Package sur ' + data.ShortName(matches[1]),
          ja: data.ShortName(matches[1]) + 'にスタック',
        };
      },
    },
    {
      id: 'E2S Unholy Darkness Collect',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:003E:/,
      condition: function(data) {
        return data.waiting;
      },
      run: function(data, matches) {
        data.spell = data.spell || {};
        data.spell[matches[1]] = 'stack';
      },
    },
    {
      id: 'E2S Unholy Darkness Waiting',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:003E:/,
      condition: function(data, matches) {
        return data.waiting && data.me == matches[1];
      },
      infoText: {
        en: 'Delayed Stack',
        fr: 'Package retardé',
        ja: 'スタック(ディレイ)',
      },
    },
    {
      id: 'E2S Countdown Marker Unholy Darkness',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00B8:/,
      condition: function(data, matches) {
        return data.spell[matches[1]] == 'stack';
      },
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Stack on YOU',
            fr: 'Package sur VOUS',
            ja: '自分にスタック',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches[1]),
          fr: 'Package sur ' + data.ShortName(matches[1]),
          ja: data.ShortName(matches[1]) + 'にスタック',
        };
      },
    },
    {
      id: 'E2S Dark Fire No Waiting',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:004C:/,
      condition: function(data, matches) {
        return !data.waiting && data.me == matches[1];
      },
      alertText: {
        en: 'Spread',
        fr: 'Dispersez-vous',
        ja: '散開',
      },
    },
    {
      id: 'E2S Dark Fire Collect',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:004C:/,
      condition: function(data) {
        return data.waiting;
      },
      run: function(data, matches) {
        data.spell = data.spell || {};
        data.spell[matches[1]] = 'fire';
      },
    },
    {
      id: 'E2S Dark Fire Waiting',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:004C:/,
      condition: function(data, matches) {
        return data.waiting && data.me == matches[1];
      },
      infoText: {
        en: 'Delayed Fire',
        fr: 'Feu retardé',
        ja: 'マーカーついた(ディレイ)',
      },
    },
    {
      id: 'E2S Countdown Marker Fire',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00B8:/,
      condition: function(data, matches) {
        return data.me == matches[1] && data.spell[data.me] == 'fire';
      },
      alertText: function(data) {
        return {
          en: 'Spread',
          fr: 'Dispersez-vous',
          ja: '散開',
        };
      },
    },
    {
      id: 'E2S Shadoweye No Waiting',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00B3:/,
      condition: function(data) {
        return !data.waiting;
      },
      alertText: function(data, matches) {
        if (data.me != matches[1]) {
          return {
            en: 'Look Away from ' + data.ShortName(matches[1]),
            fr: 'Ne regardez pas '+ data.ShortName(matches[1]),
            ja: data.ShortName(matches[1]) + 'を見ないで',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Eye on YOU',
            fr: 'Œil de l\'ombre sur VOUS',
            ja: '自分に目',
          };
        }
      },
    },
    {
      id: 'E2S Shadoweye Collect',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00B3:/,
      condition: function(data) {
        return data.waiting;
      },
      run: function(data, matches) {
        data.spell = data.spell || {};
        data.spell[matches[1]] = 'eye';
      },
    },
    {
      id: 'E2S Shadoweye Waiting',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00B3:/,
      condition: function(data, matches) {
        return data.waiting && data.me == matches[1];
      },
      infoText: {
        en: 'Delayed Shadoweye',
        fr: 'Œil de l\'ombre retardé',
        ja: 'シャドウアイ(ディレイ)',
      },
    },
    {
      id: 'E2S Countdown Marker Shadoweye',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00B8:/,
      condition: function(data, matches) {
        return data.spell[matches[1]] == 'eye';
      },
      delaySeconds: 2,
      alarmText: function(data, matches) {
        if (data.me != matches[1]) {
          return {
            en: 'Look Away from ' + data.ShortName(matches[1]),
            fr: 'Ne regardez pas ' + data.ShortName(matches[1]),
            ja: data.ShortName(matches[1]) + 'を見ないで',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Eye on YOU',
            fr: 'Œil de l\'ombre sur VOUS',
            ja: '自分に目',
          };
        }
      },
    },
    {
      id: 'E2S Flare No Waiting',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0057:/,
      condition: function(data, matches) {
        return !data.waiting && data.me == matches[1];
      },
      alertText: {
        en: 'Flare',
        ja: 'フレア捨てて',
      },
    },
    {
      id: 'E2S Flare Collect',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0057:/,
      condition: function(data) {
        return data.waiting;
      },
      run: function(data, matches) {
        data.spell = data.spell || {};
        data.spell[matches[1]] = 'flare';
      },
    },
    {
      id: 'E2S Flare Waiting',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0057:/,
      condition: function(data, matches) {
        return data.waiting && data.me == matches[1];
      },
      infoText: {
        en: 'Delayed Flare',
        fr: 'Feu retardé',
        ja: 'フレア(ディレイ)',
      },
    },
    {
      id: 'E2S Countdown Marker Flare',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00B8:/,
      condition: function(data, matches) {
        return data.me == matches[1] && data.spell[data.me] == 'flare';
      },
      alertText: function(data) {
        return {
          en: 'Flare',
          ja: 'フレア捨てて',
        };
      },
    },
    {
      id: 'E2S Countdown Marker Flare Healer',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00B8:/,
      condition: function(data, matches) {
        if (data.role != 'healer')
          return;
        return data.spell[matches[1]] == 'flare' && data.spell[data.me] != 'flare';
      },
      suppressSeconds: 10,
      infoText: function(data) {
        return {
          en: 'Flare aoes',
          ja: 'フレア AoE',
        };
      },
    },
    {
      id: 'E2S Hell Wind No Waiting',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:001E:/,
      condition: function(data, matches) {
        return !data.waiting && data.me == matches[1];
      },
      // The "no waiting" version comes paired with a stack.
      alarmText: {
        en: 'Hell Wind: Get Out',
        ja: 'ヘルウィンド: HP1になるよ',
      },
    },
    {
      id: 'E2S Hell Wind Collect',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:001E:/,
      condition: function(data) {
        return data.waiting;
      },
      run: function(data, matches) {
        data.spell = data.spell || {};
        data.spell[matches[1]] = 'wind';
      },
    },
    {
      id: 'E2S Hell Wind Waiting',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:001E:/,
      condition: function(data, matches) {
        return data.waiting && data.me == matches[1];
      },
      infoText: {
        en: 'Delayed Hell Wind',
        ja: 'ヘルウィンド(ディレイ)',
      },
    },
    {
      id: 'E2S Countdown Marker Hell Wind',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00B8:/,
      condition: function(data, matches) {
        if (data.role == 'healer')
          return false;
        return data.me == matches[1] && data.spell[data.me] == 'wind';
      },
      alertText: function(data) {
        return {
          en: 'Hell Wind: wait for heals',
          ja: 'ヘルウィンド: HP戻ってから,
        };
      },
    },
    {
      id: 'E2S Countdown Marker Hell Wind Healer',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00B8:/,
      condition: function(data, matches) {
        if (data.role != 'healer')
          return;
        return data.spell[matches[1]] == 'wind';
      },
      suppressSeconds: 10,
      infoText: function(data) {
        return {
          en: 'Heal Hell Wind Targets',
          ja: 'HP戻して',
        };
      },
    },
    {
      id: 'E2S Countdown Marker Cleanup',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00B8:/,
      delaySeconds: 10,
      run: function(data, matches) {
        delete data.spell[matches[1]];
      },
    },
    {
      // TODO: add callouts for each of these
      id: 'E2S Cycle of Retribution',
      regex: / 14:4659:Voidwalker starts using (?:Cycle Of Retribution|)/,
      regexJa: / 14:4659:ヴォイドウォーカー starts using (?:復讐の連続剣|)/,
      infoText: {
        en: 'In => Protean => Sides',
        ja: '中 => 散開 => 横',
      },
    },
    {
      id: 'E2S Cycle of Chaos',
      regex: / 14:40B9:Voidwalker starts using (?:Cycle Of Chaos|)/,
      regexJa: / 14:40B9:ヴォイドウォーカー starts using (?:混沌の連続剣|)/,
      infoText: {
        en: 'Sides => In => Protean',
        ja: '横 => 中 => 散開',
      },
    },
  ],
}];
