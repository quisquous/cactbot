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
      regexDe: /:25DE:Shinryu starts using Gaias Zorn/,
      run: function(data) {
        data.phase = 1;
      },
    },
    { regex: /:Shinryu starts using Dark Matter/,
      regexDe: /:Shinryu starts using Dunkelmaterie/,
      run: function(data) {
        data.phase = 2;
      },
    },
    { regex: /:Shinryu starts using Protostar/,
      regexDe: /:Shinryu starts using Protostern/,
      run: function(data) {
        data.phase = 3;
      },
    },
    { regex: /:264E:Shinryu starts using Tidal Wave/,
      regexDe: /:264E:Shinryu starts using Flutwelle/,
      run: function(data) {
        data.phase = 4;
      },
    },
    { id: 'ShinryuEx Akh Morn',
      regex: /:Shinryu starts using Akh Morn on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me)
          return {
            en: 'Akh Morn on you',
            de: 'Akh Morn auf dir',
          };
        if (data.role == 'tank')
          return {
            en: 'Akh Morn on ' + matches[1],
            de: 'Akh Morn auf ' + matches[1],
          };
      },
      infoText: function(data, matches) {
        if (matches[1] == data.me || data.role == 'tank')
          return;
        return {
          en: 'Akh Rhai: spread and move',
          de: 'Akh Rhai: Verteilen und bewegen',
        };
      },
      tts: 'akh morn',
    },
    { id: 'ShinryuEx Diamond Dust',
      regex: /:25DD:Shinryu starts using Diamond Dust/,
      regexDe: /:25DD:Shinryu starts using Diamantenstaub/,
      infoText: function(data) { return {
        en: 'Ice: Stack and Stop',
        de: 'Eis: Stack und Stehenbleiben',
      }; },
      tts: 'stop',
    },
    { id: 'ShinryuEx Dragonfist',
      regex: /:Shinryu starts using Dragonfist/,
      regexDe: /:Shinryu starts using Drachenfaust/,
      infoText: function(data) { return {
        en: 'Out of middle',
        de: 'Raus aus der Mitte',
      }; },
      tts: 'out of middle',
    },
    { id: 'ShinryuEx Hellfire',
      regex: /:25DB:Shinryu starts using Hellfire/,
      regexDe: /:25DB:Shinryu starts using Höllenfeuer/,
      durationSeconds: 7,
      alertText: function(data) { return {
        en: 'Get in water',
        de: "In's Wasser",
      }; },
      tts: 'water',
    },
    { id: 'ShinryuEx Hypernova',
      regex: /:Right Wing starts using Hypernova/,
      regexDe: /:Rechter Flügel starts using Supernova/,
      durationSeconds: 7,
      alertText: function(data) {
        if (data.phase == 3)
          return {
            en: 'stop to get frozen',
            de: 'Stopp! Einfrieren lassen',
          };
        return 'Stack in water';
      },
      tts: function(data) {
        if (data.phase == 3)
          return {
            en: 'stop to get frozen',
            de: 'Stopp! Einfrieren lassen',
          };
        return {
          en: 'water',
          de: 'Wasser',
        };
      },
    },
    { id: 'ShinryuEx Judgement Bolt',
      regex: /:25DC:Shinryu starts using Judgment Bolt/,
      regexDe: /:25DC:Shinryu starts using Ionenschlag/,
      durationSeconds: 7,
      alertText: function(data) { return {
        en: 'out of water',
        de: 'Raus aus dem Wasser',
      }; },
      tts: 'out of water',
    },
    { id: 'ShinryuEx Levinbolt',
      regex: /:Right Wing starts using Levinbolt on Right Wing/,
      regexDe: /:Rechter Flügel starts using Keraunisches Feld on Rechter Flügel/,
      durationSeconds: 7,
      alertText: function(data) {
        if (data.phase == 3)
          return {
            en: 'bait bolt, keep moving',
            de: 'Blitz ködern, weiterbewegen',
          };
        return {
          en: 'Spread out, no water',
          de: "Verteilen und nicht in's Wasser",
        };
      },
      tts: function(data) {
        if (data.phase == 3)
          return {
            en: 'bait bolt, keep moving',
            de: 'Blitz ködern, weiterbewegen',
          };
        return {
          en: 'levinbolt',
          de: 'Blitz',
        };
      },
    },
    { id: 'ShinryuEx Levinbolt Phase 3',
      regex: /:Right Wing starts using Levinbolt on Right Wing/,
      regexDe: /:Rechter Flügel starts using Keraunisches Feld on Rechter Flügel/,
      delaySeconds: 9.5,
      alarmText: function(data) {
        if (data.phase == 3)
          return {
            en: 'move away',
            de: 'wegbewegen',
          };
      },
      tts: function(data) {
        if (data.phase == 3)
          return {
            en: 'move away',
            de: 'weckbewegen',
          };
      },
    },
    { id: 'ShinryuEx Icicle Left',
      regex: /:Icicle Impact:.*:-29\.99:-15:/,
      regexDe: /:Eiszapfen-Schlag:.*:-29\.99:-15:/,
      alarmText: function(data) { return {
        en: 'icicle, lean west',
        de: 'Eiszapfen, nach westen',
      }; },
      tts: {
        en: 'icicle lean west',
        de: 'Eiszapfen nach westen',
      };,
    },
    { id: 'ShinryuEx Icicle Right',
      regex: /:Icicle Impact:.*:-29\.99:-25:/,
      regexDe: /:Eiszapfen-Schlag:.*:-29\.99:-25:/,
      alarmText: function(data) { return {
        en: 'icicle, lean east',
        de: 'Eiszapfen, nach Osten',
      }; },
      tts: 'icicle lean east',
    },
    { id: 'ShinryuEx Tidal Wave',
      regex: /:25DA:Shinryu starts using Tidal Wave/,
      regexDe: /:25DA:Shinryu starts using Flutwelle/,
      delaySeconds: 3,
      durationSeconds: 5,
      infoText: function(data) { return {
        en: 'Knockback, look for water',
        de: 'Rückstoß, nach Wasser schauen',
      }; },
      tts: 'knockback',
    },
    { id: 'ShinryuEx Final Tidal Wave',
      regex: /:264E:Shinryu starts using Tidal Wave/,
      regexDe: /:264E:Shinryu starts using Flutwelle/,
      infoText: function(data) {
        if (data.role == 'healer')
          return {
            en: 'no more heals needed',
            de: 'keine Heilung mehr nötig',
          };
      },
      tts: function(data) {
        if (data.role == 'healer')
          return {
            en: 'stop healing',
            de: 'keine Heilung mehr',
          };
      },
    },
    { id: 'ShinryuEx Tail Slap',
      regex: /:Tail starts using Tail Slap/,
      regexDe: /:Schwanz starts using Schweifklapser/,
      delaySeconds: 2,
      infoText: function(data) { return {
        en: 'Tail: Switch targets',
        de: 'Schweif: Zielwechsel',
      }; },
      tts: 'tail',
    },
    { id: 'ShinryuEx Heart',
      regex: /:Added new combatant The Worm's Heart/,
      regexDe: /:Added new combatant Shinryus Herz/,
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
      regex: /:Shinryu starts using Wirbel-Aufladung/,
      alarmText: function(data) { return {
        en: 'avoid divebomb',
        de: 'Divebomb ausweichen',
      }; },
      tts: 'divebombs',
    },
    { id: 'ShinryuEx Death Sentence',
      regex: /:Hakkinryu starts using Death Sentence on (\y{Name})/,
      regexDe: /:Hakkinryu starts using Todesurteil on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me)
          return {
            en: 'Death Sentence on YOU',
            de: 'Todesurteil auf DIR',
          };
        if (data.role == 'healer')
          return {
            en: 'Death Sentence on ' + matches[1],
            de: 'Todesurteil auf ' + matches[1],
          };
      },
      infoText: function(data, matches) {
        if (matches[1] != data.me && data.role == 'tank')
          return {
            en: 'Death Sentence on ' + matches[1],
            de: 'Todesurteil auf ' + matches[1],
          };
      },
      tts: function(data) {
        if (data.role == 'healer' || data.role == 'tank')
          return {
            en: 'Death Sentence',
            de: 'Todesurteil',
          };
      },
    },
    { id: 'ShinryuEx Tera Slash',
      regex: /:264B:Shinryu starts using Tera Slash on (\y{Name})/,
      regexDe: /:264B:Shinryu starts using Tera-Schlag on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me)
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
          };
        if (data.role == 'tank')
          return {
            en: 'Tank Swap',
            de: 'Tankwechsel',
          };
        if (data.role == 'healer')
          return {
            en: 'Tank Buster on ' + matches[1],
            de: 'Tankbuster auf ' + matches[1],
          };
      },
      tts: function(data, matches) {
        if (matches[1] == data.me || data.role == 'healer')
          return {
            en: 'Tank Buster,
            de: 'Tenkbasta',
          };
        if (data.role == 'tank')
          return {
            en: 'Tank Swap',
            de: 'Tenkwechsel',
          };
      },
    },
    { id: 'ShinryuEx Wormwail',
      regex: /:Shinryu starts using Wormwail/,
      regexDe: /:Shinryu starts using Shinryus Ruf/,
      alertText: function(data) { return {
        en: 'be inside hitbox',
        de: 'In seine Hitbox',
      }; },
      tts: 'get inside',
    },
    { id: 'ShinryuEx Breath',
      regex: /:264A:Shinryu starts using Benighting Breath/,
      regexDe: /:264A:Shinryu starts using Dunkelhauch/,
      alertText: function(data) { return {
        en: 'front cleave',
        de: 'Frontalcleave',
      }; },
      tts: 'cleave',
    },
    { id: 'ShinryuEx Final Left Wing',
      regex: /:Left Wing starts using Judgment Bolt/,
      regex: /:Linker Flügel starts using Ionenschlag/,
      condition: function(data) { return !data.finalWing; },
      alertText: 'kill left first',
      tts: 'left first',
      run: function(data) { data.finalWing = true; }
    },
    { id: 'ShinryuEx Final Right Wing',
      regex: /:Right Wing starts using Hellfire/,
      regexDe: /:Rechter Flügel starts using Höllenfeuer/,
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
          return {
            en: 'break tethers then stack',
            de: 'Kette zerreissen, dann stack',
          };
        return {
          en: 'break tethers',
          de: 'Ketten zerreissen',
        };
      },
      tts: function(data) {
        if (data.phase == 3)
          return {
            en: 'break tethers then stack',
            de: 'Kette zerreissen, dann stack',
          };
        return {
          en: 'break tethers',
          de: 'Ketten zerreissen',
        };
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
          return {
            en: 'earthshaker on you',
            de: 'Erdstoss auf dir',
          };
      },
      alertText: function(data) {
        if (data.shakerTargets.indexOf(data.me) == -1)
          return 'avoid earthshakers';
      },
      tts: function(data) {
        if (data.shakerTargets.indexOf(data.me) == -1)
          return {
            en: 'avoid shakers',
            de: 'Stöße ausweichen',
          };
        else
          return {
            en: 'earthshaker',
            de: 'erdstoß',
          };
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
