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
        fr: 'Dégâts de zone',
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
            fr: 'Tank cleave sur VOUS',
          };
        }
        return {
          en: 'Avoid tank cleave',
          fr: 'Evitez le cleave sur le tank',
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
        fr: 'Dégâts de zone',
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
            fr: 'Tankbuster sur VOUS',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.shortName(matches.target),
            fr: 'Tankbuster sur ' + data.shortName(matches.target),
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
        fr: 'Ne restez pas devant',
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
        fr: 'Ne restez pas devant',
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
        fr: 'Ecartez vous du CaC',
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
        fr: 'Utilisez une cage',
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
        fr: 'Guérissez la bombe',
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
        fr: 'Tuez les adds',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Exhibit level III': 'Ausstellungssektor III',
        'Minotaur': 'Minotaurus',
        'Phantom Ray': 'Phantomschimmer',
        'Repository Node': 'Verwahrungsknoten',
        'The Curator': 'Kurator',
        'The high-level incubation bay': 'Inkubationskammer',
        'The reality augmentation bay': 'Dilatationskammer',
      },
      'replaceText': {
        '--reset--': '--reset--', // FIXME
        '10-Tonze Slash': '11-Tonzen-Schlag',
        '11-Tonze Swipe': '11-Tonzen-Hieb',
        '(?<!1)111-Tonze Swing': '111-Tonzen-Schwung',
        '1111-Tonze Swing': '1111-Tonzen-Schwung',
        'Aetherochemical Explosive': 'Ätherochemisches Explosivum',
        'Aetherochemical Mine': 'Ätherochemische Mine',
        'Atmospheric Compression': 'Schnittdruck',
        'Atmospheric Displacement': 'Schnitttest',
        'Damage Up': 'ダメージ上昇',
        'Disorienting Groan': 'Kampfgebrüll',
        'Double Sever': 'Zweifachabtrennung',
        'Feast': 'Festmahl',
        'Rapid Sever': 'Radikale Abtrennung',
        'Sanctification': 'Sanktifikation',
        'The Educator': 'Zuchtmeister',
        'Unholy': 'Unheilig',
        'Zoom': 'Heranholen',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Exhibit level III': 'secteur d\'exposition III',
        'Minotaur': 'minotaure',
        'Phantom Ray': 'rayon fantomatique',
        'Repository Node': 'sphère de dépôt',
        'The Curator': 'Conservateur',
        'The high-level incubation bay': 'la chambre d\'incubation chimérique',
        'The reality augmentation bay': 'la salle de distorsion de la réalité',
      },
      'replaceText': {
        '--reset--': '-- Reset --',
        '10-Tonze Slash': 'Taillade de 10 tonz',
        '11-Tonze Swipe': 'Fauche de 11 tonz',
        '(?<!1)111-Tonze Swing': 'Swing de 111 tonz',
        '1111-Tonze Swing': 'Swing de 1111 tonz',
        'Aetherochemical Explosive': 'Bombe magismologique',
        'Aetherochemical Mine': 'Mine magismologique',
        'Atmospheric Compression': 'Écrasement',
        'Atmospheric Displacement': 'Moulinet infernal',
        'Damage Up': 'ダメージ上昇',
        'Disorienting Groan': 'Cri désorientant',
        'Double Sever': 'Double tranchage',
        'Feast': 'Festin',
        'Rapid Sever': 'Tranchage rapide',
        'Sanctification': 'Sanctification',
        'The Educator': 'Disciplinaire',
        'Unholy': 'Sombre miracle',
        'Zoom': 'Charge',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Minotaur': 'ミノタウロス',
        'Phantom Ray': 'ファントムレイ',
        'Repository Node': '収蔵システム',
        'The Curator': 'キュレーター',
      },
      'replaceText': {
        '--reset--': '--reset--', // FIXME
        '10-Tonze Slash': '10トンズ・スラッシュ',
        '11-Tonze Swipe': '11トンズ・スワイプ',
        '(?<!1)111-Tonze Swing': '111トンズ・スイング',
        '1111-Tonze Swing': '1111トンズ・スイング',
        'Aetherochemical Explosive': '魔科学爆弾',
        'Aetherochemical Mine': '魔科学地雷',
        'Atmospheric Compression': '剣圧',
        'Atmospheric Displacement': '剣風',
        'Damage Up': 'ダメージ上昇',
        'Disorienting Groan': '雄叫び',
        'Double Sever': '多重斬り',
        'Feast': 'フィースト',
        'Rapid Sever': '滅多斬り',
        'Sanctification': '聖別の光',
        'The Educator': 'エデュケーター',
        'Unholy': 'アンホーリー',
        'Zoom': 'ズームイン',
      },
    },
    {
      'locale': 'cn',
      'missingTranslations': true,
      'replaceSync': {
        'Minotaur': '弥诺陶洛斯',
        'Phantom Ray': '幻影光',
        'Repository Node': '收藏系统',
        'The Curator': '博物总管',
      },
      'replaceText': {
        '--reset--': '--reset--', // FIXME
        '10-Tonze Slash': '十吨挥打',
        '11-Tonze Swipe': '十一吨横扫',
        '(?<!1)111-Tonze Swing': '百十一吨回转',
        '1111-Tonze Swing': '千百十一吨回转',
        'Aetherochemical Explosive': '魔科学炸弹',
        'Aetherochemical Mine': '魔科学地雷',
        'Atmospheric Compression': '剑压',
        'Atmospheric Displacement': '剑风',
        'Damage Up': 'ダメージ上昇',
        'Disorienting Groan': '吼叫',
        'Double Sever': '多重斩击',
        'Feast': '飨宴',
        'Rapid Sever': '急促斩击',
        'Sanctification': '祝圣之光',
        'The Educator': '管教',
        'Unholy': '邪圣',
        'Zoom': '放大',
      },
    },
    {
      'locale': 'ko',
      'missingTranslations': true,
      'replaceSync': {
        'Minotaur': '미노타우로스',
        'Phantom Ray': '환영 광선',
        'Repository Node': '소장 시스템',
        'The Curator': '전시 책임자',
      },
      'replaceText': {
        '--reset--': '--reset--', // FIXME
        '10-Tonze Slash': '10톤즈 베기',
        '11-Tonze Swipe': '11톤즈 후려치기',
        '(?<!1)111-Tonze Swing': '111톤즈 휘두르기',
        '1111-Tonze Swing': '1111톤즈 휘두르기',
        'Aetherochemical Explosive': '마과학 폭탄',
        'Aetherochemical Mine': '마과학 지뢰',
        'Atmospheric Compression': '검압',
        'Atmospheric Displacement': '칼바람',
        'Damage Up': 'ダメージ上昇',
        'Disorienting Groan': '우렁찬 외침',
        'Double Sever': '다중 베기',
        'Feast': '사육제',
        'Rapid Sever': '마구 베기',
        'Sanctification': '축성의 빛',
        'The Educator': '교육자',
        'Unholy': '부정함',
        'Zoom': '확대',
      },
    },
  ],
}];
