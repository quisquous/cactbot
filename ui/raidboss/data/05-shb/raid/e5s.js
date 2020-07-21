'use strict';

[{
  zoneRegex: {
    en: /^Eden's Verse: Fulmination \(Savage\)$/,
    cn: /^伊甸零式希望乐园 \(共鸣之章1\)$/,
    ko: /^희망의 낙원 에덴: 공명편\(영웅\) \(1\)$/,
  },
  zoneId: ZoneId.EdensVerseFulminationSavage,
  timelineFile: 'e5s.txt',
  timelineTriggers: [
    {
      id: 'E5S Stepped Leader Next',
      regex: /^Stepped Leader$/,
      beforeSeconds: 15,
      run: function(data) {
        data.steppedLeaderNext = true;
      },
    },
  ],
  triggers: [
    {
      id: 'E5S Surge Protection Gain',
      netRegex: NetRegexes.gainsEffect({ effectId: '8B4' }),
      condition: Conditions.targetIsYou(),
      run: function(data) {
        data.surgeProtection = true;
      },
    },
    {
      id: 'E5S Surge Protection Loss',
      netRegex: NetRegexes.losesEffect({ effectId: '8B4' }),
      condition: Conditions.targetIsYou(),
      run: function(data) {
        data.surgeProtection = false;
      },
    },
    {
      id: 'E5S Stratospear Summons',
      netRegex: NetRegexes.ability({ id: '4BA5', source: 'Ramuh', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '4BA5', source: 'Ramuh', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '4BA5', source: 'Ramuh', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '4BA5', source: 'ラムウ', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '4BA5', source: '라무', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '4BA5', source: '拉姆', capture: false }),
      condition: function(data) {
        return !data.seenFirstSpear;
      },
      delaySeconds: 5,
      infoText: {
        en: 'Look for small spear',
        de: 'Halt nach kleinem Speer ausschau',
        fr: 'Allez sur la petite lance',
        cn: '找短矛',
        ko: '작은 지팡이 확인',
      },
      run: function(data) {
        data.seenFirstSpear = true;
      },
    },
    {
      id: 'E5S Tribunal Summons',
      netRegex: NetRegexes.startsUsing({ id: '4BAC', source: 'Ramuh', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '4BAC', source: 'Ramuh', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '4BAC', source: 'Ramuh', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '4BAC', source: 'ラムウ', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '4BAC', source: '라무', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '4BAC', source: '拉姆', capture: false }),
      infoText: function(data) {
        if (data.seenFirstAdd) {
          return {
            en: 'Look for adds',
            de: 'Halt nach dem Add ausschau',
            fr: 'Cherchez les adds',
            cn: '冲锋',
            ko: '쫄 위치 확인',
          };
        }
        if (data.furysBoltActive) {
          return {
            en: 'Big Knockback',
            de: 'Weiter Rückstoß',
            fr: 'Forte poussée',
            cn: '长击退',
            ko: '긴 넉백',
          };
        }
        return {
          en: 'Short Knockback',
          de: 'Kurzer Rückstoß',
          fr: 'Faible poussée',
          cn: '短击退',
          ko: '짧은 넉백',
        };
      },
      run: function(data) {
        data.seenFirstAdd = true;
      },
    },
    {
      id: 'E5S Fury\'s Bolt',
      netRegex: NetRegexes.startsUsing({ id: '4BAA', source: 'Ramuh', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '4BAA', source: 'Ramuh', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '4BAA', source: 'Ramuh', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '4BAA', source: 'ラムウ', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '4BAA', source: '라무', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '4BAA', source: '拉姆', capture: false }),
      alertText: function(data) {
        // Fury's Bolt + Stepped Leader doesn't require an orb
        if (!data.surgeProtection && !data.steppedLeaderNext) {
          return {
            en: 'Grab an orb',
            de: 'Einen Orb nehmen',
            fr: 'Prenez un orbe',
            cn: '吃球',
            ko: '구슬 줍기',
          };
        }
      },
    },
    {
      id: 'E5S Fury\'s Bolt Gain',
      netRegex: NetRegexes.gainsEffect({ effectId: '8B7', capture: false }),
      run: function(data) {
        data.furysBoltActive = true;
      },
    },
    {
      id: 'E5S Fury\'s Bolt Lose',
      netRegex: NetRegexes.losesEffect({ effectId: '8B7', capture: false }),
      run: function(data) {
        data.furysBoltActive = false;
      },
    },
    {
      id: 'E5S Fury\'s Fourteen',
      netRegex: NetRegexes.startsUsing({ id: '4BAB', source: 'Ramuh', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '4BAB', source: 'Ramuh', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '4BAB', source: 'Ramuh', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '4BAB', source: 'ラムウ', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '4BAB', source: '라무', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '4BAB', source: '拉姆', capture: false }),
      condition: function(data) {
        return !data.furysFourteenCounter || data.furysFourteenCounter < 2;
      },
      alertText: function(data) {
        if (!data.surgeProtection) {
          return {
            en: 'Grab an orb',
            de: 'Einen Orb nehmen',
            fr: 'Prenez un orbe',
            cn: '吃球',
            ko: '구슬 줍기',
          };
        }
      },
      run: function(data) {
        data.furysFourteenCounter = data.furysFourteenCounter || 0;
        data.furysFourteenCounter++;
      },
    },
    {
      id: 'E5S Judgment Volts',
      netRegex: NetRegexes.startsUsing({ id: '4BB5', source: 'Ramuh', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '4BB5', source: 'Ramuh', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '4BB5', source: 'Ramuh', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '4BB5', source: 'ラムウ', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '4BB5', source: '라무', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '4BB5', source: '拉姆', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      id: 'E5S Stepped Leader',
      netRegex: NetRegexes.startsUsing({ id: '4BC6', source: 'Ramuh', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '4BC6', source: 'Ramuh', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '4BC6', source: 'Ramuh', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '4BC6', source: 'ラムウ', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '4BC6', source: '라무', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '4BC6', source: '拉姆', capture: false }),
      alertText: function(data) {
        // Fury's Bolt + Stepped Leader is a donut AoE instead
        if (!data.furysBoltActive) {
          return {
            en: 'Ready Spread',
            de: 'Bereitmachen zum Verteilen',
            fr: 'Dispersion bientôt',
            cn: '准备分散',
            ko: '산개 준비',
          };
        }
        return {
          en: 'donut AoE',
          de: 'Donut AoE',
          fr: 'AoE en donut',
          cn: '环形AOE',
          ko: '도넛 장판',
        };
      },
    },
    {
      id: 'E5S Stepped Leader Spread',
      netRegex: NetRegexes.startsUsing({ id: '4BC6', source: 'Ramuh', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '4BC6', source: 'Ramuh', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '4BC6', source: 'Ramuh', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '4BC6', source: 'ラムウ', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '4BC6', source: '라무', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '4BC6', source: '拉姆', capture: false }),
      condition: function(data) {
        return !data.furysBoltActive;
      },
      delaySeconds: 3,
      response: Responses.move('alarm'),
    },
    {
      id: 'E5S Stepped Leader Cast',
      netRegex: NetRegexes.ability({ id: '4BC6', source: 'Ramuh', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '4BC6', source: 'Ramuh', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '4BC6', source: 'Ramuh', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '4BC6', source: 'ラムウ', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '4BC6', source: '라무', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '4BC6', source: '拉姆', capture: false }),
      run: function(data) {
        data.steppedLeaderNext = false;
      },
    },
    {
      id: 'E5S Crippling Blow',
      netRegex: NetRegexes.startsUsing({ id: '4BCA', source: 'Ramuh' }),
      netRegexDe: NetRegexes.startsUsing({ id: '4BCA', source: 'Ramuh' }),
      netRegexFr: NetRegexes.startsUsing({ id: '4BCA', source: 'Ramuh' }),
      netRegexJa: NetRegexes.startsUsing({ id: '4BCA', source: 'ラムウ' }),
      netRegexKo: NetRegexes.startsUsing({ id: '4BCA', source: '라무' }),
      netRegexCn: NetRegexes.startsUsing({ id: '4BCA', source: '拉姆' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'E5S Stormcloud Summons',
      netRegex: NetRegexes.startsUsing({ id: '4BB8', source: 'Ramuh', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '4BB8', source: 'Ramuh', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '4BB8', source: 'Ramuh', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '4BB8', source: 'ラムウ', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '4BB8', source: '라무', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '4BB8', source: '拉姆', capture: false }),
      infoText: {
        en: 'Position for Stormcloud',
        de: 'Position für die Wolke',
        fr: 'Position pour les nuages',
        cn: '雷云站位',
        ko: '번개 구름 위치 잡기',
      },
    },
    {
      // Hated of Levin debuff
      id: 'E5S Stormcloud Cleanse',
      netRegex: NetRegexes.headMarker({ id: '00D2' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Cleanse In Cloud',
        de: 'In der Wolke reinigen',
        fr: 'Purifiez-vous dans le nuage',
        ko: '디버프 제거하기',
        cn: '雷云清Debuff',
      },
    },
    {
      id: 'E5S Stormcloud Drop',
      netRegex: NetRegexes.headMarker({ id: '006E' }),
      condition: Conditions.targetIsYou(),
      alertText: {
        en: 'Drop Cloud Away',
        de: 'Wolke drausen ablegen',
        fr: 'Déposez le nuage à l\'extérieur',
        ko: '번개 구름 소환자',
        cn: '远离放雷云',
      },
    },
    {
      id: 'E5S Centaur\'s Charge',
      netRegex: NetRegexes.startsUsing({ id: '4BAD', source: 'Ramuh', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '4BAD', source: 'Ramuh', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '4BAD', source: 'Ramuh', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '4BAD', source: 'ラムウ', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '4BAD', source: '라무', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '4BAD', source: '拉姆', capture: false }),
      infoText: {
        en: 'Be in your position',
        de: 'Befinde dich auf deiner Position!',
        fr: 'Soyez à votre position',
        cn: '冲锋站位',
        ko: '자기 위치에 있기',
      },
    },
    {
      id: 'E5S Chain Lightning',
      netRegex: NetRegexes.startsUsing({ id: '4BC4', source: 'Ramuh', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '4BC4', source: 'Ramuh', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '4BC4', source: 'Ramuh', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '4BC4', source: 'ラムウ', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '4BC4', source: '라무', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '4BC4', source: '拉姆', capture: false }),
      alertText: {
        en: 'Ready for Chain',
        de: 'Bereit für Kettenblitz',
        fr: 'Préparez-vous pour la chaine',
        ko: '체인 라이트닝 준비',
        cn: '雷光链',
      },
    },
    {
      id: 'E5S Levinforce',
      netRegex: NetRegexes.startsUsing({ id: '4BCC', source: 'Ramuh', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '4BCC', source: 'Ramuh', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '4BCC', source: 'Ramuh', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '4BCC', source: 'ラムウ', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '4BCC', source: '라무', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '4BCC', source: '拉姆', capture: false }),
      response: Responses.knockback(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Stormcloud': 'Cumulonimbus-Wolke',
        'Ramuh': 'Ramuh',
        'Raiden': 'Raiden',
        'Will Of Ixion': 'Ixion-Spiegelung',
      },
      'replaceText': {
        'Volt Strike': 'Voltschlag',
        'Tribunal Summons': 'Gedankenentstehung',
        'Thunderstorm': 'Gewitter',
        'Stratospear Summons': 'Stromgenerierung',
        'Stormcloud Summons': 'Elektrizitätsgenerierung',
        'Stepped Leader': 'Leuchtspur',
        'Shock Blast': 'Schockstoß',
        'Lightning Bolt': 'Blitzschlag',
        'Levinforce': 'Blitzkraft',
        'Judgment Volts': 'Gewitter des Urteils',
        'Judgment Jolt': 'Blitz des Urteils',
        'Impact': 'Impakt',
        'Gallop': 'Galopp',
        'Fury\'s Fourteen': 'Wütende Vierzehn',
        'Fury\'s Bolt': 'Wütender Blitz',
        'Executor Summons': 'Wächtergenerierung',
        'Crippling Blow': 'Verkrüppelnder Schlag',
        'Chaos Strike': 'Chaosschlag',
        'Chain Lightning': 'Kettenblitz',
        'Centaur\'s Charge': 'Zentaurenansturm',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'stormcloud': 'Cumulonimbus',
        'Ramuh': 'Ramuh',
        'Raiden': 'Raiden',
        'Will Of Ixion': 'Réplique d\'Ixion',
      },
      'replaceText': {
        '\\?': ' ?',
        'Volt Strike': 'Frappe d\'éclair',
        'Tribunal Summons': 'Manifestations de l\'esprit',
        'Thunderstorm': 'Tempête de foudre',
        'Stratospear Summons': 'Conjuration de dards',
        'Stormcloud Summons': 'Nuage d\'orage',
        'Stepped Leader': 'Traceur',
        'Shock Blast': 'Impact foudroyant',
        'Lightning Bolt': 'Éclair de foudre',
        'Levinforce': 'Déflagration fulgurante',
        'Judgment Volts': 'Éclair de chaleur du jugement',
        'Judgment Jolt': 'Front orageux du jugement',
        'Impact': 'Impact',
        'Gallop': 'Galop',
        'Fury\'s Fourteen': 'Boules de foudre - Quattordecim',
        'Fury\'s Bolt': 'Boules de foudre',
        'Executor Summons': 'Disjonction corporelle',
        'Crippling Blow': 'Coup handicapant',
        'Chaos Strike': 'Frappe chaotique',
        'Chain Lightning': 'Chaîne d\'éclairs',
        'Centaur\'s Charge': 'Charge centaure',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'stormcloud': '積乱雲',
        'Ramuh': 'ラムウ',
        'Raiden': 'ライディーン',
        'Will Of Ixion': 'イクシオン・ミラージュ',
      },
      'replaceText': {
        'Volt Strike': 'ボルトストライク',
        'Tribunal Summons': '思念体生成',
        'Thunderstorm': 'サンダーストーム',
        'Stratospear Summons': '武具生成',
        'Stormcloud Summons': '雷雲生成',
        'Stepped Leader': 'ステップトリーダー',
        'Shock Blast': 'ショックブラスト',
        'Lightning Bolt': '落雷',
        'Levinforce': 'ライトニングフォース',
        'Judgment Volts': '裁きの熱雷',
        'Judgment Jolt': '裁きの界雷',
        'Impact': '衝撃',
        'Gallop': 'ギャロップ',
        'Fury\'s Fourteen': 'フォーティーン・チャージボルト',
        'Fury\'s Bolt': 'チャージボルト',
        'Executor Summons': '分離体生成',
        'Crippling Blow': '痛打',
        'Chaos Strike': 'カオスストライク',
        'Chain Lightning': 'チェインライトニング',
        'Centaur\'s Charge': 'セントールチャージ',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'stormcloud': '雷暴云',
        '(?<! )Ramuh': '拉姆',
        'Will Of Ramuh': '拉姆幻影',
        'Raiden': '莱丁',
        'Will Of Ixion': '伊克西翁幻影',
      },
      'replaceText': {
        'Volt Strike': '雷电强袭',
        'Tribunal Summons': '生成幻影',
        'Thunderstorm': '雷暴',
        'Stratospear Summons': '生成武具',
        'Stormcloud Summons': '生成雷暴云',
        'Stepped Leader': '梯级先导',
        'Shock Strike': '轰雷',
        'Shock Blast': '震荡爆雷',
        'Shock(?! )': '放电',
        'Lightning Bolt': '落雷',
        'Levinforce': '雷霆之力',
        'Judgment Volts': '制裁之热雷',
        'Judgment Jolt': '制裁之界雷',
        'Impact': '冲击',
        'Gallop': '飞驰',
        'Fury\'s Fourteen': '十四重蓄雷',
        'Fury\'s Bolt': '蓄雷',
        'Executor Summons': '生成仆从',
        'Deadly Discharge': '死亡冲锋',
        'Crippling Blow': '痛击',
        'Chaos Strike': '混乱冲击',
        'Chain Lightning': '雷光链',
        'Centaur\'s Charge': '人马冲锋',
      },
    },
  ],
}];
