'use strict';

// Titania Extreme
[{
  zoneRegex: /The Dancing Plague \(Extreme\)/,
  timelineFile: 'titania-ex.txt',
  triggers: [
    {
      id: 'TitaniaEx Phantom Out',
      regex: /14:3D4C:Titania starts using Phantom Rune/,
      regexJa: /14:3D4C:ティターニア starts using 幻のルーン/,
      alertText: {
        en: 'Out',
        ja: '外へ',
      },
    },
    {
      id: 'TitaniaEx Phantom In',
      regex: /14:3D4D:Titania starts using Phantom Rune/,
      regexJa: /14:3D4D:ティターニア starts using 幻のルーン/,
      alertText: {
        en: 'In',
        ja: '中へ',
      },
    },
    {
      id: 'TitaniaEx Mist Failure',
      regex: /03:\y{ObjectId}:Added new combatant Spirit Of Dew\./,
      regexJa: /03:\y{ObjectId}:Added new combatant 水の精\./,
      infoText: {
        en: 'Kill Extra Add',
        ja: '水の精倒して',
      },
    },
    {
      id: 'TitaniaEx Mist',
      regex: /14:3D45:Titania starts using Mist Rune/,
      regexJa: /14:3D45:ティターニア starts using 水のルーン/,
      infoText: function(data) {
        if (data.seenMistRune) {
          return {
            en: 'In/Out, then Water Positions',
            ja: '中/外避けてポジションへ',
          };
        }
        return {
          en: 'Water Positions',
          ja: 'ポジションへ',
        };
      },
      run: function(data) {
        data.seenMistRune = true;
      },
    },
    {
      id: 'TitaniaEx Flame',
      regex: /14:3D47:Titania starts using Flame Rune/,
      regexJa: /14:3D47:ティターニア starts using 火のルーン/,
      // You have 16.5 seconds until the first stack damage.
      delaySeconds: 8.5,
      alertText: function(data) {
        if (data.seenFlameRune) {
          return {
            en: 'Stack (maybe rotate?)',
            ja: 'シェア (多分時計回り?)',
          };
        }
        return {
          en: 'Stack Positions',
          ja: 'シェア',
        };
      },
      run: function(data) {
        data.seenFlameRune = true;
      },
    },
    {
      id: 'TitaniaEx Divination',
      regex: /14:3D4A:Titania starts using Divination Rune on (\y{Name})/,
      regexJa: /14:3D4A:ティターニア starts using 魔のルーン on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Cleave on YOU',
            ja: '自分にタンクバスター',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches[1] != data.me) {
          return {
            en: 'Tank Cleave on ' + data.ShortName(matches[1]),
            ja: data.ShortName(matches[1]) + 'にタンクバスター',
          };
        }
      },
    },
    {
      id: 'TitaniaEx Bramble 1',
      regex: /14:42D7:Titania starts using Chain Of Brambles/,
      regexJa: /14:42D7:ティターニア starts using ブランブルチェーン/,
      infoText: {
        en: 'Wait For Tethers In Center',
        ja: '中央で待機',
      },
    },
    {
      id: 'TitaniaEx Bramble 2',
      regex: /14:42D7:Titania starts using Chain Of Brambles/,
      regexJa: /14:42D7:ティターニア starts using ブランブルチェーン/,
      delaySeconds: 3,
      alertText: {
        en: 'Run!',
        ja: '走れ！',
      },
    },
    {
      id: 'TitaniaEx Bramble Knockback',
      regex: /15:\y{ObjectId}:Puck:3D42:Puck's Rebuke/,
      regexJa: /15:\y{ObjectId}:パック:3D42:パックレビューク/,
      alertText: {
        en: 'Diagonal Knockback Soon',
        ja: '対角に飛ぶ',
      },
    },
    {
      id: 'TitaniaEx Fae Light',
      regex: /14:3D2C:Titania starts using Fae Light/,
      regexJa: /14:3D2C:ティターニア starts using 妖精光/,
      alertText: function(data, matches) {
        if (data.role == 'tank' || data.role == 'healer') {
          return {
            en: 'Tank Buster',
            de: 'Tankbuster',
            fr: 'Tankbuster',
            ja: 'タンクバスター',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.role != 'tank' && data.role != 'healer') {
          return {
            en: 'Tank Cleave',
            ja: 'タンクバスター',
          };
        }
      },
    },
    {
      id: 'TitaniaEx Frost Rune 1',
      regex: /14:3D2A:Titania starts using Frost Rune/,
      regexJa: /14:3D2A:ティターニア starts using 氷のルーン/,
      infoText: {
        en: 'Get Middle, Shiva Circles',
        ja: 'シヴァの輪っか',
      },
    },
    {
      id: 'TitaniaEx Frost Rune 2',
      regex: /14:3D2A:Titania starts using Frost Rune/,
      regexJa: /14:3D2A:ティターニア starts using 氷のルーン/,
      delaySeconds: 6.5,
      infoText: {
        en: 'Run Out',
        ja: '外へ',
      },
    },
    {
      id: 'TitaniaEx Frost Rune 3',
      regex: /1[56]:\y{ObjectId}:Titania:3D2B:Frost Rune:/,
      regexJa: /1[56]:\y{ObjectId}:ティターニア:3D2B:氷のルーン:/,
      suppressSeconds: 60,
      infoText: {
        en: 'Run In',
        ja: '中へ',
      },
    },
    {
      id: 'TitaniaEx Growth Rune',
      regex: /14:3D2E:Titania starts using Growth Rune/,
      regexJa: /14:3D2E:ティターニア starts using 根のルーン/,
      infoText: {
        en: 'Roots',
        ja: '根のルーン',
      },
    },
    {
      id: 'TitaniaEx Uplift Markers',
      regex: /1B:\y{ObjectId}:(\y{Name}):....:....:008B:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Spread',
        ja: '散開',
      },
    },
    {
      id: 'TitaniaEx Hard Swipe',
      regex: /14:3D36:Peaseblossom starts using Hard Swipe on (\y{Name})/,
      regexJa: /14:3D36:ピーズブロッサム starts using ハードスワイプ on (\y{Name})/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Tank Buster',
        de: 'Tankbuster',
        fr: 'Tankbuster',
        ja: 'タンクバスター',
      },
    },
    {
      id: 'TitaniaEx Pummel',
      regex: /14:3D37:Puck starts using Pummel on (\y{Name})/,
      regexJa: /14:3D37:パック starts using 殴打 on (\y{Name})/,
      condition: function(data) {
        return data.role == 'tank';
      },
      preRun: function(data) {
        data.pummelCount = data.pummelCount || 0;
        data.pummelCount++;
      },
      infoText: function(data) {
        return {
          en: 'Pummel ' + data.pummelCount,
          ja: '殴打 ' + data.pummelCount,
        };
      },
    },
    {
      id: 'TitaniaEx Peasebomb',
      regex: /1B:\y{ObjectId}:(\y{Name}):....:....:00BD:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Spread',
        ja: '散開',
      },
      run: function(data) {
        data.bomb = data.bomb || {};
        data.bomb[data.me] = true;
      },
    },
    {
      id: 'TitaniaEx Peasebomb Use',
      regex: /1[56]:\y{ObjectId}:Peaseblossom:3D3F:Peasebomb/,
      regexJa: /1[56]:\y{ObjectId}:ピーズブロッサム:3D3F:ビーズボム/,
      run: function(data) {
        delete data.bomb;
      },
    },
    {
      id: 'TitaniaEx Adds Stack',
      regex: /1B:\y{ObjectId}:(\y{Name}):....:....:00A1:/,
      delaySeconds: 0.25,
      alertText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Stack on YOU',
            ja: '自分にシェア',
          };
        }

        if (data.bomb && data.bomb[data.me])
          return;

        return {
          en: 'Stack on ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'TitaniaEx Thunder Tether',
      regex: /23:\y{ObjectId}:Titania:\y{ObjectId}:\y{Name}:....:....:0054:/,
      regexJa: /23:\y{ObjectId}:ティターニア:\y{ObjectId}:\y{Name}:....:....:0054:/,
      suppressSeconds: 60,
      alertText: {
        en: 'Initial Thunder Tether',
        ja: '線一人目',
      },
    },
    {
      id: 'TitaniaEx Thunder Rune',
      regex: /1[56]:\y{ObjectId}:Titania:3D29:Thunder Rune:/,
      regexJa: /1[56]:\y{ObjectId}:ティターニア:3D29:雷のルーン:/,
      preRun: function(data, matches) {
        data.thunderCount = data.thunderCount || 1;
      },
      suppressSeconds: 1,
      infoText: function(data) {
        return {
          en: 'Thunder ' + data.thunderCount,
          ja: '線' + data.thunderCount + '人目',
        };
      },
      run: function(data, matches) {
        data.thunderCount++;
        data.thunderTime = matches[1];
      },
    },
    {
      id: 'TitaniaEx Thunder Cleanup',
      regex: /14:3D32:Titania starts using Being Mortal/,
      regexJa: /14:3D32:ティターニア starts using 死すべき定め/,
      run: function(data) {
        delete data.thunderCount;
      },
    },
  ],
}];
