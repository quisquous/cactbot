'use strict';

// The Temple of the Fist
[{
  zoneRegex: /^The Temple Of The Fist$/,
  triggers: [
    {
      id: 'Temple Port And Star',
      regex: / 14:1FDC:Arbuda starts using Port And Star/,
      regexDe: / 14:1FDC:Arbuda starts using Links & Rechts/,
      regexFr: / 14:1FDC:Arbuda starts using Gauche Et Droite/,
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
      regex: / 14:1FDB:Arbuda starts using Fore And Aft/,
      regexDe: / 14:1FDB:Arbuda starts using Vor & Zurück/,
      regexFr: / 14:1FDB:Arbuda starts using Devant Et Derrière/,
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
      regex: / 14:1FDE:Arbuda starts using Killer Instinct/,
      regexDe: / 14:1FDE:Arbuda starts using Vorausahnung/,
      regexFr: / 14:1FDE:Arbuda starts using Instinct Meurtrier/,
      alertText: {
        en: 'watch for safe',
        de: 'nach Sicherheit schauen',
        fr: 'trouvez une zone safe',
      },
    },
  ],
}];
