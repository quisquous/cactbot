// The Temple of the Fist
[{
  zoneRegex: /^The Temple Of The Fist$/,
  triggers: [
    {
      id: 'Temple Port And Star',
      regex: /:1FDC:Arbuda starts using Port And Star/,
      regexDe: /:1FDC:Arbuda starts using Links & Rechts/,
      alertText: {
        en: 'front/back are safe',
        de: 'Vorne und Hinten sicher',
      },
      tts: {
        en: 'go front or back',
        de: 'nach vorne oder hinten',
      },
    },
    {
      id: 'Temple Fore And Aft',
      regex: /:1FDB:Arbuda starts using Fore And Aft/,
      regexDe: /:1FDB:Arbuda starts using Vor & Zurück/,
      alertText: {
        en: 'sides are safe',
        de: 'Seiten sind sicher',
      },
      tts: {
        en: 'go sides',
        de: 'an die Seite',
      },
    },
    {
      id: 'Temple Killer Instinct',
      regex: /:1FDE:Arbuda starts using Killer Instinct/,
      regexDe: /:1FDE:Arbuda starts using Vorausahnung/,
      alertText: {
        en: 'watch for safe',
        de: 'Auf Sicherheit achten',
      },
      tts: {
        en: 'watch for safe',
        de: 'auf Sicherheit achten',
      },
    },
  ],
}]
