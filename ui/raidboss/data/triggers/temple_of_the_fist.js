// The Temple of the Fist
[{
  zoneRegex: /^The Temple Of The Fist$/,
  triggers: [
    {
      id: 'Temple Port And Star',
      regex: /:1FDC:Arbuda starts using Port And Star/,
      regexDe: /:1FDC:Arbuda starts using Links & Rechts/,
      alertText: 'front/back are safe',
      tts: 'go front or back',
    },
    {
      id: 'Temple Fore And Aft',
      regex: /:1FDB:Arbuda starts using Fore And Aft/,
      regexDe: /:1FDB:Arbuda starts using Vor & Zurück/,
      alertText: 'sides are safe',
      tts: 'go sides',
    },
    {
      id: 'Temple Killer Instinct',
      regex: /:1FDE:Arbuda starts using Killer Instinct/,
      regexDe: /:1FDE:Arbuda starts using Vorausahnung/,
      alertText: 'watch for safe',
      tts: 'watch for safe',
    },
  ],
}]
