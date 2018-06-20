'use strict';

// The Temple of the Fist
[{
  zoneRegex: /^The Temple Of The Fist$/,
  triggers: [
    {
      id: 'Temple Port And Star',
      regex: /:1FDC:Arbuda starts using Port And Star/,
      regexDe: /:1FDC:Arbuda starts using Links & Rechts/,
      regexFR: /:1FDC:Arbuda starts using Gauche Et Droite/,
      alertText: {
        en: 'front/back are safe',
        de: 'Vorne/Hinten sicher',
        fr: 'Allez devant ou derrière',
      },
      tts: {
        en: 'go front or back',
        de: 'nach vorn oder hinten',
        fr: 'allez devant ou derrière',
      },
    },
    {
      id: 'Temple Fore And Aft',
      regex: /:1FDB:Arbuda starts using Fore And Aft/,
      regexDe: /:1FDB:Arbuda starts using Vor & Zurück/,
      regexFr: /:1FDB:Arbuda starts using Devant Et Derrière/,
      alertText: {
        en: 'sides are safe',
        de: 'Seiten sind sicher',
        fr: 'Allez à gauche ou à droite',
      },
      tts: {
        en: 'go sides',
        de: 'zur Seite',
        fr: 'allez sur les côtés',
      },
    },
    {
      id: 'Temple Killer Instinct',
      regex: /:1FDE:Arbuda starts using Killer Instinct/,
      regexDe: /:1FDE:Arbuda starts using Vorausahnung/,
      regexFr: /:1FDE:Arbuda starts using Instinct Meurtrier/,
      alertText: {
        en: 'watch for safe',
        de: 'nach Sicherheit schauen',
        fr: 'trouvez une zone safe',
      },
    },
  ],
}];
