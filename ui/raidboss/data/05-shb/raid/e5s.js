'use strict';

[{
  zoneRegex: {
    en: /^Eden's Verse: Fulmination \(Savage\)$/,
    ko: /^희망의 낙원 에덴: 공명편\(영웅\) \(1\)$/,
  },
  timelineFile: 'e5s.txt',
  triggers: [
    {
      id: 'E5S Fury\'s Bolt Gain',
      regex: Regexes.gainsEffect({ target: 'Ramuh', effect: 'Fury\'s Bolt', capture: false }),
      regexDe: Regexes.gainsEffect({ target: 'Ramuh', effect: 'Wütender Blitz', capture: false }),
      regexFr: Regexes.gainsEffect({ target: 'Ramuh', effect: 'Boules de foudre', capture: false }),
      regexJa: Regexes.gainsEffect({ target: 'ラムウ', effect: 'チャージボルト', capture: false }),
      run: function(data) {
        data.fury = true;
      },
    },
    {
      id: 'E5S Fury\'s Bolt Lose',
      regex: Regexes.losesEffect({ target: 'Ramuh', effect: 'Fury\'s Bolt', capture: false }),
      regexDe: Regexes.losesEffect({ target: 'Ramuh', effect: 'Wütender Blitz', capture: false }),
      regexFr: Regexes.losesEffect({ target: 'Ramuh', effect: 'Boules de foudre', capture: false }),
      regexJa: Regexes.losesEffect({ target: 'ラムウ', effect: 'チャージボルト', capture: false }),
      run: function(data) {
        data.fury = false;
      },
    },
    {
      id: 'E5S Stratospear Summons',
      regex: Regexes.ability({ id: '4BA5', source: 'Ramuh', capture: false }),
      regexDe: Regexes.ability({ id: '4BA5', source: 'Ramuh', capture: false }),
      regexFr: Regexes.ability({ id: '4BA5', source: 'Ramuh', capture: false }),
      regexJa: Regexes.ability({ id: '4BA5', source: 'ラムウ', capture: false }),
      regexKo: Regexes.ability({ id: '4BA5', source: '라무', capture: false }),
      delaySeconds: 5,
      condition: function(data) {
        return !data.seenFirstSpear;
      },
      run: function(data) {
        data.seenFirstSpear = true;
      },
      infoText: {
        en: 'Look for small spear',
        fr: 'Allez sur la petite lance',
        ko: '작은 지팡이 확인',
      },
    },
    {
      id: 'E5S Tribunal Summons',
      regex: Regexes.startsUsing({ id: '4BAC', source: 'Ramuh', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4BAC', source: 'Ramuh', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4BAC', source: 'Ramuh', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4BAC', source: 'ラムウ', capture: false }),
      regexKo: Regexes.startsUsing({ id: '4BAC', source: '라무', capture: false }),
      infoText: function(data) {
        if (data.seenFirstAdd) {
          return {
            en: 'Look for adds',
            fr: 'Cherchez les adds',
            ko: '쫄 위치 확인',
          };
        }
        data.seenFirstAdd = true;
      },
    },
    {
      id: 'E5S Fury\'s Bolt',
      regex: Regexes.startsUsing({ id: '4BAA', source: 'Ramuh', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4BAA', source: 'Ramuh', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4BAA', source: 'Ramuh', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4BAA', source: 'ラムウ', capture: false }),
      regexKo: Regexes.startsUsing({ id: '4BAA', source: '라무', capture: false }),
      infoText: {
        en: 'Fury\'s Bolt',
        fr: 'Boule de foudre',
        ko: '라무 강화',
      },
    },
    {
      id: 'E5S Fury\'s Fourteen',
      regex: Regexes.startsUsing({ id: '4BAB', source: 'Ramuh', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4BAB', source: 'Ramuh', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4BAB', source: 'Ramuh', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4BAB', source: 'ラムウ', capture: false }),
      regexKo: Regexes.startsUsing({ id: '4BAB', source: '라무', capture: false }),
      condition: function(data) {
        return !data.fourteenCount || data.fourteenCount < 2;
      },
      infoText: {
        en: 'Grab an orb',
        fr: 'Prenez un orbe',
        ko: '구슬 줍기',
      },
      run: function(data) {
        data.fourteenCount = data.fourteenCount || 0;
        data.fourteenCount++;
      },
    },
    {
      id: 'E5S Judgment Volts',
      regex: Regexes.startsUsing({ id: '4BB5', source: 'Ramuh', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4BB5', source: 'Ramuh', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4BB5', source: 'Ramuh', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4BB5', source: 'ラムウ', capture: false }),
      regexKo: Regexes.startsUsing({ id: '4BB5', source: '라무', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'E5S Stepped Leader',
      regex: Regexes.startsUsing({ id: '4BC6', source: 'Ramuh', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4BC6', source: 'Ramuh', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4BC6', source: 'Ramuh', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4BC6', source: 'ラムウ', capture: false }),
      regexKo: Regexes.startsUsing({ id: '4BC6', source: '라무', capture: false }),
      alertText: function(data) {
        if (!data.fury) {
          return {
            en: 'Ready Spread',
            fr: 'Dispersion bientot',
            ko: '산개 준비',
          };
        } else if (data.fury) {
          return {
            en: 'donut AoE',
            fr: 'AoE en donut',
            ko: '도넛 장판',
          };
        }
      },
    },
    {
      id: 'E5S Stepped Leader Spread',
      regex: Regexes.startsUsing({ id: '4BC6', source: 'Ramuh', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4BC6', source: 'Ramuh', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4BC6', source: 'Ramuh', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4BC6', source: 'ラムウ', capture: false }),
      regexKo: Regexes.startsUsing({ id: '4BC6', source: '라무', capture: false }),
      delaySeconds: 3.0,
      condition: function(data) {
        return !data.fury;
      },
      response: Responses.spread('alert'),
    },
    {
      id: 'E5S Crippling Blow',
      regex: Regexes.startsUsing({ id: '4BCA', source: 'Ramuh' }),
      regexDe: Regexes.startsUsing({ id: '4BCA', source: 'Ramuh' }),
      regexFr: Regexes.startsUsing({ id: '4BCA', source: 'Ramuh' }),
      regexJa: Regexes.startsUsing({ id: '4BCA', source: 'ラムウ' }),
      regexKo: Regexes.startsUsing({ id: '4BCA', source: '라무' }),
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      response: Responses.tankBuster(),
    },
    {
      id: 'E5S Stormcloud Summons',
      regex: Regexes.startsUsing({ id: '4BB8', source: 'Ramuh', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4BB8', source: 'Ramuh', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4BB8', source: 'Ramuh', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4BB8', source: 'ラムウ', capture: false }),
      regexKo: Regexes.startsUsing({ id: '4BB8', source: '라무', capture: false }),
      infoText: {
        en: 'Position for Stormcloud',
        fr: 'Position pour les nuages',
        ko: '번개 구름 위치 잡기',
      },
    },
    {
      id: 'E5S Centaur\'s Charge',
      regex: Regexes.startsUsing({ id: '4BAD', source: 'Ramuh', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4BAD', source: 'Ramuh', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4BAD', source: 'Ramuh', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4BAD', source: 'ラムウ', capture: false }),
      regexKo: Regexes.startsUsing({ id: '4BAD', source: '라무', capture: false }),
      infoText: {
        en: 'Be in your position',
        fr: 'Soyez en place',
        ko: '자기 위치에 있기',
      },
    },
    {
      id: 'E5S Chain Lightning',
      regex: Regexes.startsUsing({ id: '4BC4', source: 'Ramuh', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4BC4', source: 'Ramuh', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4BC4', source: 'Ramuh', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4BC4', source: 'ラムウ', capture: false }),
      regexKo: Regexes.startsUsing({ id: '4BC4', source: '라무', capture: false }),
      alertText: {
        en: 'Ready for Chain',
        fr: 'Préparez vous pour la chaine',
        ko: '번개 돌려막기 준비',
      },
    },
    {
      id: 'E5S Levinforce',
      regex: Regexes.startsUsing({ id: '4BCC', source: 'Ramuh', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4BCC', source: 'Ramuh', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4BCC', source: 'Ramuh', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4BCC', source: 'ラムウ', capture: false }),
      regexKo: Regexes.startsUsing({ id: '4BCC', source: '라무', capture: false }),
      response: Responses.knockback(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'stormcloud': 'Cumulonimbus-Wolke',
        'Ramuh': 'Ramuh',
        'Raiden': 'Raiden',
        'Will Of Ixion': 'Will Of Ixion',
      },
      'replaceText': {
        'Volt Strike': 'Voltschlag',
        'Tribunal Summons': 'Gedankenentstehung',
        'Thunderstorm': 'Gewitter',
        'Stratospear Summons': 'Stromgenerierung',
        'Stormcloud Summons': 'Elektrizitätsgenerierung',
        'Stepped Leader': 'Leuchtspur',
        'Shock Strike': 'Schockschlag',
        'Shock Blast': 'Schockstoß',
        'Shock(?! )': 'Entladung',
        'Lightning Bolt': 'Blitzschlag',
        'Levinforce': 'Blitzkraft',
        'Judgment Volts': 'Gewitter des Urteils',
        'Judgment Jolt': 'Blitz des Urteils',
        'Impact': 'Impakt',
        'Gallop': 'Galopp',
        'Fury\'s Fourteen': 'Wütende Vierzehn',
        'Fury\'s Bolt': 'Wütender Blitz',
        'Executor Summons': 'Wächtergenerierung',
        'Deadly Discharge': 'Tödliche Entladung',
        'Crippling Blow': 'Verkrüppelnder Schlag',
        'Chaos Strike': 'Chaosschlag',
        'Chain Lightning': 'Kettenblitz',
        'Centaur\'s Charge': 'Zentaurenansturm',
      },
      '~effectNames': {
        'System Shock': 'Elektrisiert',
        'Hated of Levin': 'Fluch des Blitzes',
        'Electrified': 'Stromleiter',
        'Damage Down': 'Schaden -',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'stormcloud': 'Cumulonimbus',
        'Ramuh': 'Ramuh',
        'Raiden': 'Raiden',
        'Will Of Ixion': 'Will Of Ixion',
      },
      'replaceText': {
        'Volt Strike': 'Frappe d\'éclair',
        'Tribunal Summons': 'Manifestations de l\'esprit',
        'Thunderstorm': 'Tempête de foudre',
        'Stratospear Summons': 'Conjuration de dards',
        'Stormcloud Summons': 'Nuage d\'orage',
        'Stepped Leader': 'Traceur',
        'Shock Strike': 'Frappe de choc',
        'Shock Blast': 'Impact foudroyant',
        'Shock(?! )': 'Décharge électrostatique',
        'Lightning Bolt': 'Éclair de foudre',
        'Levinforce': 'Déflagration fulgurante',
        'Judgment Volts': 'Éclair de chaleur du jugement',
        'Judgment Jolt': 'Front orageux du jugement',
        'Impact': 'Impact',
        'Gallop': 'Galop',
        'Fury\'s Fourteen': 'Boules de foudre - Quattordecim',
        'Fury\'s Bolt': 'Boules de foudre',
        'Executor Summons': 'Disjonction corporelle',
        'Deadly Discharge': 'Décharge mortelle',
        'Crippling Blow': 'Coup handicapant',
        'Chaos Strike': 'Frappe chaotique',
        'Chain Lightning': 'Chaîne d\'éclairs',
        'Centaur\'s Charge': 'Charge centaure',
      },
      '~effectNames': {
        'System Shock': 'Électro-choc',
        'Hated of Levin': 'Malédiction du Patriarche fulgurant',
        'Electrified': 'Électrocution irradiante',
        'Damage Down': 'Malus de dégâts',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'stormcloud': '積乱雲',
        'Ramuh': 'ラムウ',
        'Raiden': 'ライディーン',
        'Will Of Ixion': 'Will Of Ixion',
      },
      'replaceText': {
        'Volt Strike': 'ボルトストライク',
        'Tribunal Summons': '思念体生成',
        'Thunderstorm': 'サンダーストーム',
        'Stratospear Summons': '武具生成',
        'Stormcloud Summons': '雷雲生成',
        'Stepped Leader': 'ステップトリーダー',
        'Shock Strike': 'ショックストライク',
        'Shock Blast': 'ショックブラスト',
        'Shock(?! )': '放電',
        'Lightning Bolt': '落雷',
        'Levinforce': 'ライトニングフォース',
        'Judgment Volts': '裁きの熱雷',
        'Judgment Jolt': '裁きの界雷',
        'Impact': '衝撃',
        'Gallop': 'ギャロップ',
        'Fury\'s Fourteen': 'フォーティーン・チャージボルト',
        'Fury\'s Bolt': 'チャージボルト',
        'Executor Summons': '分離体生成',
        'Deadly Discharge': 'デッドリーディスチャージ',
        'Crippling Blow': '痛打',
        'Chaos Strike': 'カオスストライク',
        'Chain Lightning': 'チェインライトニング',
        'Centaur\'s Charge': 'セントールチャージ',
      },
      '~effectNames': {
        'System Shock': '電気ショック',
        'Hated of Levin': '雷神の呪い',
        'Electrified': '過剰帯電',
        'Damage Down': 'ダメージ低下',
      },
    },
  ],
}];
