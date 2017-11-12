// Shinryu Extreme
[{
  zoneRegex: /^The Minstrel's Ballad: Shinryu's Domain$/,
  timelineFile: 'shinryu-ex.txt',
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
    { regex: /:264E:Shinryu starts using Tidal Wave/,
      run: function(data) {
        data.phase = 4;
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
      tts: 'akh morn',
    },
    { id: 'ShinryuEx Diamond Dust',
      regex: /:25DD:Shinryu starts using Diamond Dust/,
      infoText: function(data) { return 'Ice: Stack and Stop'; },
      tts: 'stop',
    },
    { id: 'ShinryuEx Dragonfist',
      regex: /:Shinryu starts using Dragonfist/,
      infoText: function(data) { return 'Out of middle'; },
      tts: 'out of middle',
    },
    { id: 'ShinryuEx Hellfire',
      regex: /:25DB:Shinryu starts using Hellfire/,
      durationSeconds: 7,
      alertText: function(data) { return 'Get in water'; },
      tts: 'water',
    },
    { id: 'ShinryuEx Hypernova',
      regex: /:Right Wing starts using Hypernova/,
      durationSeconds: 7,
      alertText: function(data) {
        if (data.phase == 3)
          return 'stop to get frozen';
        return 'Stack in water';
      },
      tts: function(data) {
        if (data.phase == 3)
          return 'stop get frozen';
        return 'water';
      },
    },
    { id: 'ShinryuEx Judgement Bolt',
      regex: /:25DC:Shinryu starts using Judgment Bolt/,
      durationSeconds: 7,
      alertText: function(data) { return 'out of water'; },
      tts: 'out of water',
    },
    { id: 'ShinryuEx Levinbolt',
      regex: /:Right Wing starts using Levinbolt on Right Wing/,
      durationSeconds: 7,
      alertText: function(data) {
        if (data.phase == 3)
          return 'bait bolt, keep moving';
        return 'Spread out, no water';
      },
      tts: function(data) {
        if (data.phase == 3)
          return 'bait bolt, keep moving';
        return 'levinbolt';
      },
    },
    { id: 'ShinryuEx Levinbolt Phase 3',
      regex: /:Right Wing starts using Levinbolt on Right Wing/,
      delaySeconds: 9.5,
      alarmText: function(data) {
        if (data.phase == 3)
          return 'move away';
      },
      tts: function(data) {
        if (data.phase == 3)
          return 'move away';
      },
    },
    { id: 'ShinryuEx Icicle Left',
      regex: /:Icicle Impact:.*:-29\.99:-15:/,
      alarmText: function(data) { return 'icicle, lean west'; },
      tts: 'icicle lean west',
    },
    { id: 'ShinryuEx Icicle Right',
      regex: /:Icicle Impact:.*:-29\.99:-25:/,
      alarmText: function(data) { return 'icicle, lean east'; },
      tts: 'icicle lean east',
    },
    { id: 'ShinryuEx Tidal Wave',
      regex: /:25DA:Shinryu starts using Tidal Wave/,
      delaySeconds: 3,
      durationSeconds: 5,
      infoText: function(data) { return 'Knockback: look for water'; },
      tts: 'knockback',
    },
    { id: 'ShinryuEx Final Tidal Wave',
      regex: /:264E:Shinryu starts using Tidal Wave/,
      infoText: function(data) {
        if (data.role == 'healer')
          return 'no more heals needed';
      },
      tts: function(data) {
        if (data.role == 'healer')
          return 'stop healing';
      },
    },
    { id: 'ShinryuEx Tail Slap',
      regex: /:Tail starts using Tail Slap/,
      delaySeconds: 2,
      infoText: function(data) { return 'Tail: Switch targets'; },
      tts: 'tail',
    },
    { id: 'ShinryuEx Heart',
      regex: /:Added new combatant The Worm's Heart/,
      condition: function(data) {
        // Prevent ugly heart message on wipe.
        return data.phase == 1;
      },
      // TODO: If tail is alive, delay this message?
      infoText: 'Heart: Switch targets',
      tts: 'heart',
    },
    { id: 'ShinryuEx Divebomb',
      regex: /:Shinryu starts using Gyre Charge/,
      alarmText: function(data) { return 'avoid divebomb'; },
      tts: 'divebombs',
    },
    { id: 'ShinryuEx Death Sentence',
      regex: /:Hakkinryu starts using Death Sentence on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me)
          return 'Death Sentence on YOU';
        if (data.role == 'healer')
          return 'Death Sentence on ' + matches[1];
      },
      infoText: function(data, matches) {
        if (matches[1] != data.me && data.role == 'tank')
          return 'Death Sentence on ' + matches[1];
      },
      tts: function(data) {
        if (data.role == 'healer' || data.role == 'tank')
          return 'death sentence';
      },
    },
    { id: 'ShinryuEx Tera Slash',
      regex: /:264B:Shinryu starts using Tera Slash on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me)
          return 'Tank Buster on YOU';
        if (data.role == 'tank')
          return 'Tank Swap';
        if (data.role == 'healer')
          return 'Tank Buster on ' + matches[1];
      },
      tts: function(data, matches) {
        if (matches[1] == data.me || data.role == 'healer')
          return 'Tank Buster';
        if (data.role == 'tank')
          return 'Tank Swap';
      },
    },
    { id: 'ShinryuEx Wormwail',
      regex: /:Shinryu starts using Wormwail/,
      alertText: function(data) { return 'be inside hitbox'; },
      tts: 'get inside',
    },
    { id: 'ShinryuEx Breath',
      regex: /:264A:Shinryu starts using Benighting Breath/,
      alertText: function(data) { return 'front cleave'; },
      tts: 'cleave',
    },
    { id: 'ShinryuEx Final Left Wing',
      regex: /:Left Wing starts using Judgment Bolt/,
      condition: function(data) { return !data.finalWing; },
      alertText: 'kill left first',
      tts: 'left first',
      run: function(data) { data.finalWing = true; }
    },
    { id: 'ShinryuEx Final Right Wing',
      regex: /:Right Wing starts using Hellfire/,
      condition: function(data) { return !data.finalWing; },
      alertText: 'kill right first',
      tts: 'right first',
      run: function(data) { data.finalWing = true; }
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
      tts: function(data) {
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
      alarmText: 'tail marker on you',
      tts: 'tail marker',
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
      tts: function(data) {
        if (data.shakerTargets.indexOf(data.me) == -1)
          return 'avoid shakers';
        else
          return 'earthshaker';
      },
      run: function(data) {
        delete data.shakerTargets;
      },
    },
    { id: 'ShinryuEx Cocoon Marker',
      regex: /1B:........:(\y{Name}):....:....:0039:0000:0000:0000:/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      alarmText: 'spread out',
      tts: 'spread out',
    },
  ]
}]
