// Sohm Al (normal)
// Nobody remembers what to do here, so here's triggers.
[{
  zoneRegex: /^Sohm Al$/,
  triggers: [
    {
      id: 'Sohm Al Myath Stack',
      regex: /1B:........:(\y{Name}):....:....:0017:0000:0000:0000:/,
      alertText: function(data, matches) {
        if (data.matches[1] == data.me)
          return 'Stack on YOU';
        return 'Stack on ' + matches[1];
      },
      tts: 'stack',
    },
    {
      id: 'Sohm Al Myath Spread',
      regex: /1B:........:(\y{Name}):....:....:00AE:0000:0000:0000:/,
      alertText: function(data, matches) {
        if (data.matches[1] == data.me)
          return 'Move away from others';
        return 'Move away from ' + matches[1];
      },
      tts: "don't stack",
    },
    {
      id: 'Sohm Al Myath Chyme',
      regex: /:Added new combatant Chyme Of The Mountain/,
      alertText: function(data) { return 'Kill Chyme Add'; },
      tts: 'kill chyme',
    },
    {
      id: 'Sohm Al Tioman Meteor',
      regex: /1B:........:(\y{Name}):....:....:0007:0000:0000:0000:/,
      alertText: function(data, matches) {
        if (data.matches[1] == data.me)
          return 'place meteor on edge';
      },
      tts: function(data, matches) {
        if (data.matches[1] == data.me)
          return 'meteor';
      },
    },
  ]
}]
