// Sohm Al (normal)
// Nobody remembers what to do here, so here's triggers.
[{
  zoneRegex: /^Sohm Al$/,
  triggers: [
    {
      id: 'Sohm Al Myath Stack',
      regex: /1B:........:(\y{Name}):....:....:0017:0000:0000:0000:/,
      alertText: function(data, matches) {
        if (data.matches[1] == data.me) {
          return {
            en: 'Stack on YOU',
            de: 'Stack auf DIR',
          };
        }
        return {
          en: 'Stack on ' + matches[1],
          de: 'Stack auf ' + matches[1],
        };
      },
      tts: {
        en: 'stack',
        de: 'stek',
      },
    },
    {
      id: 'Sohm Al Myath Spread',
      regex: /1B:........:(\y{Name}):....:....:00AE:0000:0000:0000:/,
      alertText: function(data, matches) {
        if (data.matches[1] == data.me) {
          return {
            en: 'Move away from others',
            de: 'Weg von den anderen',
          };
        }
        return {
          en: 'Move away from ' + matches[1],
          de: 'Weg von ' + matches[1],
        };
      },
      tts: {
        en: "don't stack",
        de: 'nicht stek en',
      },
    },
    {
      id: 'Sohm Al Myath Chyme',
      regex: /:Added new combatant Chyme Of The Mountain/,
      regexDe: /:Added new combatant Gebirgsbrei/,
      alertText: function(data) {
        return {
          en: 'Kill Chyme Add',
          de: 'Brei Add töten',
        };
      },
      tts: {
        en: 'kill chyme',
        de: 'brei töten',
      },
    },
    {
      id: 'Sohm Al Tioman Meteor',
      regex: /1B:........:(\y{Name}):....:....:0007:0000:0000:0000:/,
      alertText: function(data, matches) {
        if (data.matches[1] == data.me) {
          return {
            en: 'place meteor on edge',
            de: 'Meteor an Kante ablegen',
          };
        }
      },
      tts: function(data, matches) {
        if (data.matches[1] == data.me) {
          return {
            en: 'meteor',
            de: 'meteor',
         };
        }
      },
    },
  ]
}]
