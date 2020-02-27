'use strict';

[{
  zoneRegex: {
    en: /^Eden's Verse: Fulmination$/,
    ko: /^희망의 낙원 에덴: 공명편 \(1\)$/,
  },
  timelineFile: 'e5n.txt',
  triggers: [
    {
      id: 'E5N Surge Protection Gain',
      regex: Regexes.gainsEffect({ effect: 'Surge Protection' }),
      condition: Conditions.targetIsYou(),
      run: function(data) {
        data.surgeProtection = true;
      },
    },
    {
      id: 'E5N Surge Protection Lose',
      regex: Regexes.losesEffect({ effect: 'Surge Protection' }),
      condition: Conditions.targetIsYou(),
      run: function(data) {
        data.surgeProtection = false;
      },
    },
    {
      id: 'E5N Stratospear Summons',
      regex: Regexes.ability({ id: '4B8D', source: 'Ramuh', capture: false }),
      regexDe: Regexes.ability({ id: '4B8D', source: 'Ramuh', capture: false }),
      regexFr: Regexes.ability({ id: '4B8D', source: 'Ramuh', capture: false }),
      regexJa: Regexes.ability({ id: '4B8D', source: 'ラムウ', capture: false }),
      regexKo: Regexes.ability({ id: '4B8D', source: '라무', capture: false }),
      delaySeconds: 5,
      infoText: {
        en: 'Look for small spear',
        fr: 'Allez sur la petite lance',
        ko: '작은 지팡이 확인',
      },
    },
    {
      id: 'E5N Tribunal Summons',
      regex: Regexes.startsUsing({ id: '4B91', source: 'Ramuh', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4B91', source: 'Ramuh', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4B91', source: 'Ramuh', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4B91', source: 'ラムウ', capture: false }),
      regexKo: Regexes.startsUsing({ id: '4B91', source: '라무', capture: false }),
      infoText: {
        en: 'Look for adds',
        fr: 'Cherchez les adds',
        ko: '쫄 위치 확인',
      },
    },
    {
      id: 'E5N Fury\'s Bolt',
      regex: Regexes.startsUsing({ id: '4B90', source: 'Ramuh', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4B90', source: 'Ramuh', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4B90', source: 'Ramuh', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4B90', source: 'ラムウ', capture: false }),
      regexKo: Regexes.startsUsing({ id: '4B90', source: '라무', capture: false }),
      infoText: {
        en: 'Fury\'s Bolt',
        fr: 'Boule de foudre',
        ko: '라무 강화',
      },
    },
    {
      id: 'E5N Judgment Volts',
      regex: Regexes.startsUsing({ id: ['4B98', '4B9A'], source: 'Ramuh', capture: false }),
      regexDe: Regexes.startsUsing({ id: ['4B98', '4B9A'], source: 'Ramuh', capture: false }),
      regexFr: Regexes.startsUsing({ id: ['4B98', '4B9A'], source: 'Ramuh', capture: false }),
      regexJa: Regexes.startsUsing({ id: ['4B98', '4B9A'], source: 'ラムウ', capture: false }),
      regexKo: Regexes.startsUsing({ id: ['4B98', '4B9A'], source: '라무', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'E5N Divine Judgment Volts',
      regex: Regexes.startsUsing({ id: '4B9A', source: 'Ramuh', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4B9A', source: 'Ramuh', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4B9A', source: 'Ramuh', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4B9A', source: 'ラムウ', capture: false }),
      regexKo: Regexes.startsUsing({ id: '4B9A', source: '라무', capture: false }),
      condition: function(data) {
        return !data.surgeProtection;
      },
      alertText: {
        en: 'Grab an orb',
        fr: 'Prenez un orbe',
        ko: '구슬 줍기',
      },
    },
    {
      id: 'E5N Stormcloud',
      regex: Regexes.headMarker({ id: '006E' }),
      condition: Conditions.targetIsYou(),
      alertText: {
        en: 'Drop cloud outside',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'stormcloud': 'Cumulonimbus-Wolke',
        'Ramuh': 'Ramuh',
        'Will Of Ixion': 'Will Of Ixion', // FIXME
      },
      'replaceText': {
        'Volt Strike': 'Voltschlag',
        'Tribunal Summons': 'Gedankenentstehung',
        'Thunderstorm': 'Gewitter',
        'Stratospear Summons': 'Stromgenerierung',
        'Stormcloud Summons': 'Elektrizitätsgenerierung',
        'Shock Strike': 'Schockschlag',
        'Shock(?! )': 'Entladung',
        'Lightning Bolt': 'Blitzschlag',
        'Judgment Volts': 'Gewitter des Urteils',
        'Judgment Jolt': 'Blitz des Urteils',
        'Impact': 'Impakt',
        'Gallop': 'Galopp',
        'Fury\'s Bolt': 'Wütender Blitz',
        'Deadly Discharge': 'Tödliche Entladung',
        'Crippling Blow': 'Verkrüppelnder Schlag',
        'Chaos Strike': 'Chaosschlag',
        'Centaur\'s Charge': 'Zentaurenansturm',
      },
      '~effectNames': {
        'Electrified': 'Stromleiter',
        'Damage Down': 'Schaden -',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'stormcloud': 'Cumulonimbus',
        'Ramuh': 'Ramuh',
        'Will Of Ixion': 'Réplique d\'Ixion',
      },
      'replaceText': {
        'Volt Strike': 'Frappe d\'éclair',
        'Tribunal Summons': 'Manifestations de l\'esprit',
        'Thunderstorm': 'Tempête de foudre',
        'Stratospear Summons': 'Conjuration de dards',
        'Stormcloud Summons': 'Nuage d\'orage',
        'Shock Strike': 'Frappe de choc',
        'Shock(?! )': 'Décharge électrostatique',
        'Lightning Bolt': 'Éclair de foudre',
        'Judgment Volts': 'Éclair de chaleur du jugement',
        'Judgment Jolt': 'Front orageux du jugement',
        'Impact': 'Impact',
        'Gallop': 'Galop',
        'Fury\'s Bolt': 'Boules de foudre',
        'Deadly Discharge': 'Décharge mortelle',
        'Crippling Blow': 'Coup handicapant',
        'Chaos Strike': 'Frappe chaotique',
        'Centaur\'s Charge': 'Charge centaure',
      },
      '~effectNames': {
        'Electrified': 'Électrocution irradiante',
        'Damage Down': 'Malus de dégâts',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'stormcloud': '積乱雲',
        'Ramuh': 'ラムウ',
        'Will Of Ixion': 'Will Of Ixion', // FIXME
      },
      'replaceText': {
        'Volt Strike': 'ボルトストライク',
        'Tribunal Summons': '思念体生成',
        'Thunderstorm': 'サンダーストーム',
        'Stratospear Summons': '武具生成',
        'Stormcloud Summons': '雷雲生成',
        'Shock Strike': 'ショックストライク',
        'Shock(?! )': '放電',
        'Lightning Bolt': '落雷',
        'Judgment Volts': '裁きの熱雷',
        'Judgment Jolt': '裁きの界雷',
        'Impact': '衝撃',
        'Gallop': 'ギャロップ',
        'Fury\'s Bolt': 'チャージボルト',
        'Deadly Discharge': 'デッドリーディスチャージ',
        'Crippling Blow': '痛打',
        'Chaos Strike': 'カオスストライク',
        'Centaur\'s Charge': 'セントールチャージ',
      },
      '~effectNames': {
        'Electrified': '過剰帯電',
        'Damage Down': 'ダメージ低下',
      },
    },
  ],
}];
