'use strict';

// Shinryu Extreme
[{
  zoneRegex: /^The Minstrel's Ballad: Shinryu's Domain$/,
  timelineFile: 'shinryu-ex.txt',
  triggers: [
    {
      regex: / 04:\y{ObjectId}:Removing combatant Shinryu\.  Max HP: 17167557\./,
      regexDe: / 04:\y{ObjectId}:Removing combatant Shinryu\.  Max HP: 17167557\./,
      regexFr: / 04:\y{ObjectId}:Removing combatant Shinryu\.  Max HP: 17167557\./,
      regexJa: / 04:\y{ObjectId}:Removing combatant 神龍\.  Max HP: 17167557\./,
      run: function(data) {
        // Explicitly clear so ugly heart message doesn't appear after wipe.
        delete data.phase;
      },
    },
    {
      regex: / 14:25DE:Shinryu starts using Earthen Fury/,
      regexDe: / 14:25DE:Shinryu starts using Gaias Zorn/,
      regexFr: / 14:25DE:Shinryu starts using Fureur Tellurique/,
      regexJa: / 14:25DE:神龍 starts using 大地の怒り/,
      run: function(data) {
        data.phase = 1;
      },
    },
    {
      regex: / 14:25E7:Shinryu starts using Dark Matter/,
      regexDe: / 14:25E7:Shinryu starts using Dunkelmaterie/,
      regexFr: / 14:25E7:Shinryu starts using Matière Sombre/,
      regexJa: / 14:25E7:神龍 starts using ダークマター/,
      run: function(data) {
        data.phase = 2;
      },
    },
    {
      regex: / 14:25E4:Shinryu starts using Protostar/,
      regexDe: / 14:25E4:Shinryu starts using Protostern/,
      regexFr: / 14:25E4:Shinryu starts using Proto-Étoile/,
      regexJa: / 14:25E4:神龍 starts using プロトスター/,
      run: function(data) {
        data.phase = 3;
      },
    },
    {
      regex: / 14:264E:Shinryu starts using Tidal Wave/,
      regexDe: / 14:264E:Shinryu starts using Flutwelle/,
      regexFr: / 14:264E:Shinryu starts using Raz-De-Marée/,
      regexJa: / 14:264E:神龍 starts using タイダルウェイブ/,
      run: function(data) {
        data.phase = 4;
      },
    },
    {
      id: 'ShinryuEx Akh Morn',
      regex: / 14:25F3:Shinryu starts using Akh Morn on (\y{Name})/,
      regexDe: / 14:25F3:Shinryu starts using Akh Morn on (\y{Name})/,
      regexFr: / 14:25F3:Shinryu starts using Akh Morn on (\y{Name})/,
      regexJa: / 14:25F3:神龍 starts using アク・モーン on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Akh Morn on YOU',
            de: 'Akh Morn auf DIR',
          };
        } else if (data.role == 'tank') {
          return {
            en: 'Akh Morn on ' + matches[1],
            de: 'Akh Morn auf ' + matches[1],
          };
        }
      },
      infoText: function(data, matches) {
        if (matches[1] == data.me || data.role == 'tank')
          return;

        return {
          en: 'Akh Rhai: spread and move',
          de: 'Akh Rhai: Verteilen und bewegen',
        };
      },
      tts: {
        en: 'akh morn',
        de: 'akh morn',
      },
    },
    {
      id: 'ShinryuEx Diamond Dust',
      regex: / 14:25DD:Shinryu starts using Diamond Dust/,
      regexDe: / 14:25DD:Shinryu starts using Diamantenstaub/,
      regexFr: / 14:25DD:Shinryu starts using Poussière De Diamant/,
      regexJa: / 14:25DD:神龍 starts using ダイアモンドダスト/,
      infoText: {
        en: 'Ice: Stack and Stop',
        de: 'Eis: Stack und Stehenbleiben',
      },
      tts: {
        en: 'stop',
        de: 'stopp',
      },
    },
    {
      id: 'ShinryuEx Dragonfist',
      regex: / 14:2611:Shinryu starts using Dragonfist/,
      regexDe: / 14:2611:Shinryu starts using Drachenfaust/,
      regexFr: / 14:2611:Shinryu starts using Poing Dragon/,
      regexJa: / 14:2611:神龍 starts using 龍掌/,
      infoText: {
        en: 'Out of middle',
        de: 'Raus aus der Mitte',
      },
    },
    {
      id: 'ShinryuEx Hellfire',
      regex: / 14:25DB:Shinryu starts using Hellfire/,
      regexDe: / 14:25DB:Shinryu starts using Höllenfeuer/,
      regexFr: / 14:25DB:Shinryu starts using Flammes De L'Enfer/,
      regexJa: / 14:25DB:神龍 starts using 地獄の火炎/,
      durationSeconds: 7,
      alertText: {
        en: 'Get in water',
        de: 'In\'s Wasser',
      },
      tts: {
        en: 'water',
        de: 'wasser',
      },
    },
    {
      // TODO: the original trigger didn't differentiate the two ability ids.
      // Probably the phase conditional could get removed if it did.
      id: 'ShinryuEx Hypernova',
      regex: / 14:(?:271F|25E8):Right Wing starts using Hypernova/,
      regexDe: / 14:(?:271F|25E8):Rechter Flügel starts using Supernova/,
      regexFr: / 14:(?:271F|25E8):Aile Droite starts using Hypernova/,
      regexJa: / 14:(?:271F|25E8):ライトウィング starts using スーパーノヴァ/,
      durationSeconds: 7,
      alertText: function(data) {
        if (data.phase == 3) {
          return {
            en: 'stop to get frozen',
            de: 'Stopp! Einfrieren lassen',
          };
        }
        return {
          en: 'Stack in water',
          de: 'In Wasser stacken',
        };
      },
      tts: function(data) {
        if (data.phase == 3) {
          return {
            en: 'stop to get frozen',
            de: 'Stopp! Einfrieren lassen',
          };
        }
        return {
          en: 'water',
          de: 'Wasser',
        };
      },
    },
    {
      id: 'ShinryuEx Judgement Bolt',
      regex: / 14:25DC:Shinryu starts using Judgment Bolt/,
      regexDe: / 14:25DC:Shinryu starts using Ionenschlag/,
      regexFr: / 14:25DC:Shinryu starts using Éclair Du Jugement/,
      regexJa: / 14:25DC:神龍 starts using 裁きの雷/,
      durationSeconds: 7,
      alertText: {
        en: 'out of water',
        de: 'Raus aus dem Wasser',
      },
    },
    {
      id: 'ShinryuEx Levinbolt',
      regex: / 14:(?:25EA|2720|2725):Right Wing starts using Levinbolt on Right Wing/,
      regexDe: / 14:(?:25EA|2720|2725):Rechter Flügel starts using Keraunisches Feld on Rechter Flügel/,
      regexFr: / 14:(?:25EA|2720|2725):Aile Droite starts using Fulguration on Aile Droite/,
      regexJa: / 14:(?:25EA|2720|2725):ライトウィング starts using 稲妻 on ライトウィング/,
      durationSeconds: 7,
      alertText: function(data) {
        if (data.phase == 3) {
          return {
            en: 'bait bolt, keep moving',
            de: 'Blitz ködern, weiterbewegen',
          };
        }
        return {
          en: 'Spread out, no water',
          de: 'Verteilen und nicht in\'s Wasser',
        };
      },
      tts: function(data) {
        if (data.phase == 3) {
          return {
            en: 'bait bolt, keep moving',
            de: 'Blitz ködern, weiterbewegen',
          };
        }
        return {
          en: 'levinbolt',
          de: 'Blitz',
        };
      },
    },
    {
      id: 'ShinryuEx Levinbolt Phase 3',
      regex: / 14:(?:25EA|2720|2725):Right Wing starts using Levinbolt on Right Wing/,
      regexDe: / 14:(?:25EA|2720|2725):Rechter Flügel starts using Keraunisches Feld on Rechter Flügel/,
      regexFr: / 14:(?:25EA|2720|2725):Aile Droite starts using Fulguration on Aile Droite/,
      regexJa: / 14:(?:25EA|2720|2725):ライトウィング starts using 稲妻 on ライトウィング/,
      delaySeconds: 9.5,
      alarmText: function(data) {
        if (data.phase == 3) {
          return {
            en: 'move away',
            de: 'wegbewegen',
          };
        }
      },
      tts: function(data) {
        if (data.phase == 3) {
          return {
            en: 'move away',
            de: 'weckbewegen',
          };
        }
      },
    },
    {
      //15:\y{ObjectId}:Eiszapfen:25EF:Eiszapfen-Schlag:.*:-29.99:-25:
      id: 'ShinryuEx Icicle Left',
      regex: / 15:\y{ObjectId}:Icicle:25EF:Icicle Impact:.*:-29.99:-15:/,
      regexDe: / 15:\y{ObjectId}:Eiszapfen:25EF:Eiszapfen-Schlag:.*:-29.99:-15:/,
      regexFr: / 15:\y{ObjectId}:Stalactite:25EF:Impact de stalactite:.*:-29.99:-15:/
      regexJa: / 15:\y{ObjectId}:アイシクル:25EF:アイシクルインパクト:.*:-29.99:-15:/,
      alarmText: {
        en: 'icicle, lean west',
        de: 'Eiszapfen, nach westen',
      },
    },
    {
      id: 'ShinryuEx Icicle Right',
      regex: / 15:\y{ObjectId}:Icicle:25EF:Icicle Impact:.*:-29.99:-25:/,
      regexDe: / 15:\y{ObjectId}:Eiszapfen:25EF:Eiszapfen-Schlag:.*:-29.99:-25:/,
      regexFr: / 15:\y{ObjectId}:Stalactite:25EF:Impact de stalactite:.*:-29.99:-25:/,
      regexJa: / 15:\y{ObjectId}:アイシクル:25EF:アイシクルインパクト:.*:-29.99:-25:/,
      regexDe: 
      alarmText: {
        en: 'icicle, lean east',
        de: 'Eiszapfen, nach Osten',
      },
    },
    {
      id: 'ShinryuEx Tidal Wave',
      regex: / 14:25DA:Shinryu starts using Tidal Wave/,
      regexDe: / 14:25DA:Shinryu starts using Flutwelle/,
      regexFr: / 14:25DA:Shinryu starts using Raz-De-Marée/,
      regexJa: / 14:25DA:神龍 starts using タイダルウェイブ/,
      delaySeconds: 3,
      durationSeconds: 5,
      infoText: {
        en: 'Knockback, look for water',
        de: 'Rückstoß, nach Wasser schauen',
      },
      tts: {
        en: 'knockback',
        de: 'Rückstoß',
      },
    },
    {
      id: 'ShinryuEx Final Tidal Wave',
      regex: / 14:264E:Shinryu starts using Tidal Wave/,
      regexDe: / 14:264E:Shinryu starts using Flutwelle/,
      regexFr: / 14:264E:Shinryu starts using Raz-De-Marée/,
      regexJa: / 14:264E:神龍 starts using タイダルウェイブ/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'no more heals needed',
        de: 'keine Heilung mehr nötig',
      },
      tts: {
        en: 'stop healing',
        de: 'keine Heilung mehr',
      },
    },
    {
      id: 'ShinryuEx Tail Slap',
      regex: / 14:25E2:Tail starts using Tail Slap/,
      regexDe: / 14:25E2:Schwanz starts using Schweifklapser/,
      regexFr: / 14:25E2:Queue starts using Gifle Caudale/,
      regexJa: / 14:25E2:神龍の尾 starts using テールスラップ/,
      delaySeconds: 2,
      infoText: {
        en: 'Tail: Switch targets',
        de: 'Schweif: Zielwechsel',
      },
      tts: {
        en: 'tail',
        de: 'schweif',
      },
    },
    {
      id: 'ShinryuEx Heart',
      regex: / 03:\y{ObjectId}:Added new combatant The Worm's Heart/,
      regexDe: / 03:\y{ObjectId}:Added new combatant Shinryus Herz/,
      regexFr: / 03:\y{ObjectId}:Added new combatant Cœur Du Dragon/,
      regexJa: / 03:\y{ObjectId}:Added new combatant 神龍の心核/,
      condition: function(data) {
        // Prevent ugly heart message on wipe.
        return data.phase == 1;
      },
      // TODO: If tail is alive, delay this message?
      infoText: {
        en: 'Heart: Switch targets',
        de: 'Herz: Ziel wechseln',
      },
      tts: {
        en: 'heart',
        de: 'herz',
      },
    },
    {
      // TODO: can't find the id of this, so using all of them.
      id: 'ShinryuEx Divebomb',
      regex: / 14:(?:1FA8|1FF4|2603):Shinryu starts using Gyre Charge/,
      regexDe: / 14:(?:1FA8|1FF4|2603):Shinryu starts using Wirbel-Aufladung/,
      regexFr: / 14:(?:1FA8|1FF4|2603):Shinryu starts using Gyrocharge/,
      regexJa: / 14:(?:1FA8|1FF4|2603):神龍 starts using ジャイヤチャージ/,
      alarmText: {
        en: 'avoid divebomb',
        de: 'Divebomb ausweichen',
      },
      tts: {
        en: 'divebombs',
        de: 'sturzflug',
      },
    },
    {
      id: 'ShinryuEx Death Sentence',
      regex: / 14:260A:Hakkinryu starts using Death Sentence on (\y{Name})/,
      regexDe: / 14:260A:Hakkinryu starts using Todesurteil on (\y{Name})/,
      regexFr: / 14:260A:Hakkinryu starts using Peine De Mort on (\y{Name})/,
      regexJa: / 14:260A:白金龍 starts using デスセンテンス on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Death Sentence on YOU',
            de: 'Todesurteil auf DIR',
          };
        } else if (data.role == 'healer') {
          return {
            en: 'Death Sentence on ' + matches[1],
            de: 'Todesurteil auf ' + matches[1],
          };
        }
      },
      infoText: function(data, matches) {
        if (matches[1] != data.me && data.role == 'tank') {
          return {
            en: 'Death Sentence on ' + matches[1],
            de: 'Todesurteil auf ' + matches[1],
          };
        }
      },
      tts: function(data) {
        if (data.role == 'healer' || data.role == 'tank') {
          return {
            en: 'Death Sentence',
            de: 'Todesurteil',
          };
        }
      },
    },
    {
      id: 'ShinryuEx Tera Slash',
      regex: / 14:264B:Shinryu starts using Tera Slash on (\y{Name})/,
      regexDe: / 14:264B:Shinryu starts using Tera-Schlag on (\y{Name})/,
      regexFr: / 14:264B:Shinryu starts using Térataillade on (\y{Name})/,
      regexJa: / 14:264B:神龍 starts using テラスラッシュ on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
          };
        } else if (data.role == 'tank') {
          return {
            en: 'Tank Swap',
            de: 'Tankwechsel',
          };
        } else if (data.role == 'healer') {
          return {
            en: 'Tank Buster on ' + matches[1],
            de: 'Tankbuster auf ' + matches[1],
          };
        }
      },
      tts: function(data, matches) {
        if (matches[1] == data.me || data.role == 'healer') {
          return {
            en: 'Tank Buster',
            de: 'Tenkbasta',
          };
        } else if (data.role == 'tank') {
          return {
            en: 'Tank Swap',
            de: 'Tenk wechsel',
          };
        }
      },
    },
    {
      id: 'ShinryuEx Wormwail',
      regex: / 14:2648:Shinryu starts using Wormwail/,
      regexDe: / 14:2648:Shinryu starts using Shinryus Ruf/,
      regexFr: / 14:2648:Shinryu starts using Gémissement Draconique/,
      regexJa: / 14:2648:神龍 starts using 神龍の咆哮/,
      alertText: {
        en: 'be inside hitbox',
        de: 'In seine Hitbox',
      },
      tts: {
        en: 'get inside',
        de: 'reingehen',
      },
    },
    {
      id: 'ShinryuEx Breath',
      regex: / 14:264A:Shinryu starts using Benighting Breath/,
      regexDe: / 14:264A:Shinryu starts using Dunkelhauch/,
      regexFr: / 14:264A:Shinryu starts using Souffle Enténébrant/,
      regexJa: / 14:264A:神龍 starts using ダークネスブレス/,
      alertText: {
        en: 'front cleave',
        de: 'Frontalcleave',
      },
      tts: {
        en: 'cleave',
        de: 'klief',
      },
    },
    {
      id: 'ShinryuEx Final Left Wing',
      regex: / 14:2718:Left Wing starts using Judgment Bolt/,
      regexDe: / 14:2718:Linker Flügel starts using Ionenschlag/,
      regexFr: / 14:2718:Aile Gauche starts using Éclair Du Jugement/,
      regexJa: / 14:2718:レフトウィング starts using 裁きの雷/,
      condition: function(data) {
        return !data.finalWing;
      },
      alertText: {
        en: 'kill left first',
        de: 'linken Flügel zuerst',
      },
      tts: {
        en: 'left first',
        de: 'links zuerst',
      },
      run: function(data) {
        data.finalWing = true;
      },
    },
    {
      id: 'ShinryuEx Final Right Wing',
      regex: / 14:2719:Right Wing starts using Hellfire/,
      regexDe: / 14:2719:Rechter Flügel starts using Höllenfeuer/,
      regexFr: / 14:2719:Aile Droite starts using Flammes De L'Enfer/,
      regexJa: / 14:2719:ライトウィング starts using 地獄の火炎/,
      condition: function(data) {
        return !data.finalWing;
      },
      alertText: {
        en: 'kill right first',
        de: 'rechten Flügel zuerst',
      },
      tts: {
        en: 'right first',
        de: 'rechts zuerst',
      },
      run: function(data) {
        data.finalWing = true;
      },
    },
    {
      id: 'ShinryuEx Tethers',
      regex: /1B:\y{ObjectId}:(\y{Name}):....:....:0061:0000:0000:0000:/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      delaySeconds: 3.8,
      infoText: function(data) {
        if (data.phase == 3) {
          return {
            en: 'break tethers then stack',
            de: 'Kette zerreissen, dann stack',
          };
        }
        return {
          en: 'break tethers',
          de: 'Ketten zerreissen',
        };
      },
      tts: function(data) {
        if (data.phase == 3) {
          return {
            en: 'break tethers then stack',
            de: 'Kette zerreissen, dann stack',
          };
        }
        return {
          en: 'break tethers',
          de: 'Ketten zerreissen',
        };
      },
    },
    {
      id: 'ShinryuEx Tail Marker',
      regex: /1B:\y{ObjectId}:(\y{Name}):....:....:007E:0000:0000:0000:/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      alarmText: {
        en: 'tail marker on you',
        de: 'Schweifmarker auf dir',
      },
      tts: {
        en: 'tail marker',
        de: 'schweif marker',
      },
    },
    {
      id: 'ShinryuEx Shakers',
      regex: /1B:\y{ObjectId}:(\y{Name}):....:....:0028:0000:0000:0000:/,
      condition: function(data, matches) {
        data.shakerTargets = data.shakerTargets || [];
        data.shakerTargets.push(matches[1]);
        return data.shakerTargets.length == 2;
      },
      alarmText: function(data) {
        if (data.shakerTargets.indexOf(data.me) >= 0) {
          return {
            en: 'earthshaker on you',
            de: 'Erdstoss auf dir',
          };
        }
      },
      alertText: function(data) {
        if (data.shakerTargets.indexOf(data.me) == -1) {
          return {
            en: 'avoid earthshakers',
            de: 'Stöße ausweichen',
          };
        }
      },
      tts: function(data) {
        if (data.shakerTargets.indexOf(data.me) == -1) {
          return {
            en: 'avoid shakers',
            de: 'Stöße ausweichen',
          };
        }
        return {
          en: 'earthshaker',
          de: 'erdstoß',
        };
      },
      run: function(data) {
        delete data.shakerTargets;
      },
    },
    {
      id: 'ShinryuEx Cocoon Marker',
      regex: /1B:\y{ObjectId}:(\y{Name}):....:....:0039:0000:0000:0000:/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      alarmText: {
        en: 'spread out',
        de: 'verteilen',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Cocoon': 'Lichtsphäre',
        'Engage!': 'Start!',
        'Ginryu': 'Ginryu',
        'Hakkinryu': 'Hakkinryu',
        'Left Wing': 'Linke Schwinge',
        'Right Wing': 'Rechte Schwinge',
        'Shinryu': 'Shinryu',
        'Tail': 'Schwanz',
        'The Worm\'s Heart': 'Shinryus Herz',
      },
      'replaceText': {
        '--targetable--': '--anvisierbar--',
        '--untargetable--': '--nich anvisierbar--',
        'Aerial Blast': 'Windschlag',
        'Aetherial Ray': 'Ätherstrahl',
        'Akh Morn': 'Akh Morn',
        'Akh Rhai': 'Akh Rhai',
        'Atomic Ray': 'Protonenstrahl',
        'Benighting Breath': 'Dunkelhauch',
        'Blazing Trail': 'Feuerschweif',
        'Dark Matter': 'Dunkelmaterie',
        'Death Sentence': 'Todesurteil',
        'Diamond Dust': 'Diamantenstaub',
        'Dragonfist': 'Drachenfaust',
        'Dragonflight': 'Drachenflug',
        'Earth Breath': 'Erdatem',
        'Earthen Fury': 'Gaias Zorn',
        'Enrage': 'Finalangriff',
        'Fireball': 'Feuerball',
        'Hellfire': 'Höllenfeuer',
        'Hypernova': 'Supernova',
        'Ice Storm': 'Eissturm',
        'Icicle Impact': 'Eiszapfen-Schlag',
        'Judgment Bolt': 'Ionenschlag',
        'Levinbolt': 'Keraunisches Feld',
        'Meteor Impact': 'Meteoreinschlag',
        'Protostar': 'Protostern',
        'Shatter': 'Zerfallen',
        'Spiked Tail': 'Stachelschweif',
        'Spikesicle': 'Eislanze',
        'Summon Icicle': 'Flugeis',
        'Super Cyclone': 'Superzyklon',
        'Tail Slap': 'Schweifklapser',
        'Tail Spit': 'Schweifspieß',
        'Tera Slash': 'Tera-Schlag',
        'Tidal Wave': 'Flutwelle',
        'Touchdown': 'Himmelssturz',

        // FIXME
        'Tethers': 'Tethers',
        'Tethers .healers.': 'Tethers (healers)',
        'Tethers .T/H.': 'Tethers (T/H)',
        'Tail Marker .healer.': 'Tail Marker (healer)',
        'Tail Marker .tank.': 'Tail Marker (healer)',
        'Tail Marker .dps.': 'Tail Marker (dps)',
        'Tail Marker .T/H.': 'Tail Marker (T/H)',
        'Cocoon Markers': 'Cocoon Markers',
        'Benighting / Wormwail': 'Benighting / Wormwail',
        'Reiyu Adds': 'Reiyu Adds',
        'First Wing': 'First Wing',
        'Second Wing': 'Second Wing',
        'TAP BUTTON OR ELSE': 'TAP BUTTON OR ELSE',
        'Gyre Charge': 'Gyre Charge',
        'Phase 2': 'Phase 2',
        'Phase 3': 'Phase 4',
        'Phase 4': 'Phase 4',
      },
      '~effectNames': {
        'Affixed': 'Angekrallt',
        'Burning Chains': 'Brennende Ketten',
        'Burns': 'Brandwunde',
        'Deep Freeze': 'Tiefkühlung',
        'Doom': 'Verhängnis',
        'Electrocution': 'Stromschlag',
        'Fetters': 'Gefesselt',
        'Fire Resistance Up': 'Feuerresistenz +',
        'HP Boost': 'LP-Bonus',
        'Legendary Resolve': 'Mythischer Endkampf',
        'Lightning Resistance Down II': 'Blitzresistenz - (stark)',
        'Magic Vulnerability Up': 'Erhöhte Magie-Verwundbarkeit',
        'Physical Vulnerability Up': 'Erhöhte Physische Verwundbarkeit',
        'Poison': 'Gift',
        'Rehabilitation': 'Rehabilitation',
        'Sludge': 'Schlamm',
        'Stun': 'Betäubung',
        'The Worm\'s Curse': 'Fluch Des Drachen',
        'Thin Ice': 'Glatteis',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Cocoon': 'Cocon De Lumière',
        'Engage!': 'À l\'attaque',
        'Ginryu': 'Ginryu',
        'Hakkinryu': 'Hakkinryu',
        'Left Wing': 'Aile Gauche',
        'Right Wing': 'Aile Droite',
        'Shinryu': 'Shinryu',
        'Tail': 'Queue',
        'The Worm\'s Heart': 'Cœur Du Dragon',
      },
      'replaceText': {
        '--Reset--': '--Réinitialisation--',
        '--sync--': '--Synchronisation--',
        '--targetable--': '--Ciblable--',
        '--untargetable--': '--Impossible à cibler--',
        'Aerial Blast': 'Rafale Aérienne',
        'Aetherial Ray': 'Rayon éthéré',
        'Akh Morn': 'Akh Morn',
        'Akh Rhai': 'Akh Rhai',
        'Atomic Ray': 'Rayon Atomique',
        'Benighting Breath': 'Souffle Enténébrant',
        'Blazing Trail': 'Trace Embrasée',
        'Dark Matter': 'Matière Sombre',
        'Death Sentence': 'Peine De Mort',
        'Diamond Dust': 'Poussière De Diamant',
        'Dragonfist': 'Poing Dragon',
        'Dragonflight': 'Vol Du Dragon',
        'Earth Breath': 'Souffle De Terre',
        'Earthen Fury': 'Fureur Tellurique',
        'Enrage': 'Enrage',
        'Fireball': 'Boule De Feu',
        'Hellfire': 'Flammes De L\'enfer',
        'Hypernova': 'Hypernova',
        'Ice Storm': 'Tempête De Glace',
        'Icicle Impact': 'Impact De Stalactite',
        'Judgment Bolt': 'Éclair Du Jugement',
        'Levinbolt': 'Fulguration',
        'Meteor Impact': 'Impact De Météore',
        'Protostar': 'Proto-étoile',
        'Shatter': 'Éclatement',
        'Spiked Tail': 'Queue Barbelée',
        'Spikesicle': 'Stalactopointe',
        'Summon Icicle': 'Appel De Stalactite',
        'Super Cyclone': 'Super Cyclone',
        'Tail Slap': 'Gifle Caudale',
        'Tail Spit': 'Broche Caudale',
        'Tera Slash': 'TéraTaillade',
        'Tidal Wave': 'Raz-de-marée',
        'Touchdown': 'Atterrissage',

        // FIXME
        'Tethers': 'Tethers',
        'Tethers .healers.': 'Tethers (healers)',
        'Tethers .T/H.': 'Tethers (T/H)',
        'Tail Marker .healer.': 'Tail Marker (healer)',
        'Tail Marker .tank.': 'Tail Marker (healer)',
        'Tail Marker .dps.': 'Tail Marker (dps)',
        'Tail Marker .T/H.': 'Tail Marker (T/H)',
        'Cocoon Markers': 'Cocoon Markers',
        'Benighting / Wormwail': 'Benighting / Wormwail',
        'Reiyu Adds': 'Reiyu Adds',
        'First Wing': 'First Wing',
        'Second Wing': 'Second Wing',
        'TAP BUTTON OR ELSE': 'TAP BUTTON OR ELSE',
        'Gyre Charge': 'Gyre Charge',
        'Phase 2': 'Phase 2',
        'Phase 3': 'Phase 4',
        'Phase 4': 'Phase 4',
      },
      '~effectNames': {
        'Affixed': 'Étreinte',
        'Burning Chains': 'Chaînes Brûlantes',
        'Burns': 'Brûlure',
        'Deep Freeze': 'Congélation',
        'Doom': 'Glas',
        'Electrocution': 'Électrocution',
        'Fetters': 'Attache',
        'Fire Resistance Up': 'Résistance Au Feu Accrue',
        'HP Boost': 'Bonus De PV',
        'Legendary Resolve': 'Combat épique',
        'Lightning Resistance Down II': 'Résistance à La Foudre Réduite+',
        'Magic Vulnerability Up': 'Vulnérabilité Magique Augmentée',
        'Physical Vulnerability Up': 'Vulnérabilité Physique Augmentée',
        'Poison': 'Poison',
        'Rehabilitation': 'Recouvrement',
        'Sludge': 'Emboué',
        'Stun': 'Étourdissement',
        'The Worm\'s Curse': 'Malédiction Du Dragon',
        'Thin Ice': 'Verglas',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Cocoon': '光の繭',
        'Engage!': '戦闘開始！',
        'Ginryu': '銀龍',
        'Hakkinryu': '白金龍',
        'Left Wing': 'レフトウィング',
        'Right Wing': 'ライトウィング',
        'Shinryu': '神龍',
        'Tail': '神龍の尾',
        'The Worm\'s Heart': '神龍の心核',
      },
      'replaceText': {
        'Aerial Blast': 'エリアルブラスト',
        'Aetherial Ray': 'エーテルレイ',
        'Akh Morn': 'アク・モーン',
        'Akh Rhai': 'アク・ラーイ',
        'Atomic Ray': 'アトミックレイ',
        'Benighting Breath': 'ダークネスブレス',
        'Blazing Trail': 'ブレイジングトレイル',
        'Dark Matter': 'ダークマター',
        'Death Sentence': 'デスセンテンス',
        'Diamond Dust': 'ダイアモンドダスト',
        'Dragonfist': '龍掌',
        'Dragonflight': '昇竜',
        'Earth Breath': 'アースブレス',
        'Earthen Fury': '大地の怒り',
        'Fireball': 'ファイアボール',
        'Hellfire': '地獄の火炎',
        'Hypernova': 'スーパーノヴァ',
        'Ice Storm': '吹雪',
        'Icicle Impact': 'アイシクルインパクト',
        'Judgment Bolt': '裁きの雷',
        'Levinbolt': '稲妻',
        'Meteor Impact': 'メテオインパクト',
        'Protostar': 'プロトスター',
        'Shatter': '破砕',
        'Spiked Tail': 'スパイクテール',
        'Spikesicle': 'アイシクルスパイク',
        'Summon Icicle': 'サモン・アイシクル',
        'Super Cyclone': 'スーパーサイクロン',
        'Tail Slap': 'テールスラップ',
        'Tail Spit': 'テールスピット',
        'Tera Slash': 'テラスラッシュ',
        'Tidal Wave': 'タイダルウェイブ',
        'Touchdown': 'タッチダウン',

        // FIXME
        'Tethers': 'Tethers',
        'Tethers .healers.': 'Tethers (healers)',
        'Tethers .T/H.': 'Tethers (T/H)',
        'Tail Marker .healer.': 'Tail Marker (healer)',
        'Tail Marker .tank.': 'Tail Marker (healer)',
        'Tail Marker .dps.': 'Tail Marker (dps)',
        'Tail Marker .T/H.': 'Tail Marker (T/H)',
        'Cocoon Markers': 'Cocoon Markers',
        'Benighting / Wormwail': 'Benighting / Wormwail',
        'Reiyu Adds': 'Reiyu Adds',
        'First Wing': 'First Wing',
        'Second Wing': 'Second Wing',
        'TAP BUTTON OR ELSE': 'TAP BUTTON OR ELSE',
        'Gyre Charge': 'Gyre Charge',
        'Phase 2': 'Phase 2',
        'Phase 3': 'Phase 4',
        'Phase 4': 'Phase 4',
      },
      '~effectNames': {
        'Affixed': 'しがみつき',
        'Burning Chains': '炎の鎖',
        'Burns': '火傷',
        'Deep Freeze': '氷結',
        'Doom': '死の宣告',
        'Electrocution': '感電',
        'Fetters': '拘束',
        'Fire Resistance Up': '火属性耐性向上',
        'HP Boost': '最大ＨＰアップ',
        'Legendary Resolve': '神話決戦',
        'Lightning Resistance Down II': '雷属性耐性低下［強］',
        'Magic Vulnerability Up': '被魔法ダメージ増加',
        'Physical Vulnerability Up': '被物理ダメージ増加',
        'Poison': '毒',
        'Rehabilitation': '徐々にＨＰ回復',
        'Sludge': '汚泥',
        'Stun': 'スタン',
        'The Worm\'s Curse': '龍の呪言',
        'Thin Ice': '氷床',
      },
    },
  ],
}];
