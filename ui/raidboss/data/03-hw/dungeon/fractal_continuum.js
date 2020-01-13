'use strict';

// Fractal Continuum
[{
  zoneRegex: /^The Fractal Continuum$/,
  timelineFile: 'fractal_continuum.txt',
  timelineTriggers: [
    {
      id: 'Fractal Atmospheric Displacement',
      regex: /Atmospheric Displacement/,
      beforeSeconds: 5,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'AoE',
      },
    },
    {
      id: 'Fractal Sanctification',
      regex: /Sanctification/,
      beforeSeconds: 5,
      infoText: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'Tank cleave on YOU',
          };
        }
        return {
          en: 'Avoid tank cleave',
        };
      },
    },
    {
      id: 'Fractal Unholy',
      regex: /Unholy/,
      beforeSeconds: 5,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'AoE',
      },
    },
  ],
  triggers: [
    {
      id: 'Fractal Rapid Sever',
      regex: Regexes.startsUsing({ id: 'F7A', source: 'Phantom Ray' }),
      regexDe: Regexes.startsUsing({ id: 'F7A', source: 'Phantomschimmer' }),
      regexFr: Regexes.startsUsing({ id: 'F7A', source: 'Rayon Fantomatique' }),
      regexJa: Regexes.startsUsing({ id: 'F7A', source: 'ファントムレイ' }),
      regexCn: Regexes.startsUsing({ id: 'F7A', source: '幻影光' }),
      regexKo: Regexes.startsUsing({ id: 'F7A', source: '환영 광선' }),
      infoText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Tank buster on YOU',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.shortName(matches.target),
          };
        }
      },
    },
    {
      id: 'Fractal Slash',
      regex: Regexes.startsUsing({ id: 'F83', source: 'Minotaur', capture: false }),
      regexDe: Regexes.startsUsing({ id: 'F83', source: 'Minotaurus', capture: false }),
      regexFr: Regexes.startsUsing({ id: 'F83', source: 'Minotaure', capture: false }),
      regexJa: Regexes.startsUsing({ id: 'F83', source: 'ミノタウロス', capture: false }),
      regexCn: Regexes.startsUsing({ id: 'F83', source: '弥诺陶洛斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: 'F83', source: '미노타우로스', capture: false }),
      infoText: {
        en: 'Out of front',
      },
    },
    {
      id: 'Fractal Swipe',
      regex: Regexes.startsUsing({ id: 'F81', source: 'Minotaur', capture: false }),
      regexDe: Regexes.startsUsing({ id: 'F81', source: 'Minotaurus', capture: false }),
      regexFr: Regexes.startsUsing({ id: 'F81', source: 'Minotaure', capture: false }),
      regexJa: Regexes.startsUsing({ id: 'F81', source: 'ミノタウロス', capture: false }),
      regexCn: Regexes.startsUsing({ id: 'F81', source: '弥诺陶洛斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: 'F81', source: '미노타우로스', capture: false }),
      infoText: {
        en: 'Out of front',
      },
    },
    {
      id: 'Fractal Small Swing',
      regex: Regexes.startsUsing({ id: 'F82', source: 'Minotaur', capture: false }),
      regexDe: Regexes.startsUsing({ id: 'F82', source: 'Minotaurus', capture: false }),
      regexFr: Regexes.startsUsing({ id: 'F82', source: 'Minotaure', capture: false }),
      regexJa: Regexes.startsUsing({ id: 'F82', source: 'ミノタウロス', capture: false }),
      regexCn: Regexes.startsUsing({ id: 'F82', source: '弥诺陶洛斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: 'F82', source: '미노타우로스', capture: false }),
      infoText: {
        en: 'Get out',
      },
    },
    {
      id: 'Fractal Big Swing',
      regex: Regexes.startsUsing({ id: 'F87', source: 'Minotaur', capture: false }),
      regexDe: Regexes.startsUsing({ id: 'F87', source: 'Minotaurus', capture: false }),
      regexFr: Regexes.startsUsing({ id: 'F87', source: 'Minotaure', capture: false }),
      regexJa: Regexes.startsUsing({ id: 'F87', source: 'ミノタウロス', capture: false }),
      regexCn: Regexes.startsUsing({ id: 'F87', source: '弥诺陶洛斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: 'F87', source: '미노타우로스', capture: false }),
      alertText: {
        en: 'Use a cage',
      },
    },
    {
      id: 'Fractal Aetherochemical Bomb',
      regex: Regexes.gainsEffect({ effect: 'Aetherochemical Bomb', capture: false }),
      regexDe: Regexes.gainsEffect({ effect: 'Ätherochemischer Sprengkörper', capture: false }),
      regexFr: Regexes.gainsEffect({ effect: 'Magismobombe', capture: false }),
      regexJa: Regexes.gainsEffect({ effect: '魔爆弾', capture: false }),
      regexCn: Regexes.gainsEffect({ effect: '魔炸弹', capture: false }),
      regexKo: Regexes.gainsEffect({ effect: '마폭탄', capture: false }),
      condition: function(data) {
        return data.CanCleanse();
      },
      infoText: {
        en: 'Cleanse bomb',
      },
    },
    {
      id: 'Fractal Alarums',
      regex: Regexes.addedCombatant({ name: 'Clockwork Alarum', capture: false }),
      regexDe: Regexes.addedCombatant({ name: 'Uhrwerk-Alarm', capture: false }),
      regexFr: Regexes.addedCombatant({ name: 'Alarum Mécanique', capture: false }),
      regexJa: Regexes.addedCombatant({ name: 'アラガンワーク・アラーム', capture: false }),
      regexCn: Regexes.addedCombatant({ name: '发条报警虫', capture: false }),
      regexKo: Regexes.addedCombatant({ name: '알라그 태엽경보장치', capture: false }),
      suppressSeconds: 5,
      infoText: {
        en: 'Kill adds',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Phantom Ray': 'Phantomschimmer',
        'Minotaur': 'Minotaurus',
        'The Curator': 'Kurator',

        'Exhibit level III will be sealed off': 'Ausstellungssektor III schließt',
        'The high-level incubation bay will be sealed off': 'Inkubationskammer schließt',
        'The reality augmentation bay will be sealed off': 'Dilatationskammer schließt',
      },
      'replaceText': {
        'Rapid Sever': 'Radikale Abtrennung',
        'Atmospheric Displacement': 'Schnitttest',
        'Double Sever': 'Zweifachabtrennung',
        'Damage Up': 'Schaden +',
        'Atmospheric Compression': 'Schnittdruck',

        '11-Tonze Swipe': '11-Tonzen-Hieb',
        '111-Tonze Swing': '111-Tonzen-Schwung',
        'Disorienting Groan': 'Kampfgebrüll',
        'Zoom': 'Heranholen',
        '10-Tonze Slash': '11-Tonzen-Schlag', // FIXME: Check XIVAPI's correctness on this one
        '1111-Tonze Swing': '1111-Tonzen-Schwung',
        'Feast': 'Festmahl',

        'Sanctification': 'Sanktifikation',
        'Unholy': 'Unheilig',
        'Aetherochemical Explosive': 'Ätherochemisches Explosivum',
        'The Educator': 'Zuchtmeister',
        'Aetherochemical Mine': 'Ätherochemische Mine',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Phantom Ray': 'Rayon Fantomatique',
        'Minotaur': 'Minotaure',
        'The Curator': 'Conservateur',

        // FIXME
        'Exhibit level III will be sealed off': 'Exhibit level III will be sealed off',
        'The high-level incubation bay will be sealed off': 'The high-level incubation bay will be sealed off',
        'The reality augmentation bay will be sealed off': 'The reality augmentation bay will be sealed off',
      },
      'replaceText': {
        'Rapid Sever': 'Tranchage rapide',
        'Atmospheric Displacement': 'Moulinet infernal',
        'Double Sever': 'Double tranchage',
        'Damage Up': 'Bonus de dégâts physiques',
        'Atmospheric Compression': 'Écrasement',

        '11-Tonze Swipe': 'Fauche de 11 tonz',
        '111-Tonze Swing': 'Swing de 111 tonz',
        'Disorienting Groan': 'Cri désorientant',
        'Zoom': 'Charge',
        '10-Tonze Slash': 'Taillade de 10 tonz',
        '1111-Tonze Swing': 'Swing de 1111 tonz',
        'Feast': 'Festin',

        'Sanctification': 'Sanctification',
        'Unholy': 'Sombre miracle',
        'Aetherochemical Explosive': 'Bombe magismologique',
        'The Educator': 'Disciplinaire',
        'Aetherochemical Mine': 'Mine magismologique',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Phantom Ray': 'ファントムレイ',
        'Minotaur': 'ミノタウロス',
        'The Curator': 'キュレーター',

        // FIXME
        'Exhibit level III will be sealed off': 'Exhibit level III will be sealed off',
        'The high-level incubation bay will be sealed off': 'The high-level incubation bay will be sealed off',
        'The reality augmentation bay will be sealed off': 'The reality augmentation bay will be sealed off',
      },
      'replaceText': {
        'Rapid Sever': '滅多斬り',
        'Atmospheric Displacement': '剣風',
        'Double Sever': '多重斬り',
        'Damage Up': 'ダメージ上昇',
        'Atmospheric Compression': '剣圧',

        '11-Tonze Swipe': '11トンズ・スワイプ',
        '111-Tonze Swing': '111トンズ・スイング',
        'Disorienting Groan': '雄叫び',
        'Zoom': 'ズームイン',
        '10-Tonze Slash': '10トンズ・スラッシュ',
        '1111-Tonze Swing': '1111トンズ・スイング',
        'Feast': 'フィースト',

        'Sanctification': '聖別の光',
        'Unholy': 'アンホーリー',
        'Aetherochemical Explosive': '魔科学爆弾',
        'The Educator': 'エデュケーター',
        'Aetherochemical Mine': '魔科学地雷',
      },
    },
  ],
}];
