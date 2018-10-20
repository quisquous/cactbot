'use strict';

// Fractal Continuum (Hard)
[{
  zoneRegex: /^The Fractal Continuum \(Hard\)$/,
  triggers: [
    {
      id: 'Fractal Swipe',
      regex: /(?:14:2AE5:Servomechanical Minotaur starts using 16-Tonze Swipe|14:29A2:Biomanufactured Minotaur starts using 11-Tonze Swipe)/,
      regexDe: /(?:14:2AE5:Servomechanischer Minotaurus starts using 16-Tonzen-Hieb|14:29A2:Biotech-Minotaurus starts using 11-Tonzen-Hieb)/,
      regexFr: /(?:14:2AE5:Minotaure Servomécanique starts using Fauche De 16 Tonz|14:29A2:Minotaure Biologique starts using Fauche De 11 Tonz)/,
      infoText: {
        en: 'swipe',
        de: 'Hieb',
        fr: 'Fauche',
      },
    },
    {
      id: 'Fractal Swing',
      regex: /(?:14:2AE4:Servomechanical Minotaur starts using 128-Tonze Swing|14:29A1:Biomanufactured Minotaur starts using 111-Tonze Swing)/,
      regexDe: /(?:14:2AE4:Servomechanischer Minotaurus starts using 128-Tonzen-Schwung|14:29A1:Biotech-Minotaurus starts using 111-Tonzen-Schwung)/,
      regexFr: /(?:14:2AE4:Minotaure Servomécanique starts using Swing De 128 Tonz|14:29A1:Minotaure Biologique starts using Swing De 111 Tonz)/,
      alertText: {
        en: 'Swing',
        de: 'Schwung',
        fr: 'Swing',
      },
    },
    {
      id: 'Fractal Dragon Voice',
      regex: /starts using The Dragon's Voice/,
      regexDe: /starts using Stimme Des Drachen/,
      regexFr: /starts using Voix Du Dragon/,
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
      regex: /starts using The Ram's Voice/,
      regexDe: /starts using Stimme Des Widders/,
      regexFr: /starts using Voix Du Bélier/,
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
      regex: /14:27AE:The Ultima Beast starts using Death Spin/,
      regexDe: /14:27AE:Ultimative Bestie starts using Strudel Des Todes/,
      regexFr: /14:27AE:Ultima-monstre starts using Tourbillon Mortel/,
      infoText: {
        en: 'Knockback',
        de: 'Rückstoß',
        fr: 'Projection',
      },
    },
    {
      id: 'Fractal Aether Bend',
      regex: /14:27(?:A3|AF|B0):The Ultima Beast starts using Aether Bend/,
      regexDe: /14:27(?:A3|AF|B0):Ultimative Bestie starts using Ätherbeugung/,
      regexFr: /14:27(?:A3|AF|B0):Ultima-monstre starts using Diffraction éthérée/,
      alertText: {
        en: 'Get In',
        de: 'Reingehen',
        fr: 'Sur le boss',
      },
      tts: {
        en: 'in in in',
        de: 'rein rein rein',
        fr: 'sur le boss',
      },
    },
  ],
}];
