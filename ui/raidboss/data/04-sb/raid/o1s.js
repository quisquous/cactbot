'use strict';

// O1S - Deltascape 1.0 Savage
[{
  zoneRegex: /(Deltascape V1.0 \(Savage\)|Unknown Zone \(2B7\))/,
  timelineFile: 'o1s.txt',
  triggers: [
    {
      id: 'O1S Blaze',
      regex: /:1EDD:Alte Roite starts using/,
      infoText: {
        en: 'Blaze: Stack up',
        de: 'Flamme: Stacken',
      },
      tts: {
        en: 'stack',
        de: 'stek',
      },
    },
    {
      id: 'O1S Breath Wing',
      regex: /:1ED6:Alte Roite starts using/,
      infoText: {
        en: 'Breath Wing: Be beside boss',
        de: 'Atemschwinge: Neben Boss gehen',
      },
      tts: {
        en: 'breath wing',
        de: 'atemschwinge',
      },
    },
    {
      id: 'O1S Clamp',
      regex: /:1EDE:Alte Roite starts using/,
      infoText: {
        en: 'Clamp: Get out of front',
        de: 'Klammer: Vorm Boss weg',
      },
      tts: {
        en: 'clamp',
        de: 'klammer',
      },
    },
    {
      id: 'O1S Downburst',
      regex: /:1ED8:Alte Roite starts using/,
      infoText: {
        en: 'Downburst: Knockback',
        de: 'Fallböe: Rückstoß',
      },
      tts: {
        en: 'knockback',
        de: 'rückstoß',
      },
    },
    {
      id: 'O1S Roar',
      regex: /:1ED4:Alte Roite starts using/,
      infoText: {
        en: 'Roar: AOE damage',
        de: 'Brüllen: Flächenschaden',
      },
      condition: function(data) {
        return data.role == 'healer';
      },
      tts: {
        en: 'roar',
        de: 'brüllen',
      },
    },
    {
      id: 'O1S Charybdis',
      regex: /:1ED3:Alte Roite starts using/,
      infoText: {
        en: 'Charybdis: AOE damage',
        de: 'Charybdis: Flächenschaden',
      },
      condition: function(data) {
        return data.role == 'healer';
      },
      tts: {
        en: 'roar',
        de: 'brüllen',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Black Hole': 'Schwarz[a] Loch',
        'Engage!': 'Start!',
        'Exdeath': 'Exdeath',
      },
      'replaceText': {
        '--targetable--': '--anvisierbar--',
        '--untargetable--': '--nich anvisierbar--',
        'Black Hole': 'Schwarzes Loch',
        'Black Spark': 'Schwarzer Funke',
        'Blizzard III': 'Eisga',
        'Clearout': 'Kreisfeger',
        'Collision': 'Aufprall',
        'Doom': 'Verhängnis',
        'Enrage': 'Finalangriff',
        'Fire III': 'Feuga',
        'Flare': 'Flare',
        'Holy': 'Sanctus',
        'Meteor': 'Meteor',
        'The Decisive Battle': 'Entscheidungsschlacht',
        'Thunder III': 'Blitzga',
        'Unknown Ability': 'Unknown Ability',
        'Vacuum Wave': 'Vakuumwelle',
        'Zombie Breath': 'Zombie-Atem',
      },
      '~effectNames': {
        'Bleeding': 'Blutung',
        'Deep Freeze': 'Tiefkühlung',
        'Doom': 'Verhängnis',
        'Lightning Resistance Down': 'Blitzresistenz -',
        'Paralysis': 'Paralyse',
        'Pyretic': 'Pyretisch',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Black Hole': 'Trou Noir',
        'Engage!': 'À l\'attaque',
        'Exdeath': 'Exdeath',
      },
      'replaceText': {
        '--Reset--': '--Réinitialisation--',
        '--sync--': '--Synchronisation--',
        '--targetable--': '--Ciblable--',
        '--untargetable--': '--Impossible à cibler--',
        'Black Hole': 'Trou Noir',
        'Black Spark': 'Étincelle Noire',
        'Blizzard III': 'Méga Glace',
        'Clearout': 'Fauchage',
        'Collision': 'Impact',
        'Doom': 'Glas',
        'Enrage': 'Enrage',
        'Fire III': 'Méga Feu',
        'Flare': 'Brasier',
        'Holy': 'Miracle',
        'Meteor': 'Météore',
        'The Decisive Battle': 'Combat Décisif',
        'Thunder III': 'Méga Foudre',
        'Unknown Ability': 'Unknown Ability',
        'Vacuum Wave': 'Vacuum',
        'Zombie Breath': 'Haleine Zombie',
      },
      '~effectNames': {
        'Bleeding': 'Saignant',
        'Deep Freeze': 'Congélation',
        'Doom': 'Glas',
        'Lightning Resistance Down': 'Résistance à La Foudre Réduite',
        'Paralysis': 'Paralysie',
        'Pyretic': 'Chaleur',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Black Hole': 'ブラックホール',
        'Engage!': '戦闘開始！',
        'Exdeath': 'エクスデス',
      },
      'replaceText': {
        'Black Hole': 'ブラックホール',
        'Black Spark': 'ブラックスパーク',
        'Blizzard III': 'ブリザガ',
        'Clearout': 'なぎ払い',
        'Collision': '衝撃',
        'Doom': '死の宣告',
        'Fire III': 'ファイガ',
        'Flare': 'フレア',
        'Holy': 'ホーリー',
        'Meteor': 'メテオ',
        'The Decisive Battle': '決戦',
        'Thunder III': 'サンダガ',
        'Unknown Ability': 'Unknown Ability',
        'Vacuum Wave': '真空波',
        'Zombie Breath': 'ゾンビブレス',
      },
      '~effectNames': {
        'Bleeding': 'ペイン',
        'Deep Freeze': '氷結',
        'Doom': '死の宣告',
        'Lightning Resistance Down': '雷属性耐性低下',
        'Paralysis': '麻痺',
        'Pyretic': 'ヒート',
      },
    },
  ],
}];
