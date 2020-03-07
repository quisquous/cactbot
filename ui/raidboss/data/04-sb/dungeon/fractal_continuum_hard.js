'use strict';

// Fractal Continuum (Hard)
[{
  zoneRegex: {
    en: /^The Fractal Continuum \(Hard\)$/,
    cn: /^疯狂战舰无限回廊$/,
  },
  triggers: [
    {
      id: 'Fractal Swipe Servo',
      regex: Regexes.startsUsing({ id: '2AE5', source: 'Servomechanical Minotaur', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2AE5', source: 'Servomechanisch(?:e|er|es|en) Minotaurus', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2AE5', source: 'Minotaure Servomécanique', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2AE5', source: 'サーヴォ・ミノタウロス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2AE5', source: '自控化弥诺陶洛斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2AE5', source: '자동제어 미노타우로스', capture: false }),
      infoText: {
        en: 'swipe',
        de: 'Hieb',
        fr: 'Fauche',
      },
    },
    {
      id: 'Fractal Swipe Bio',
      regex: Regexes.startsUsing({ id: '29A2', source: 'Biomanufactured Minotaur', capture: false }),
      regexDe: Regexes.startsUsing({ id: '29A2', source: 'Biotech-Minotaurus', capture: false }),
      regexFr: Regexes.startsUsing({ id: '29A2', source: 'Minotaure Biologique', capture: false }),
      regexJa: Regexes.startsUsing({ id: '29A2', source: 'バイオ・ミノタウロス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '29A2', source: '生化弥诺陶洛斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '29A2', source: '양산체 미노타우로스', capture: false }),
      infoText: {
        en: 'swipe',
        de: 'Hieb',
        fr: 'Fauche',
      },
    },
    {
      id: 'Fractal Swing Servo',
      regex: Regexes.startsUsing({ id: '2AE4', source: 'Servomechanical Minotaur', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2AE4', source: 'Servomechanisch(?:e|er|es|en) Minotaurus', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2AE4', source: 'Minotaure Servomécanique', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2AE4', source: 'サーヴォ・ミノタウロス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2AE4', source: '自控化弥诺陶洛斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2AE4', source: '자동제어 미노타우로스', capture: false }),
      alertText: {
        en: 'Swing',
        de: 'Schwung',
        fr: 'Swing',
      },
    },
    {
      id: 'Fractal Swing Bio',
      regex: Regexes.startsUsing({ id: '29A1', source: 'Biomanufactured Minotaur', capture: false }),
      regexDe: Regexes.startsUsing({ id: '29A1', source: 'Biotech-Minotaurus', capture: false }),
      regexFr: Regexes.startsUsing({ id: '29A1', source: 'Minotaure Biologique', capture: false }),
      regexJa: Regexes.startsUsing({ id: '29A1', source: 'バイオ・ミノタウロス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '29A1', source: '生化弥诺陶洛斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '29A1', source: '양산체 미노타우로스', capture: false }),
      alertText: {
        en: 'Swing',
        de: 'Schwung',
        fr: 'Swing',
      },
    },
    {
      id: 'Fractal Dragon Voice',
      regex: Regexes.startsUsing({ id: '861', source: 'Servomechanical Chimera', capture: false }),
      regexDe: Regexes.startsUsing({ id: '861', source: 'Servomechanisch(?:e|er|es|en) Chimära', capture: false }),
      regexFr: Regexes.startsUsing({ id: '861', source: 'Chimère Servomécanique', capture: false }),
      regexJa: Regexes.startsUsing({ id: '861', source: 'サーヴォ・キマイラ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '861', source: '自控化奇美拉', capture: false }),
      regexKo: Regexes.startsUsing({ id: '861', source: '자동제어 키마이라', capture: false }),
      alertText: {
        en: 'Dragon\'s Voice',
        de: 'Stimme Des Drachen',
        fr: 'Voix Du Dragon',
      },
      tts: {
        en: 'dragon',
        de: 'drache',
        fr: 'dragon',
      },
    },
    {
      id: 'Fractal Ram Voice',
      regex: Regexes.startsUsing({ id: '860', source: 'Servomechanical Chimera', capture: false }),
      regexDe: Regexes.startsUsing({ id: '860', source: 'Servomechanisch(?:e|er|es|en) Chimära', capture: false }),
      regexFr: Regexes.startsUsing({ id: '860', source: 'Chimère Servomécanique', capture: false }),
      regexJa: Regexes.startsUsing({ id: '860', source: 'サーヴォ・キマイラ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '860', source: '自控化奇美拉', capture: false }),
      regexKo: Regexes.startsUsing({ id: '860', source: '자동제어 키마이라', capture: false }),
      alertText: {
        en: 'Ram\'s Voice',
        de: 'Stimme Des Widders',
        fr: 'Voix Du Bélier',
      },
      tts: {
        en: 'ram',
        de: 'widder',
        fr: 'bélier',
      },
    },
    {
      id: 'Fractal Death Spin',
      regex: Regexes.startsUsing({ id: '27AE', source: 'The Ultima Beast', capture: false }),
      regexDe: Regexes.startsUsing({ id: '27AE', source: 'Ultimativ(?:e|er|es|en) Bestie', capture: false }),
      regexFr: Regexes.startsUsing({ id: '27AE', source: 'Ultima-Monstre', capture: false }),
      regexJa: Regexes.startsUsing({ id: '27AE', source: 'アルテマビースト', capture: false }),
      regexCn: Regexes.startsUsing({ id: '27AE', source: '究极神兽', capture: false }),
      regexKo: Regexes.startsUsing({ id: '27AE', source: '알테마 비스트', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'Fractal Aether Bend',
      regex: Regexes.startsUsing({ id: ['27AF', '27B0'], source: 'The Ultima Beast', capture: false }),
      regexDe: Regexes.startsUsing({ id: ['27AF', '27B0'], source: 'Ultimativ(?:e|er|es|en) Bestie', capture: false }),
      regexFr: Regexes.startsUsing({ id: ['27AF', '27B0'], source: 'Ultima-Monstre', capture: false }),
      regexJa: Regexes.startsUsing({ id: ['27AF', '27B0'], source: 'アルテマビースト', capture: false }),
      regexCn: Regexes.startsUsing({ id: ['27AF', '27B0'], source: '究极神兽', capture: false }),
      regexKo: Regexes.startsUsing({ id: ['27AF', '27B0'], source: '알테마 비스트', capture: false }),
      response: Responses.getIn(),
    },
  ],
}];
