// Shinryu Extreme
[{
  zoneRegex: /^The Minstrel's Ballad: Shinryu's Domain$/,
  triggers: [
    { regex: /Removing combatant Shinryu\.  Max HP: 17167557\./,
      run: function(data) {
        // Explicitly clear so ugly heart message doesn't appear after wipe.
        delete data.phase;
      },
    },
    { regex: /:25DE:Shinryu starts using Earthen Fury/,
      run: function(data) {
        data.phase = 1;
      },
    },
    { regex: /:Shinryu starts using Dark Matter/,
      run: function(data) {
        data.phase = 2;
      },
    },
    { regex: /:Shinryu starts using Protostar/,
      run: function(data) {
        data.phase = 3;
      },
    },
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
      alertText: function(data) {
        if (data.phase == 3)
          return 'stop to get frozen';
        return 'Stack in water';
      },
    },
    { id: 'ShinryuEx Judgement Bolt',
      regex: /:25DC:Shinryu starts using Judgment Bolt/,
      durationSeconds: 7,
      alertText: function(data) { return 'Stack, no water'; },
    },
    { id: 'ShinryuEx Levinbolt',
      regex: /:Right Wing starts using Levinbolt/,
      durationSeconds: 7,
      alertText: function(data) {
        if (data.phase == 3)
          return 'bait bolt, keep moving';
        return 'Spread out, no water';
      },
    },
    { id: 'ShinryuEx Icicle Left',
      regex: /:Icicle Impact:.*:-29\.99:-15:/,
      alarmText: function(data) { return 'icicle, lean west'; },
    },
    { id: 'ShinryuEx Icicle Right',
      regex: /:Icicle Impact:.*:-29\.99:-25:/,
      alarmText: function(data) { return 'icicle, lean east'; },
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
      condition: function(data) {
        // Prevent ugly heart message on wipe.
        return data.phase == 1;
      },
      // TODO: If tail is alive, delay this message?
      infoText: function(data) { return 'Heart: Switch targets'; },
    },
    { id: 'ShinryuEx Divebomb',
      regex: /:Shinryu starts using Gyre Charge/,
      alarmText: function(data) { return 'avoid divebomb'; },
    },
    { id: 'ShinryuEx Tera Slash',
      regex: /:25DA:Shinryu starts using Tera Slash/,
      alarmText: function(data) {
        if (data.role == 'tank')
          return 'Tank Buster / Swap';
        if (data.role == 'healer')
          return 'Tank Buster';
      },
    },
    { id: 'ShinryuEx Wyrmwail',
      regex: /:Shinryu starts using Wyrmwail/,
      alertText: function(data) { return 'be inside hitbox'; },
    },
    { id: 'ShinryuEx Breath',
      regex: /:Shinryu starts using Benighting Breath/,
      alertText: function(data) { return 'front cleave'; },
    },
    { id: 'ShinryuEx Final Left Wing',
      regex: /:Left Wing starts using Judgment Bolt/,
      condition: function(data) { return !data.finalWing; },
      infoText: function(data) {
        data.finalWing = true;
        return 'kill left first';
      },
    },
    { id: 'ShinryuEx Final Right Wing',
      regex: /:Right Wing starts using Hellfire/,
      condition: function(data) { return !data.finalWing; },
      infoText: function(data) {
        data.finalWing = true;
        return 'kill right first';
      },
    },
    { id: 'ShinryuEx Tethers',
      regex: /1B:........:(\y{Name}):....:....:0061:0000:0000:0000:/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      delaySeconds: 3.8,
      infoText: function(data) {
        if (data.phase == 3)
          return 'break tethers then stack';
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
