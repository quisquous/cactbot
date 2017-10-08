// The Temple of the Fist
[{
  zoneRegex: /^The Temple Of The Fist$/,
  triggers: [
    {
      id: 'Temple Port And Star',
      regex: /:1FDC:Arbuda starts using Port And Star/,
      alertText: 'front/back are safe',
    },
    {
      id: 'Temple Fore And Aft',
      regex: /:1FDB:Arbuda starts using Fore And Aft/,
      alertText: 'sides are safe',
    },
    {
      id: 'Temple Killer Instinct',
      regex: /:1FDE:Arbuda starts using Killer Instinct/,
      alertText: 'watch for safe',
    },
  ],
}]
