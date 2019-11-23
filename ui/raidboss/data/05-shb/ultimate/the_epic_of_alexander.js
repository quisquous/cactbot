'use strict';

[{
  zoneRegex: /^The Epic [Oo]f Alexander \(Ultimate\)$/,
  timelineFile: 'the_epic_of_alexander.txt',
  timelineTriggers: [
    {
      id: 'TEA Fluid Swing',
      regex: /Fluid Swing/,
      beforeSeconds: 5,
      // TODO: this is likely calling out twice sometimes because
      // the timeline resyncs and it becomes 5 seconds before again.
      // This is probably a problem for all timeline triggers (whoops)
      // and needs to be fixed more generally rather than adding a
      // suppression.
      suppressSeconds: 1,
      preRun: function(data) {
        data.swingCount = (data.swingCount || 0) + 1;
      },
      alertText: function(data) {
        let multipleSwings = data.swingCount == 2 || data.swingCount == 3;
        if (data.role == 'healer') {
          if (multipleSwings) {
            return {
              en: 'Tank Busters',
              de: 'Tank buster',
              fr: 'Tank busters',
              ja: 'タンクバスター',
            };
          }
          if (data.liquidTank) {
            return {
              en: 'Tank Buster on' + data.ShortName(data.liquidTank),
              de: 'Tank buster',
              fr: 'Tank buster',
              ja: 'タンクバスター',
            };
          }
          return {
            en: 'Tank Buster',
            de: 'Tank buster',
            fr: 'Tank buster',
            ja: 'タンクバスター',
          };
        }

        if (data.role == 'tank') {
          if (data.me == data.handTank && multipleSwings || data.me == data.liquidTank) {
            return {
              en: 'Tank Buster on YOU',
              ja: '自分にタンクバスター',
            };
          }
        }
      },
      infoText: function(data) {
        let multipleSwings = data.swingCount == 2 || data.swingCount == 3;
        if (data.role == 'healer')
          return;
        if (data.me == data.handTank && multipleSwings || data.me == data.liquidTank)
          return;
        return {
          en: 'Tank Cleave',
        };
      },
    },
    {
      id: 'TEA J Kick',
      regex: /J Kick/,
      beforeSeconds: 5,
      suppressSeconds: 1,
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank';
      },
      alertText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
    {
      // Note: there's nothing in the log for when the hand turns into an
      // open palm or a fist, so this just warns when to move and not
      // where to go based on time.
      id: 'TEA Hand of Stuff',
      regex: /Hand of Prayer\/Parting/,
      beforeSeconds: 5,
      suppressSeconds: 1,
      condition: function(data) {
        return data.role == 'tank';
      },
      infoText: {
        en: 'Move Bosses',
      },
    },
  ],
  triggers: [
    {
      id: 'TEA Liquid Tank',
      regex: Regexes.abilityFull({ source: 'Living Liquid', id: '4978' }),
      run: function(data, matches) {
        data.liquidTank = matches.target;
      },
    },
    {
      id: 'TEA Hand Tank',
      regex: Regexes.abilityFull({ source: 'Liquid Hand', id: '4979' }),
      run: function(data, matches) {
        data.handTank = matches.target;
      },
    },
    {
      id: 'TEA Cruise Chaser Tank',
      regex: Regexes.abilityFull({ source: 'Cruise Chaser', id: '497A' }),
      run: function(data, matches) {
        data.cruiseTank = matches.target;
      },
    },
    {
      id: 'TEA Cascade',
      regex: Regexes.startsUsing({ source: 'Living Liquid', id: '4826', capture: false }),
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank' || data.CanAddle();
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'TEA Protean Wave',
      regex: Regexes.startsUsing({ source: 'Living Liquid', id: '4822', capture: false }),
      infoText: {
        en: 'Protean Wave',
        ja: 'プロティアン',
      },
    },
    {
      id: 'TEA Drainage Tether',
      regex: Regexes.tether({ source: 'Liquid Rage', id: '0003' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      // Even if folks have the right tethers, this happens repeatedly.
      suppressSeconds: 5,
      alertText: {
        en: 'Drainage tether on YOU',
        ja: '自分にドレナージ',
      },
    },
    {
      id: 'TEA Hand of Pain 5',
      regex: Regexes.startsUsing({ source: 'Living Liquid', id: '482D', capture: false }),
      preRun: function(data) {
        data.handOfPainCount = (data.handOfPainCount || 0) + 1;
      },
      infoText: function(data) {
        if (data.handOfPainCount < 5)
          return;
        return {
          en: 'Focus Living Liquid',
          ja: 'リビングリキッドを攻撃',
        };
      },
    },
    {
      id: 'TEA Throttle',
      regex: Regexes.gainsEffect({ effect: 'Throttle', capture: false }),
      condition: function(data) {
        return data.CanCleanse();
      },
      suppressSeconds: 1,
      infoText: {
        en: 'Cleanse Throttle',
        ja: '窒息',
      },
    },
    {
      id: 'TEA Limit Cut',
      regex: Regexes.headMarker({ id: '00(?:4F|5[0-6])' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      durationSeconds: 15,
      alertText: function(data, matches) {
        let number = {
          '004F': 1,
          '0050': 2,
          '0051': 3,
          '0052': 4,
          '0053': 5,
          '0054': 6,
          '0055': 7,
          '0056': 8,
        }[matches.id];

        return {
          en: '#' + number,
          ja: number + '番',
        };
      },
    },
    {
      id: 'TEA Limit Cut Knockback and Cleaves',
      regex: Regexes.headMarker({ id: '00(?:4F|5[0-6])' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      // The markers take .3 seconds to be on all 8 players
      // This gives a warning within 5 seconds, so you can hit arm's length.
      delaySeconds: function(data, matches) {
        let number = {
          '004F': 4.5,
          '0050': 6,
          '0051': 9.1,
          '0052': 10.5,
          '0053': 13.6,
          '0054': 15,
          '0055': 18.2,
          '0056': 19.6,
        }[matches.id];

        return {
          number,
        };
      },
      alertText: function(data, matches) {
        if (parseInt(matches.id, 16) & 1 == 1) {
          return {
            en: 'Cleave on YOU',
            de: 'Cleave auf DIR',
            fr: 'Cleave sur vous',
            ja: '自分にクリーブ',
          };
        }
        return {
          en: 'Knockback',
          de: 'Knockback',
          fr: 'Poussée',
          cn: '击退',
          ja: 'ノックバック',
        };
      },
    },
    {
      id: 'TEA Chakrams Out',
      // Link Up
      regex: Regexes.ability({ source: 'Brute Justice', id: '483F', capture: false }),
      alertText: {
        en: 'Out, Dodge Chakrams',
        ja: '外へ',
      },
    },
    {
      id: 'TEA Chakrams In',
      // Optical Sight
      regex: Regexes.ability({ source: 'Cruise Chaser', id: '482F', capture: false }),
      suppressSeconds: 1,
      alertText: {
        en: 'Run In',
        ja: '中へ',
      },
    },
    {
      id: 'TEA Whirlwind',
      regex: Regexes.startsUsing({ source: 'Cruise Chaser', id: '49C2', capture: false }),
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank' || data.CanAddle();
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'TEA Compressed Water Initial',
      regex: Regexes.gainsEffect({ effect: 'Compressed Water' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Water on YOU',
        ja: '自分に水',
      },
    },
    {
      id: 'TEA Compressed Water Explode',
      regex: Regexes.gainsEffect({ effect: 'Compressed Water' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      delaySeconds: function(data, matches) {
        // 5 second warning.
        return parseFloat(matches.duration) - 5;
      },
      alertText: {
        en: 'Drop Water Soon',
        ja: '水来るよ',
      },
    },
    {
      id: 'TEA Compressed Lightning Initial',
      regex: Regexes.gainsEffect({ effect: 'Compressed Lightning' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Lightning on YOU',
        ja: '自分に雷',
      },
    },
    {
      id: 'TEA Compressed Lightning Explode',
      regex: Regexes.gainsEffect({ effect: 'Compressed Lightning' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      delaySeconds: function(data, matches) {
        // 5 second warning.
        return parseFloat(matches.duration) - 5;
      },
      alertText: {
        en: 'Drop Lightning Soon',
        ja: '雷来るよ',
      },
    },
    {
      id: 'TEA Pass Nisi 1',
      // 4 seconds after Photon cast starts.
      regex: Regexes.startsUsing({ source: 'Cruise Chaser', id: '4836', capture: false }),
      delaySeconds: 4,
      alertText: {
        en: 'Pass Nisi',
        ja: 'ナイサイ渡して',
      },
    },
    {
      id: 'TEA Pass Nisi 2',
      // 1 second after enumeration.
      // TODO: find a startsUsing instead of matching an action.
      regex: Regexes.ability({ source: 'Brute Justice', id: '4850', capture: false }),
      delaySeconds: 1,
      alertText: {
        en: 'Pass Nisi',
        ja: 'ナイサイ渡して',
      },
    },
    {
      id: 'TEA Pass Nisi 3',
      // 8 seconds after Flamethrower cast starts.
      regex: Regexes.startsUsing({ source: 'Brute Justice', id: '4845', capture: false }),
      delaySeconds: 8,
      alertText: {
        en: 'Pass Nisi',
        ja: 'ナイサイ渡して',
      },
    },
    {
      id: 'TEA Judgment Nisi A',
      regex: Regexes.gainsEffect({ effect: 'Final Judgment: Decree Nisi A' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      delaySeconds: 32,
      alarmText: {
        en: 'Get Blue α Nisi',
        ja: '青取って',
      },
    },
    {
      id: 'TEA Judgment Nisi B',
      regex: Regexes.gainsEffect({ effect: 'Final Judgment: Decree Nisi B' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      delaySeconds: 32,
      alarmText: {
        en: 'Get Orange β Nisi',
        ja: 'オレンジ取って',
      },
    },
    {
      id: 'TEA Judgment Nisi Γ',
      regex: Regexes.gainsEffect({ effect: 'Final Judgment: Decree Nisi Γ' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      delaySeconds: 32,
      alarmText: {
        en: 'Get Purple γ Nisi',
        ja: '紫取って',
      },
    },
    {
      id: 'TEA Judgment Nisi Δ',
      regex: Regexes.gainsEffect({ effect: 'Final Judgment: Decree Nisi Δ' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      delaySeconds: 32,
      alarmText: {
        en: 'Get Green δ Nisi',
        ja: '緑取って',
      },
    },
    {
      id: 'TEA Restraining Order',
      regex: Regexes.gainsEffect({ effect: 'Restraining Order' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Far Tethers',
        de: 'Entfernte Verbindungen',
        fr: 'Liens éloignés',
        ja: 'ファー',
        cn: '远离连线',
      },
    },
    {
      id: 'TEA House Arrest',
      regex: Regexes.gainsEffect({ effect: 'House Arrest' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Close Tethers',
        de: 'Nahe Verbindungen',
        fr: 'Liens proches',
        ja: 'ニアー',
        cn: '靠近连线',
      },
    },
    {
      id: 'TEA Chastening Heat',
      regex: Regexes.startsUsing({ source: 'Alexander Prime', id: '4A80' }),
      alarmText: function(data, matches) {
        if (matches.target == data.me || data.role != 'tank')
          return;

        return {
          en: 'Tank Swap!',
          de: 'Tankwechsel!',
          fr: 'Tank swap !',
          ja: 'スイッチ',
        };
      },
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
            ja: '自分にタンクバスター',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tankbuster auf ' + data.ShortName(matches[1]),
            fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
            ja: data.ShortName(matches[1]) + 'にタンクバスター',
          };
        }
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'ja',
      'replaceSync': {
        'Living Liquid': 'リビングリキッド',
        'Engage!': '戦闘開始！',
        'Liquid Hand': 'リキッドハンド',
        'Liquid Rage': 'リキッドレイジ',
        'Jagd Doll': 'ヤークトドール',
        'Cruise Chaser': 'クルーズチェイサー',
        'Brute Justice': 'ブルートジャスティス',
        'Alexander Prime': 'アレキサンダープライム',
        'Plasmasphere': 'プラズマスフィア',
        'Steam Chakram': 'スチームチャクラム',
        'Alexander': 'アレキサンダー',
        'Perfect Alexander': 'パーフェクトアレキサンダー',
      },
      'replaceText': {
        'attack': '攻撃',
        'Fluid Swing': 'フルイドスイング',
        'Cascade': 'カスケード',
        'Vice and Virtue': 'ヴァイス・アンド・ヴァーチュー',
        'Hand of Prayer/Parting': 'ハンド・オブ・プレイヤー/パーティング',
        'Rage Wave': 'レイジウェイブ',
        'Fluid Strike': 'フルイドストライク',
        'Exhaust': 'エグゾースト',
        'Hand of Pain': 'ハンド・オブ・ペイン',
        'Protean Wave': 'プロティアンウェイブ',
        'Sluice': 'スルース',
        'Splash': 'スプラッシュ',
        'Drainage': 'ドレナージ',
        'Liquid Gaol': 'リキッドジェイル',
        'Pressurize': '水圧充填',
        'Hawk Blaster': 'ホークブラスター',
        'Alpha Sword': 'アルファソード',
        'Middle Blaster': 'ミドルブラスター',
        'Super Blassty Charge': 'スーパーブラスティ・チャージ',
        'J Kick': 'ジャスティスキック',
        'Whirlwind': '竜巻',
        'Judgment Nisi': 'ジャッジメントナイサイ',
        'Link-Up': 'システムリンク',
        'Optical Sight': '照準',
        'Chakrams': 'チャクラム',
        'Photon': 'フォトン',
        'Spin Crusher': 'スピンクラッシャー',
        'Water and Thunder': '水/雷圧縮',
        'Earth Missile': 'アースミサイル',
        'Hidden Minefield': 'ステルス地雷散布',
        'Enumeration': 'カウント',
        'Limit Cut': 'リミッターカット',
        'Flamethrower': '大火炎放射',
      },
      '~effectNames': {
        'Final Judgment: Decree Nisi A': '最後の審判：仮判決α',
        'Final Judgment: Decree Nisi B': '最後の審判：仮判決β',
        'Final Judgment: Decree Nisi Γ': '最後の審判：仮判決γ',
        'Final Judgment: Decree Nisi Δ': '最後の審判：仮判決δ',
        'Compressed Water': '水属性圧縮',
        'Compressed Lightning': '雷属性圧縮',
        'Throttle': '窒息',
        'House Arrest': '確定判決：接近強制命令',
        'Restraining Order': '確定判決：接近禁止命令',
        'Shared Sentence': '確定判決：集団罰',
        'Final Word: Contact Prohibition': '確定判決：接触禁止命令',
        'Final Word: Contact Regulation': '確定判決：接触保護命令',
        'Final Word: Escape Detection': '確定判決：逃亡監察命令',
        'Final Word: Escape Prohibition': '確定判決：逃亡禁止命令',
        'Aggravated Assault': '確定判決：加重罰',
        'Contact Regulation Ordained': '接触保護命令',
        'Escape Detection Ordained': '逃亡監察命令',
      },
    },
  ],
}];
