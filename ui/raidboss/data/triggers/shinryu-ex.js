// Shinryu Extreme
[{
  zoneRegex: /^The Minstrel's Ballad: Shinryu's Domain$/,
  triggers: [
    { id: 'ShinryuEx Akh Morn',
      regex: /:Shinryu starts using Akh Morn on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me)
          return 'Akh Morn on you';
        if (data.role == 'tank')
          return 'Akh Morn on ' + matches[1];
      },
      infoText: function(data, matches) {
        if (matches[1] == data.me || data.role == 'tank')
          return;
        return 'Akh Rhai: spread and move';
      },
    },
    { id: 'ShinryuEx Diamond Dust',
      regex: /:25DD:Shinryu starts using Diamond Dust/,
      infoText: function(data) { return 'Ice: Stack and Stop'; },
    },
    { id: 'ShinryuEx Dragonfist',
      regex: /:Shinryu starts using Dragonfist/,
      infoText: function(data) { return 'Out of middle'; },
    },
    { id: 'ShinryuEx Hellfire',
      regex: /:25DB:Shinryu starts using Hellfire/,
      durationSeconds: 7,
      alertText: function(data) { return 'Get in water'; },
    },
    { id: 'ShinryuEx Hypernova',
      regex: /:Right Wing starts using Hypernova/,
      durationSeconds: 7,
      alertText: function(data) { return 'Stack in water'; },
    },
    { id: 'ShinryuEx Judgement Bolt',
      regex: /:25DC:Shinryu starts using Judgment Bolt/,
      durationSeconds: 7,
      alertText: function(data) { return 'Stack, no water'; },
    },
    { id: 'ShinryuEx Levinbolt',
      regex: /:Right Wing starts using Levinbolt/,
      durationSeconds: 7,
      alertText: function(data) { return 'Spread out, no water'; },
    },
    { id: 'ShinryuEx Icicle',
      regex: /:Left Wing starts using Summon Icicle/,
      delaySeconds: 4,
      alarmText: function(data) { return 'look back at icicles'; },
    },
    { id: 'ShinryuEx Tidal Wave',
      regex: /:25DA:Shinryu starts using Tidal Wave/,
      delaySeconds: 3,
      durationSeconds: 5,
      infoText: function(data) { return 'Knockback: look for water'; },
    },
    { id: 'ShinryuEx Tail Slap',
      regex: /:Tail starts using Tail Slap/,
      delaySeconds: 2,
      infoText: function(data) { return 'Tail: Switch targets'; },
    },
    { id: 'ShinryuEx Heart',
      regex: /:Added new combatant The Worm's Heart/,
      infoText: function(data) { return 'Heart: Switch targets'; },
    },
    { id: 'ShinryuEx Divebomb',
      regex: /:Shinryu starts using Gyre Charge/,
      alarmText: function(data) { return 'move away from divebomb'; },
    },
    { id: 'ShinryuEx Tera Slash',
      regex: /:25DA:Shinryu starts using Tera Slash/,
      alarmText: function(data) {
        if (data.role == 'tank')
          return 'Tank Buster / Swap'; },
    },
    { id: 'ShinryuEx Tethers',
      regex: /1B:........:(\y{Name}):....:....:0061:0000:0000:0000:/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      delaySeconds: 3.8,
      infoText: function(data) {
        return 'break tethers';
      },
    },
    { id: 'ShinryuEx Tail Marker',
      regex: /1B:........:(\y{Name}):....:....:007E:0000:0000:0000:/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      alarmText: function(data) {
        return 'tail marker on you';
      },
    },
    { id: 'ShinryuEx Shakers',
      regex: /1B:........:(\y{Name}):....:....:0028:0000:0000:0000:/,
      condition: function(data, matches) {
        data.shakerTargets = data.shakerTargets || [];
        data.shakerTargets.push(matches[1]);
        return data.shakerTargets.length == 2;
      },
      alarmText: function(data) {
        if (data.shakerTargets.indexOf(data.me) >= 0)
          return 'earthshaker on you';
      },
      alertText: function(data) {
        if (data.shakerTargets.indexOf(data.me) == -1)
          return 'avoid earthshakers';
      },
      run: function(data) {
        delete data.shakerTargets;
      },
    },
  ]
}]
