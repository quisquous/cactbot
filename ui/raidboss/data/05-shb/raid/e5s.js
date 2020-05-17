'use strict';

[{
  zoneRegex: {
    en: /^Eden's Verse: Fulmination \(Savage\)$/,
    ko: /^희망의 낙원 에덴: 공명편\(영웅\) \(1\)$/,
  },
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
      regex: Regexes.gainsEffect({ effect: 'Surge Protection' }),
      regexDe: Regexes.gainsEffect({ effect: 'Überspannungsschutz' }),
      regexFr: Regexes.gainsEffect({ effect: 'Parafoudre' }),
      regexJa: Regexes.gainsEffect({ effect: '避雷' }),
      condition: Conditions.targetIsYou(),
      run: function(data) {
        data.surgeProtection = true;
      },
    },
    {
      id: 'E5S Surge Protection Loss',
      regex: Regexes.losesEffect({ effect: 'Surge Protection' }),
      regexDe: Regexes.losesEffect({ effect: 'Überspannungsschutz' }),
      regexFr: Regexes.losesEffect({ effect: 'Parafoudre' }),
      regexJa: Regexes.losesEffect({ effect: '避雷' }),
      condition: Conditions.targetIsYou(),
      run: function(data) {
        data.surgeProtection = false;
      },
    },
    {
      id: 'E5S Stratospear Summons',
      regex: Regexes.ability({ id: '4BA5', source: 'Ramuh', capture: false }),
      regexDe: Regexes.ability({ id: '4BA5', source: 'Ramuh', capture: false }),
      regexFr: Regexes.ability({ id: '4BA5', source: 'Ramuh', capture: false }),
      regexJa: Regexes.ability({ id: '4BA5', source: 'ラムウ', capture: false }),
      regexKo: Regexes.ability({ id: '4BA5', source: '라무', capture: false }),
      regexCn: Regexes.ability({ id: '4BA5', source: '拉姆', capture: false }),
      condition: function(data) {
        return !data.seenFirstSpear;
      },
      delaySeconds: 5,
      infoText: {
        en: 'Look for small spear',
        de: 'Halt nach kleinem Speer ausschau',
        fr: 'Allez sur la petite lance',
        ko: '작은 지팡이 확인',
        cn: '找短矛',
      },
      run: function(data) {
        data.seenFirstSpear = true;
      },
    },
    {
      id: 'E5S Tribunal Summons',
      regex: Regexes.startsUsing({ id: '4BAC', source: 'Ramuh', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4BAC', source: 'Ramuh', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4BAC', source: 'Ramuh', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4BAC', source: 'ラムウ', capture: false }),
      regexKo: Regexes.startsUsing({ id: '4BAC', source: '라무', capture: false }),
      regexCn: Regexes.startsUsing({ id: '4BAC', source: '拉姆', capture: false }),
      infoText: function(data) {
        if (data.seenFirstAdd) {
          return {
            en: 'Look for adds',
            de: 'Halt nach dem Add ausschau',
            fr: 'Cherchez les adds',
            ko: '쫄 위치 확인',
            cn: '冲锋',
          };
        }
        if (data.furysBoltActive) {
          return {
            en: 'Big Knockback',
            cn: '长击退',
            de: 'Weiter Rückstoß',
            fr: 'Forte poussée',
            ko: '긴 넉백',
          };
        }
        return {
          en: 'Short Knockback',
          cn: '短击退',
          de: 'Kurzer Rückstoß',
          fr: 'Faible poussée',
          ko: '짧은 넉백',
        };
      },
      run: function(data) {
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
      regexCn: Regexes.startsUsing({ id: '4BAA', source: '拉姆', capture: false }),
      alertText: function(data) {
        // Fury's Bolt + Stepped Leader doesn't require an orb
        if (!data.surgeProtection && !data.steppedLeaderNext) {
          return {
            en: 'Grab an orb',
            de: 'Einen Orb nehmen',
            fr: 'Prenez un orbe',
            ko: '구슬 줍기',
            cn: '吃球',
          };
        }
      },
    },
    {
      id: 'E5S Fury\'s Bolt Gain',
      regex: Regexes.gainsEffect({ target: 'Ramuh', effect: 'Fury\'s Bolt', capture: false }),
      regexDe: Regexes.gainsEffect({ target: 'Ramuh', effect: 'Wütender Blitz', capture: false }),
      regexFr: Regexes.gainsEffect({ target: 'Ramuh', effect: 'Boules de foudre', capture: false }),
      regexJa: Regexes.gainsEffect({ target: 'ラムウ', effect: 'チャージボルト', capture: false }),
      run: function(data) {
        data.furysBoltActive = true;
      },
    },
    {
      id: 'E5S Fury\'s Bolt Lose',
      regex: Regexes.losesEffect({ target: 'Ramuh', effect: 'Fury\'s Bolt', capture: false }),
      regexDe: Regexes.losesEffect({ target: 'Ramuh', effect: 'Wütender Blitz', capture: false }),
      regexFr: Regexes.losesEffect({ target: 'Ramuh', effect: 'Boules de foudre', capture: false }),
      regexJa: Regexes.losesEffect({ target: 'ラムウ', effect: 'チャージボルト', capture: false }),
      run: function(data) {
        data.furysBoltActive = false;
      },
    },
    {
      id: 'E5S Fury\'s Fourteen',
      regex: Regexes.startsUsing({ id: '4BAB', source: 'Ramuh', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4BAB', source: 'Ramuh', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4BAB', source: 'Ramuh', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4BAB', source: 'ラムウ', capture: false }),
      regexKo: Regexes.startsUsing({ id: '4BAB', source: '라무', capture: false }),
      regexCn: Regexes.startsUsing({ id: '4BAB', source: '拉姆', capture: false }),
      condition: function(data) {
        return !data.furysFourteenCounter || data.furysFourteenCounter < 2;
      },
      alertText: function(data) {
        if (!data.surgeProtection) {
          return {
            en: 'Grab an orb',
            de: 'Einen Orb nehmen',
            fr: 'Prenez un orbe',
            ko: '구슬 줍기',
            cn: '吃球',
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
      regex: Regexes.startsUsing({ id: '4BB5', source: 'Ramuh', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4BB5', source: 'Ramuh', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4BB5', source: 'Ramuh', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4BB5', source: 'ラムウ', capture: false }),
      regexKo: Regexes.startsUsing({ id: '4BB5', source: '라무', capture: false }),
      regexCn: Regexes.startsUsing({ id: '4BB5', source: '拉姆', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      id: 'E5S Stepped Leader',
      regex: Regexes.startsUsing({ id: '4BC6', source: 'Ramuh', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4BC6', source: 'Ramuh', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4BC6', source: 'Ramuh', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4BC6', source: 'ラムウ', capture: false }),
      regexKo: Regexes.startsUsing({ id: '4BC6', source: '라무', capture: false }),
      regexCn: Regexes.startsUsing({ id: '4BC6', source: '拉姆', capture: false }),
      alertText: function(data) {
        // Fury's Bolt + Stepped Leader is a donut AoE instead
        if (!data.furysBoltActive) {
          return {
            en: 'Ready Spread',
            de: 'Bereitmachen zum Verteilen',
            fr: 'Dispersion bientôt',
            ko: '산개 준비',
            cn: '准备分散',
          };
        }
        return {
          en: 'donut AoE',
          de: 'Donut AoE',
          fr: 'AoE en donut',
          ko: '도넛 장판',
          cn: '环形AoE',
        };
      },
    },
    {
      id: 'E5S Stepped Leader Spread',
      regex: Regexes.startsUsing({ id: '4BC6', source: 'Ramuh', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4BC6', source: 'Ramuh', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4BC6', source: 'Ramuh', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4BC6', source: 'ラムウ', capture: false }),
      regexKo: Regexes.startsUsing({ id: '4BC6', source: '라무', capture: false }),
      regexCn: Regexes.startsUsing({ id: '4BC6', source: '拉姆', capture: false }),
      condition: function(data) {
        return !data.furysBoltActive;
      },
      delaySeconds: 3,
      response: Responses.move('alarm'),
    },
    {
      id: 'E5S Stepped Leader Cast',
      regex: Regexes.ability({ id: '4BC6', source: 'Ramuh', capture: false }),
      regexDe: Regexes.ability({ id: '4BC6', source: 'Ramuh', capture: false }),
      regexFr: Regexes.ability({ id: '4BC6', source: 'Ramuh', capture: false }),
      regexJa: Regexes.ability({ id: '4BC6', source: 'ラムウ', capture: false }),
      regexKo: Regexes.ability({ id: '4BC6', source: '라무', capture: false }),
      regexCn: Regexes.ability({ id: '4BC6', source: '拉姆', capture: false }),
      run: function(data) {
        data.steppedLeaderNext = false;
      },
    },
    {
      id: 'E5S Crippling Blow',
      regex: Regexes.startsUsing({ id: '4BCA', source: 'Ramuh' }),
      regexDe: Regexes.startsUsing({ id: '4BCA', source: 'Ramuh' }),
      regexFr: Regexes.startsUsing({ id: '4BCA', source: 'Ramuh' }),
      regexJa: Regexes.startsUsing({ id: '4BCA', source: 'ラムウ' }),
      regexKo: Regexes.startsUsing({ id: '4BCA', source: '라무' }),
      regexCn: Regexes.startsUsing({ id: '4BCA', source: '拉姆' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'E5S Stormcloud Summons',
      regex: Regexes.startsUsing({ id: '4BB8', source: 'Ramuh', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4BB8', source: 'Ramuh', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4BB8', source: 'Ramuh', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4BB8', source: 'ラムウ', capture: false }),
      regexKo: Regexes.startsUsing({ id: '4BB8', source: '라무', capture: false }),
      regexCn: Regexes.startsUsing({ id: '4BB8', source: '拉姆', capture: false }),
      infoText: {
        en: 'Position for Stormcloud',
        de: 'Position für die Wolke',
        fr: 'Position pour les nuages',
        ko: '번개 구름 위치 잡기',
        cn: '雷云站位',
      },
    },
    {
      id: 'E5S Centaur\'s Charge',
      regex: Regexes.startsUsing({ id: '4BAD', source: 'Ramuh', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4BAD', source: 'Ramuh', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4BAD', source: 'Ramuh', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4BAD', source: 'ラムウ', capture: false }),
      regexKo: Regexes.startsUsing({ id: '4BAD', source: '라무', capture: false }),
      regexCn: Regexes.startsUsing({ id: '4BAD', source: '拉姆', capture: false }),
      infoText: {
        en: 'Be in your position',
        de: 'Befinde dich auf deiner Position!',
        fr: 'Soyez en place',
        ko: '자기 위치에 있기',
        cn: '冲锋站位',
      },
    },
    {
      id: 'E5S Chain Lightning',
      regex: Regexes.startsUsing({ id: '4BC4', source: 'Ramuh', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4BC4', source: 'Ramuh', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4BC4', source: 'Ramuh', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4BC4', source: 'ラムウ', capture: false }),
      regexKo: Regexes.startsUsing({ id: '4BC4', source: '라무', capture: false }),
      regexCn: Regexes.startsUsing({ id: '4BC4', source: '拉姆', capture: false }),
      alertText: {
        en: 'Ready for Chain',
        de: 'Bereit für Kettenblitz',
        fr: 'Préparez-vous pour la chaine',
        ko: '번개 돌려막기 준비',
        cn: '闪电链',
      },
    },
    {
      id: 'E5S Levinforce',
      regex: Regexes.startsUsing({ id: '4BCC', source: 'Ramuh', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4BCC', source: 'Ramuh', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4BCC', source: 'Ramuh', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4BCC', source: 'ラムウ', capture: false }),
      regexKo: Regexes.startsUsing({ id: '4BCC', source: '라무', capture: false }),
      regexCn: Regexes.startsUsing({ id: '4BCC', source: '拉姆', capture: false }),
      response: Responses.knockback(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Raiden': 'Raiden',
        'Ramuh': 'Ramuh',
        'Stormcloud': 'Cumulonimbus-Wolke',
        'Will Of Ixion': 'Ixion-Spiegelung',
      },
      'replaceText': {
        'Centaur\'s Charge': 'Zentaurenansturm',
        'Chain Lightning': 'Kettenblitz',
        'Chaos Strike': 'Chaosschlag',
        'Crippling Blow': 'Verkrüppelnder Schlag',
        'Deadly Discharge': 'Tödliche Entladung',
        'Executor Summons': 'Wächtergenerierung',
        'Fury\'s Bolt': 'Wütender Blitz',
        'Fury\'s Fourteen': 'Wütende Vierzehn',
        'Gallop': 'Galopp',
        'Impact': 'Impakt',
        'Judgment Jolt': 'Blitz des Urteils',
        'Judgment Volts': 'Gewitter des Urteils',
        'Levinforce': 'Blitzkraft',
        'Lightning Bolt': 'Blitzschlag',
        'Shock Blast': 'Schockstoß',
        'Shock Strike': 'Schockschlag',
        'Shock(?! )': 'Entladung',
        'Stepped Leader': 'Leuchtspur',
        'Stormcloud Summons': 'Elektrizitätsgenerierung',
        'Stratospear Summons': 'Stromgenerierung',
        'Thunderstorm': 'Gewitter',
        'Tribunal Summons': 'Gedankenentstehung',
        'Volt Strike': 'Voltschlag',
      },
      '~effectNames': {
        'Damage Down': 'Schaden -',
        'Electrified': 'Stromleiter',
        'Fury\'s Bolt': 'Wütender Blitz',
        'Hated of Levin': 'Fluch des Blitzes',
        'Surge Protection': 'Überspannungsschutz',
        'System Shock': 'Elektrisiert',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Raiden': 'Raiden',
        'Ramuh': 'Ramuh',
        'Will Of Ixion': 'Réplique d\'Ixion',
        'stormcloud': 'Cumulonimbus',
      },
      'replaceText': {
        'Centaur\'s Charge': 'Charge centaure',
        'Chain Lightning': 'Chaîne d\'éclairs',
        'Chaos Strike': 'Frappe chaotique',
        'Crippling Blow': 'Coup handicapant',
        'Deadly Discharge': 'Décharge mortelle',
        'Executor Summons': 'Disjonction corporelle',
        'Fury\'s Bolt': 'Boules de foudre',
        'Fury\'s Fourteen': 'Boules de foudre - Quattordecim',
        'Gallop': 'Galop',
        'Impact': 'Impact',
        'Judgment Jolt': 'Front orageux du jugement',
        'Judgment Volts': 'Éclair de chaleur du jugement',
        'Levinforce': 'Déflagration fulgurante',
        'Lightning Bolt': 'Éclair de foudre',
        'Shock Blast': 'Impact foudroyant',
        'Shock Strike': 'Frappe de choc',
        'Shock(?! )': 'Décharge électrostatique',
        'Stepped Leader': 'Traceur',
        'Stormcloud Summons': 'Nuage d\'orage',
        'Stratospear Summons': 'Conjuration de dards',
        'Thunderstorm': 'Tempête de foudre',
        'Tribunal Summons': 'Manifestations de l\'esprit',
        'Volt Strike': 'Frappe d\'éclair',
      },
      '~effectNames': {
        'Damage Down': 'Malus de dégâts',
        'Electrified': 'Électrocution irradiante',
        'Hated of Levin': 'Malédiction du Patriarche fulgurant',
        'System Shock': 'Électro-choc',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Raiden': 'ライディーン',
        'Ramuh': 'ラムウ',
        'Will Of Ixion': 'イクシオン・ミラージュ',
        'stormcloud': '積乱雲',
      },
      'replaceText': {
        'Centaur\'s Charge': 'セントールチャージ',
        'Chain Lightning': 'チェインライトニング',
        'Chaos Strike': 'カオスストライク',
        'Crippling Blow': '痛打',
        'Deadly Discharge': 'デッドリーディスチャージ',
        'Executor Summons': '分離体生成',
        'Fury\'s Bolt': 'チャージボルト',
        'Fury\'s Fourteen': 'フォーティーン・チャージボルト',
        'Gallop': 'ギャロップ',
        'Impact': '衝撃',
        'Judgment Jolt': '裁きの界雷',
        'Judgment Volts': '裁きの熱雷',
        'Levinforce': 'ライトニングフォース',
        'Lightning Bolt': '落雷',
        'Shock Blast': 'ショックブラスト',
        'Shock Strike': 'ショックストライク',
        'Shock(?! )': '放電',
        'Stepped Leader': 'ステップトリーダー',
        'Stormcloud Summons': '雷雲生成',
        'Stratospear Summons': '武具生成',
        'Thunderstorm': 'サンダーストーム',
        'Tribunal Summons': '思念体生成',
        'Volt Strike': 'ボルトストライク',
      },
      '~effectNames': {
        'Damage Down': 'ダメージ低下',
        'Electrified': '過剰帯電',
        'Hated of Levin': '雷神の呪い',
        'System Shock': '電気ショック',
      },
    },
  ],
}];
