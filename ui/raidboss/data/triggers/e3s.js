'use strict';

[{
  zoneRegex: /^Eden's Gate: Inundation \(Savage\)$/,
  timelineFile: 'e3s.txt',
  timelineTriggers: [
    {
      id: 'E3S Plunging Wave',
      regex: /Plunging Wave/,
      beforeSeconds: 2,
      infoText: {
        en: 'Line Stack',
        ja: '直線スタック',
      },
    },
    {
      id: 'E3S Spilling Wave',
      regex: /Spilling Wave/,
      beforeSeconds: 3,
      condition: function(data) {
        return data.role == 'tank';
      },
      alertText: {
        en: 'Tank Cleaves, Move Front',
        ja: '拡散くるよ',
      },
    },
  ],
  triggers: [
    {
      id: 'E3S Tidal Roar',
      regex: / 14:3FDC:Leviathan starts using Tidal Roar/,
      regexJa: / 14:3FDC:リヴァイアサン starts using タイダルロア/,
      condition: function(data, matches) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        fr: 'Dégâts de zone',
        ja: 'AoE',
      },
    },
    {
      id: 'E3S Tidal Rage',
      regex: / 14:3FDE:Leviathan starts using Tidal Rage/,
      regex: / 14:3FDE:リヴァイアサン starts using タイダルレイジ/,
      condition: function(data, matches) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        fr: 'Dégâts de zone',
        ja: 'AoE',
      },
    },
    {
      id: 'E3S Tidal Wave Look',
      regex: / 14:3FF1:Leviathan starts using Tidal Wave/,
      regexFr: / 14:3FF1:Léviathan starts using Raz-De-Marée/,
      regexJa: / 14:3FF1:リヴァイアサン starts using タイダルウェーブ/,
      delaySeconds: 3,
      infoText: {
        en: 'Look for Wave',
        fr: 'Repérez la vague',
        ja: 'タイダルウェーブくるよ',
      },
    },
    {
      id: 'E3S Tidal Wave Knockback',
      regex: / 14:3FF1:Leviathan starts using Tidal Wave/,
      regexFr: / 14:3FF1:Léviathan starts using Raz-De-Marée/,
      regexJa: / 14:3FF1:リヴァイアサン starts using タイダルウェーブ/,
      // 3 seconds of cast, 10 seconds of delay.
      // This gives a warning within 5 seconds, so you can hit arm's length.
      delaySeconds: 8,
      alertText: {
        en: 'Knockback',
        fr: 'Poussée',
        ja: 'ノックバック',
      },
    },
    {
      id: 'E3S Rip Current',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0017:/,
      suppressSeconds: 10,
      alarmText: function(data, matches) {
        if (matches[1] != data.me && data.role == 'tank') {
          return {
            en: 'Tank Swap!',
            de: 'Tankwechsel!',
            fr: 'Tank swap !',
            ja: 'スイッチ',
          };
        }
      },
      alertText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
            ja: '自分にタンクバスター',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Tank Busters',
            ja: 'タンクバスター',
          };
        }
      },
    },
    {
      id: 'E3S Undersea Quake Outside',
      regex: / 14:3FEF:Leviathan starts using Undersea Quake/,
      regexFr: / 14:3FEF:Léviathan starts using Séisme Sous-Marin/,
      regex: / 14:3FEF:リヴァイアサン starts using アンダーシークエイク/,
      alertText: {
        en: 'Get Middle',
        fr: 'Allez au centre',
        ja: '外壊れるよ',
      },
    },
    {
      id: 'E3S Undersea Quake Outside',
      regex: / 14:3FEE:Leviathan starts using Undersea Quake/,
      regexFr: / 14:3FEE:Léviathan starts using Séisme Sous-Marin/,
      regexJa: / 14:3FEE:リヴァイアサン starts using アンダーシークエイク/,
      alarmText: {
        en: 'Go Outside',
        fr: 'Allez sur les côtés',
        ja: '中壊れるよ',
      },
    },
    {
      id: 'E3S Flare',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0057:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alarmText: {
        en: 'Flare on YOU',
        ja: '自分にフレア',
      },
    },
    {
      id: 'E3S Drenching Pulse',
      regex: / 14:3FE2:Leviathan starts using Drenching Pulse/,
      regexJa: / 14:3FE2:リヴァイアサン starts using 猛烈なる波動/,
      infoText: {
        en: 'Stack, Bait Puddles',
        ja: '集合',
      },
    },
    {
      id: 'E3S Drenching Pulse Puddles',
      regex: / 14:3FE2:Leviathan starts using Drenching Pulse/,
      regex: / 14:3FE2:リヴァイアサン starts using 猛烈なる波動/,
      delaySeconds: 2.9,
      infoText: {
        en: 'Drop Puddles Outside',
        ja: '散開',
      },
    },
    {
      id: 'E3S Roiling Pulse',
      regex: / 14:3FE4:Leviathan starts using Roiling Pulse/,
      regexJa: / 14:3FE4:リヴァイアサン starts using 苛烈なる波動/,
      infoText: {
        en: 'Stack, Bait Puddles',
        ja: '集合',
      },
    },
    {
      id: 'E3S Roiling Pulse Abilities',
      regex: / 14:3FE4:Leviathan starts using Roiling Pulse/,
      regexJa: / 14:3FE4:リヴァイアサン starts using 苛烈なる波動/,
      delaySeconds: 2.9,
      infoText: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'Flare To Outside Corner',
            ja: '隅にフレア',
          };
        }
        return {
          en: 'Stack Outside, Avoid Flares',
          ja: '前で集合',
        };
      },
    },
    {
      id: 'E3S Stormy Horizon',
      regex: / 14:3FE9:Leviathan starts using Stormy Horizon/,
      regexJa: / 14:3FE9:リヴァイアサン starts using 大時化/,
      infoText: {
        en: 'Panto Puddles x5',
        ja: 'パント5回',
      },
    },
    {
      id: 'E3S Hydrothermal Vent Tether',
      regex: / 23:\y{ObjectId}:(\y{Name}):\y{ObjectId}:Leviathan:....:....:005A:/,
      regexJa: / 23:\y{ObjectId}:(\y{Name}):\y{ObjectId}:リヴァイアサン:....:....:005A:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Puddle Tether on YOU',
        ja: '線ついた',
      },
    },
    {
      id: 'E3S Hydrothermal Vent Collect',
      regex: / 23:\y{ObjectId}:(\y{Name}):\y{ObjectId}:Leviathan:....:....:005A:/,
      regexJa: / 23:\y{ObjectId}:(\y{Name}):\y{ObjectId}:リヴァイアサン:....:....:005A:/,
      run: function(data, matches) {
        data.vent = data.vent || [];
        data.vent.push(matches[1]);
      },
    },
    {
      id: 'E3S Hydrothermal Vent Collect',
      regex: / 23:\y{ObjectId}:\y{Name}:\y{ObjectId}:Leviathan:....:....:005A:/,
      regexJa: / 23:\y{ObjectId}:\y{Name}:\y{ObjectId}:リヴァイアサン:....:....:005A:/,
      condition: function(data) {
        return data.vent.length == 2 && data.vent.indexOf(data.me) == -1 && data.role != 'tank';
      },
      infoText: {
        en: 'Pop alternating bubbles',
        ja: '水出た',
      },
    },
    {
      id: 'E3S Surging Waters',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Surging Waters/,
      regexJa: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of 強圧の兆し/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Initial knockback on YOU',
        ja: '最初のノックバック',
      },
    },
    {
      // TODO probably need to call out knockbacks later
      // TODO maybe tell other people about stacking for knockbacks
      id: 'E3S Sundering Waters',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Sundering Waters from (?:.*) for (.*) Seconds/,
      regexJa: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of 断絶の兆し from (?:.*) for (.*) Seconds/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: function(data, matches) {
        let seconds = matches[2];
        if (seconds <= 8) {
          return {
            en: 'Knockback on YOU',
            ja: '自分にノックバック',
          };
        }
      },
      infoText: function(data, matches) {
        let seconds = matches[2];
        if (seconds <= 8)
          return;
        if (seconds <= 21) {
          return {
            en: 'Late First Knockback',
            ja: '遅ノックバック1',
          };
        }
        return {
          en: 'Late Second Knockback',
          ja: '遅ノックバック2',
        };
      },
    },
    {
      // 29 seconds
      id: 'E3S Scouring Waters',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Scouring Waters/,
      regexJa: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of 暴風の兆し/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Defamation',
        ja: '暴風',
      },
    },
    {
      id: 'E3S Scouring Waters',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Scouring Waters/,
      regexJa: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of 暴風の兆し/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      delaySeconds: 22,
      infoText: {
        en: 'Avoid Knockback, Move to Back',
        ja: '後ろへ',
      },
    },
    {
      id: 'E3S Scouring Waters',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Scouring Waters/,
      regexJa: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of 暴風の兆し/,
      condition: function(data, matches) {
        return data.me != matches[1];
      },
      delaySeconds: 25,
      infoText: {
        en: 'Move In, Avoid Defamation',
        ja: '前にノックバック',
      },
    },
    {
      id: 'E3S Sweeping Waters',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of 断絶の兆し from (?:.*) for (.*) Seconds/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Tank Cone',
        ja: '断絶',
      },
    },
    {
      id: 'E3S Sweeping Waters',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of 断絶の兆し from (?:.*) for (.*) Seconds/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      delaySeconds: 13,
      infoText: {
        en: 'Tank Cone',
        ja: '断絶',
      },
    },
    {
      id: 'E3S Front Left Temporary Current',
      regex: / 14:3FEB:Leviathan starts using Temporary Current/,
      regexJa: / 14:3FEB:リヴァイアサン starts using テンポラリーカレント/,
      infoText: {
        en: 'front left / back right',
        ja: '左前 / 右後ろ',
      },
    },
    {
      id: 'E3S Front Right Temporary Current',
      regex: / 14:3FEA:Leviathan starts using Temporary Current/,
      regexJa: / 14:3FEA:リヴァイアサン starts using テンポラリーカレント/,
      infoText: {
        en: 'front right / back left',
        ja: '右前 / 左後ろ',
      },
    },
    {
      id: 'E3S Front Left Temporary Current 2',
      regex: / 14:3FED:Leviathan starts using Temporary Current/,
      regexJa: / 14:3FED:リヴァイアサン starts using テンポラリーカレント/,
      infoText: {
        en: 'front left / back right',
        ja: '左前 / 右後ろ',
      },
    },
    {
      id: 'E3S Front Right Temporary Current 2',
      regex: / 14:3FEC:Leviathan starts using Temporary Current/,
      regexJa: / 14:3FEC:リヴァイアサン starts using テンポラリーカレント/,
      infoText: {
        en: 'front right / back left',
        ja: '右前 / 左後ろ',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'ja',
      'replaceSync': {
        'Engage!': '戦闘開始！',
        'Leviathan': 'リヴァイアサン',
      },
      'replaceText': {
        'Tidal Roar': 'タイダルロア',
        'Rip Current': 'リップカレント',
        'Undersea Quake': 'アンダーシークエイク',
        'Tidal Wave': 'タイダルウェーブ',
        'Temporary Current': 'テンポラリーカレント',
        'Drenching Pulse': '猛烈なる波動',
        'Monster Wave': 'モンスターウェイブ',
        'Freak Wave': 'フリークウェイブ',
        'Maelstrom': 'メイルシュトローム',
        'Spinning Dive': 'スピニングダイブ',
        'Tsunami': '大海嘯',
        'Sundering Tsunami': '断絶の大海嘯',
        'Smothering Tsunami': '溺没の大海嘯',
        'Swirling Tsunami': '渦動の大海嘯',
        'Refreshing Shower': '水の覚醒',
        'Plunging Wave': 'ブランジングウェイブ',
        'Tidal Rage': 'タイダルレイジ',
        'Freak Wave': 'フリークウェーブ',
        'Surging Tsunami': '強圧の大海嘯',
        'Sweeping Tsunami': '拡散の大海嘯',
        'Scouring Tsunami': '暴風の大海嘯',
        'Roiling Pulse': '苛烈なる波動',
        'Killer Wave': 'キラーウェーブ',
        'Spilling Wave': 'スピリングウェーブ',
        'Hydrothermal Vent': 'ハイドロサーマルベント',
        'Hot Water': '熱水',
        'The Calm': '沈溺の波動',
        'The Storm': '混沌の渦動',
      },
    },
  ],
}];
