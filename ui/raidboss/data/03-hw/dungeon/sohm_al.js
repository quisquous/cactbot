'use strict';

// Sohm Al (normal)
// Nobody remembers what to do here, so here's triggers.
[{
  zoneRegex: /^Sohm Al$/,
  triggers: [
    {
      id: 'Sohm Al Myath Stack',
      regex: Regexes.headMarker({ id: '0017' }),
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Stack on YOU',
            de: 'Stack auf DIR',
            fr: 'Stack sur VOUS',
          };
        }
        return {
          en: 'Stack on ' + matches.target,
          de: 'Stack auf ' + matches.target,
          fr: 'Stack sur ' + matches.target,
        };
      },
      tts: {
        en: 'stack',
        de: 'stek',
        fr: 'stack',
      },
    },
    {
      id: 'Sohm Al Myath Spread',
      regex: Regexes.headMarker({ id: '00AE' }),
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Move away from others',
            de: 'Weg von den anderen',
            fr: 'Eloignez-vous des autres',
          };
        }
        return {
          en: 'Move away from ' + matches.target,
          de: 'Weg von ' + matches.target,
          fr: 'Eloignez-vous de ' + matches.target,
        };
      },
      tts: {
        en: 'don\'t stack',
        de: 'nicht stek en',
        fr: 'ne restez pas packé',
      },
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
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'place meteor on edge',
            de: 'Meteor an Kante ablegen',
            fr: 'Météore à placer sur le côté',
          };
        }
      },
      tts: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'meteor',
            de: 'meteor',
            fr: 'météore',
          };
        }
      },
    },
  ],
}];
