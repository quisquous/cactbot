'use strict';

// Sohm Al (normal)
// Nobody remembers what to do here, so here's triggers.
[{
  zoneRegex: {
    en: /^Sohm Al$/,
    cn: /^天山绝顶索姆阿尔灵峰$/,
  },
  triggers: [
    {
      id: 'Sohm Al Myath Stack',
      regex: Regexes.headMarker({ id: '0017' }),
      response: Responses.stackOn(),
    },
    {
      id: 'Sohm Al Myath Spread',
      regex: Regexes.headMarker({ id: '00AE' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Sohm Al Myath Chyme',
      regex: Regexes.addedCombatant({ name: 'Chyme Of The Mountain', capture: false }),
      regexDe: Regexes.addedCombatant({ name: 'Gebirgsbrei', capture: false }),
      regexFr: Regexes.addedCombatant({ name: 'Chyme Des Montagnes', capture: false }),
      regexJa: Regexes.addedCombatant({ name: 'キームス・マウンテン', capture: false }),
      regexCn: Regexes.addedCombatant({ name: '圣山之糜', capture: false }),
      regexKo: Regexes.addedCombatant({ name: '산의 유미즙', capture: false }),
      alertText: {
        en: 'Kill Chyme Add',
        de: 'Brei Add töten',
        fr: 'Tuez l\'add',
      },
      tts: {
        en: 'kill chyme',
        de: 'brei töten',
        fr: 'tuez lad',
      },
    },
    {
      id: 'Sohm Al Tioman Meteor',
      regex: Regexes.headMarker({ id: '0007' }),
      condition: Conditions.targetIsYou(),
      response: Responses.meteorOnYou(),
    },
  ],
}];
