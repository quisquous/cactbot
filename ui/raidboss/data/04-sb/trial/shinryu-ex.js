'use strict';

// Shinryu Extreme
[{
  zoneRegex: /^The Minstrel's Ballad: Shinryu's Domain$/,
  timelineFile: 'shinryu-ex.txt',
  triggers: [
    {
      id: 'ShinryuEx Heart Cleanup',
      regex: Regexes.removingCombatant({ name: 'Shinryu', capture: false }),
      regexDe: Regexes.removingCombatant({ name: 'Shinryu', capture: false }),
      regexFr: Regexes.removingCombatant({ name: 'Shinryu', capture: false }),
      regexJa: Regexes.removingCombatant({ name: '神龍', capture: false }),
      regexCn: Regexes.removingCombatant({ name: '神龙', capture: false }),
      regexKo: Regexes.removingCombatant({ name: '신룡', capture: false }),
      run: function(data) {
        // Explicitly clear so ugly heart message doesn't appear after wipe.
        delete data.phase;
      },
    },
    {
      id: 'ShinryuEx Phase 1',
      regex: Regexes.startsUsing({ id: '25DE', source: 'Shinryu', capture: false }),
      regexDe: Regexes.startsUsing({ id: '25DE', source: 'Shinryu', capture: false }),
      regexFr: Regexes.startsUsing({ id: '25DE', source: 'Shinryu', capture: false }),
      regexJa: Regexes.startsUsing({ id: '25DE', source: '神龍', capture: false }),
      regexCn: Regexes.startsUsing({ id: '25DE', source: '神龙', capture: false }),
      regexKo: Regexes.startsUsing({ id: '25DE', source: '신룡', capture: false }),
      run: function(data) {
        data.phase = 1;
      },
    },
    {
      id: 'ShinryuEx Phase 2',
      regex: Regexes.startsUsing({ id: '25E7', source: 'Shinryu', capture: false }),
      regexDe: Regexes.startsUsing({ id: '25E7', source: 'Shinryu', capture: false }),
      regexFr: Regexes.startsUsing({ id: '25E7', source: 'Shinryu', capture: false }),
      regexJa: Regexes.startsUsing({ id: '25E7', source: '神龍', capture: false }),
      regexCn: Regexes.startsUsing({ id: '25E7', source: '神龙', capture: false }),
      regexKo: Regexes.startsUsing({ id: '25E7', source: '신룡', capture: false }),
      run: function(data) {
        data.phase = 2;
      },
    },
    {
      id: 'ShinryuEx Phase 3',
      regex: Regexes.startsUsing({ id: '25E4', source: 'Shinryu', capture: false }),
      regexDe: Regexes.startsUsing({ id: '25E4', source: 'Shinryu', capture: false }),
      regexFr: Regexes.startsUsing({ id: '25E4', source: 'Shinryu', capture: false }),
      regexJa: Regexes.startsUsing({ id: '25E4', source: '神龍', capture: false }),
      regexCn: Regexes.startsUsing({ id: '25E4', source: '神龙', capture: false }),
      regexKo: Regexes.startsUsing({ id: '25E4', source: '신룡', capture: false }),
      run: function(data) {
        data.phase = 3;
      },
    },
    {
      id: 'ShinryuEx Phase 4',
      regex: Regexes.startsUsing({ id: '264E', source: 'Shinryu', capture: false }),
      regexDe: Regexes.startsUsing({ id: '264E', source: 'Shinryu', capture: false }),
      regexFr: Regexes.startsUsing({ id: '264E', source: 'Shinryu', capture: false }),
      regexJa: Regexes.startsUsing({ id: '264E', source: '神龍', capture: false }),
      regexCn: Regexes.startsUsing({ id: '264E', source: '神龙', capture: false }),
      regexKo: Regexes.startsUsing({ id: '264E', source: '신룡', capture: false }),
      run: function(data) {
        data.phase = 4;
      },
    },
    {
      id: 'ShinryuEx Akh Morn',
      regex: Regexes.startsUsing({ id: '25F3', source: 'Shinryu' }),
      regexDe: Regexes.startsUsing({ id: '25F3', source: 'Shinryu' }),
      regexFr: Regexes.startsUsing({ id: '25F3', source: 'Shinryu' }),
      regexJa: Regexes.startsUsing({ id: '25F3', source: '神龍' }),
      regexCn: Regexes.startsUsing({ id: '25F3', source: '神龙' }),
      regexKo: Regexes.startsUsing({ id: '25F3', source: '신룡' }),
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Akh Morn on YOU',
            de: 'Akh Morn auf DIR',
          };
        } else if (data.role == 'tank') {
          return {
            en: 'Akh Morn on ' + matches.target,
            de: 'Akh Morn auf ' + matches.target,
          };
        }
      },
      infoText: function(data, matches) {
        if (matches.target == data.me || data.role == 'tank')
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
      regex: Regexes.startsUsing({ id: '25DD', source: 'Shinryu', capture: false }),
      regexDe: Regexes.startsUsing({ id: '25DD', source: 'Shinryu', capture: false }),
      regexFr: Regexes.startsUsing({ id: '25DD', source: 'Shinryu', capture: false }),
      regexJa: Regexes.startsUsing({ id: '25DD', source: '神龍', capture: false }),
      regexCn: Regexes.startsUsing({ id: '25DD', source: '神龙', capture: false }),
      regexKo: Regexes.startsUsing({ id: '25DD', source: '신룡', capture: false }),
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
      regex: Regexes.startsUsing({ id: '2611', source: 'Shinryu', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2611', source: 'Shinryu', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2611', source: 'Shinryu', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2611', source: '神龍', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2611', source: '神龙', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2611', source: '신룡', capture: false }),
      infoText: {
        en: 'Out of middle',
        de: 'Raus aus der Mitte',
      },
    },
    {
      id: 'ShinryuEx Hellfire',
      regex: Regexes.startsUsing({ id: '25DB', source: 'Shinryu', capture: false }),
      regexDe: Regexes.startsUsing({ id: '25DB', source: 'Shinryu', capture: false }),
      regexFr: Regexes.startsUsing({ id: '25DB', source: 'Shinryu', capture: false }),
      regexJa: Regexes.startsUsing({ id: '25DB', source: '神龍', capture: false }),
      regexCn: Regexes.startsUsing({ id: '25DB', source: '神龙', capture: false }),
      regexKo: Regexes.startsUsing({ id: '25DB', source: '신룡', capture: false }),
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
      regex: Regexes.startsUsing({ id: ['271F', '25E8'], source: 'Right Wing', capture: false }),
      regexDe: Regexes.startsUsing({ id: ['271F', '25E8'], source: 'Recht(?:e|er|es|en) Schwinge', capture: false }),
      regexFr: Regexes.startsUsing({ id: ['271F', '25E8'], source: 'Aile Droite', capture: false }),
      regexJa: Regexes.startsUsing({ id: ['271F', '25E8'], source: 'ライトウィング', capture: false }),
      regexCn: Regexes.startsUsing({ id: ['271F', '25E8'], source: '右翼', capture: false }),
      regexKo: Regexes.startsUsing({ id: ['271F', '25E8'], source: '오른쪽 날개', capture: false }),
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
      regex: Regexes.startsUsing({ id: '25DC', source: 'Shinryu', capture: false }),
      regexDe: Regexes.startsUsing({ id: '25DC', source: 'Shinryu', capture: false }),
      regexFr: Regexes.startsUsing({ id: '25DC', source: 'Shinryu', capture: false }),
      regexJa: Regexes.startsUsing({ id: '25DC', source: '神龍', capture: false }),
      regexCn: Regexes.startsUsing({ id: '25DC', source: '神龙', capture: false }),
      regexKo: Regexes.startsUsing({ id: '25DC', source: '신룡', capture: false }),
      durationSeconds: 7,
      alertText: {
        en: 'out of water',
        de: 'Raus aus dem Wasser',
      },
    },
    {
      id: 'ShinryuEx Levinbolt',
      regex: Regexes.startsUsing({ id: ['25EA', '2720', '2725'], source: 'Right Wing', target: 'Right Wing', capture: false }),
      regexDe: Regexes.startsUsing({ id: ['25EA', '2720', '2725'], source: 'Recht(?:e|er|es|en) Schwinge', target: 'Recht(?:e|er|es|en) Schwinge', capture: false }),
      regexFr: Regexes.startsUsing({ id: ['25EA', '2720', '2725'], source: 'Aile Droite', target: 'Aile Droite', capture: false }),
      regexJa: Regexes.startsUsing({ id: ['25EA', '2720', '2725'], source: 'ライトウィング', target: 'ライトウィング', capture: false }),
      regexCn: Regexes.startsUsing({ id: ['25EA', '2720', '2725'], source: '右翼', target: '右翼', capture: false }),
      regexKo: Regexes.startsUsing({ id: ['25EA', '2720', '2725'], source: '오른쪽 날개', target: '오른쪽 날개', capture: false }),
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
      regex: Regexes.startsUsing({ id: ['25EA', '2720', '2725'], source: 'Right Wing', target: 'Right Wing', capture: false }),
      regexDe: Regexes.startsUsing({ id: ['25EA', '2720', '2725'], source: 'Recht(?:e|er|es|en) Schwinge', target: 'Recht(?:e|er|es|en) Schwinge', capture: false }),
      regexFr: Regexes.startsUsing({ id: ['25EA', '2720', '2725'], source: 'Aile Droite', target: 'Aile Droite', capture: false }),
      regexJa: Regexes.startsUsing({ id: ['25EA', '2720', '2725'], source: 'ライトウィング', target: 'ライトウィング', capture: false }),
      regexCn: Regexes.startsUsing({ id: ['25EA', '2720', '2725'], source: '右翼', target: '右翼', capture: false }),
      regexKo: Regexes.startsUsing({ id: ['25EA', '2720', '2725'], source: '오른쪽 날개', target: '오른쪽 날개', capture: false }),
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
      id: 'ShinryuEx Icicle Left',
      regex: Regexes.abilityFull({ id: '25EF', source: 'Icicle', x: '-29\\.99', y: '-15', capture: false }),
      regexDe: Regexes.abilityFull({ id: '25EF', source: 'Eiszapfen', x: '-29\\.99', y: '-15', capture: false }),
      regexFr: Regexes.abilityFull({ id: '25EF', source: 'Stalactite', x: '-29\\.99', y: '-15', capture: false }),
      regexJa: Regexes.abilityFull({ id: '25EF', source: 'アイシクル', x: '-29\\.99', y: '-15', capture: false }),
      regexCn: Regexes.abilityFull({ id: '25EF', source: '冰柱', x: '-29\\.99', y: '-15', capture: false }),
      regexKo: Regexes.abilityFull({ id: '25EF', source: '고드름', x: '-29\\.99', y: '-15', capture: false }),
      alarmText: {
        en: 'icicle, lean west',
        de: 'Eiszapfen, nach westen',
      },
    },
    {
      id: 'ShinryuEx Icicle Right',
      regex: Regexes.abilityFull({ id: '25EF', source: 'Icicle', x: '-29\\.99', y: '-25', capture: false }),
      regexDe: Regexes.abilityFull({ id: '25EF', source: 'Eiszapfen', x: '-29\\.99', y: '-25', capture: false }),
      regexFr: Regexes.abilityFull({ id: '25EF', source: 'Stalactite', x: '-29\\.99', y: '-25', capture: false }),
      regexJa: Regexes.abilityFull({ id: '25EF', source: 'アイシクル', x: '-29\\.99', y: '-25', capture: false }),
      regexCn: Regexes.abilityFull({ id: '25EF', source: '冰柱', x: '-29\\.99', y: '-25', capture: false }),
      regexKo: Regexes.abilityFull({ id: '25EF', source: '고드름', x: '-29\\.99', y: '-25', capture: false }),
      alarmText: {
        en: 'icicle, lean east',
        de: 'Eiszapfen, nach Osten',
      },
    },
    {
      id: 'ShinryuEx Tidal Wave',
      regex: Regexes.startsUsing({ id: '25DA', source: 'Shinryu', capture: false }),
      regexDe: Regexes.startsUsing({ id: '25DA', source: 'Shinryu', capture: false }),
      regexFr: Regexes.startsUsing({ id: '25DA', source: 'Shinryu', capture: false }),
      regexJa: Regexes.startsUsing({ id: '25DA', source: '神龍', capture: false }),
      regexCn: Regexes.startsUsing({ id: '25DA', source: '神龙', capture: false }),
      regexKo: Regexes.startsUsing({ id: '25DA', source: '신룡', capture: false }),
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
      regex: Regexes.startsUsing({ id: '264E', source: 'Shinryu', capture: false }),
      regexDe: Regexes.startsUsing({ id: '264E', source: 'Shinryu', capture: false }),
      regexFr: Regexes.startsUsing({ id: '264E', source: 'Shinryu', capture: false }),
      regexJa: Regexes.startsUsing({ id: '264E', source: '神龍', capture: false }),
      regexCn: Regexes.startsUsing({ id: '264E', source: '神龙', capture: false }),
      regexKo: Regexes.startsUsing({ id: '264E', source: '신룡', capture: false }),
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
      regex: Regexes.startsUsing({ id: '25E2', source: 'Tail', capture: false }),
      regexDe: Regexes.startsUsing({ id: '25E2', source: 'Schwanz', capture: false }),
      regexFr: Regexes.startsUsing({ id: '25E2', source: 'Queue', capture: false }),
      regexJa: Regexes.startsUsing({ id: '25E2', source: '神龍の尾', capture: false }),
      regexCn: Regexes.startsUsing({ id: '25E2', source: '龙尾', capture: false }),
      regexKo: Regexes.startsUsing({ id: '25E2', source: '신룡의 꼬리', capture: false }),
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
      regex: Regexes.addedCombatant({ name: 'The Worm\'s Heart', capture: false }),
      regexDe: Regexes.addedCombatant({ name: 'Shinryus Herz', capture: false }),
      regexFr: Regexes.addedCombatant({ name: 'Cœur Du Dragon', capture: false }),
      regexJa: Regexes.addedCombatant({ name: '神龍の心核', capture: false }),
      regexCn: Regexes.addedCombatant({ name: '神龙的核心', capture: false }),
      regexKo: Regexes.addedCombatant({ name: '신룡의 심핵', capture: false }),
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
      regex: Regexes.startsUsing({ id: ['1FA8', '1FF4', '2603'], source: 'Shinryu', capture: false }),
      regexDe: Regexes.startsUsing({ id: ['1FA8', '1FF4', '2603'], source: 'Shinryu', capture: false }),
      regexFr: Regexes.startsUsing({ id: ['1FA8', '1FF4', '2603'], source: 'Shinryu', capture: false }),
      regexJa: Regexes.startsUsing({ id: ['1FA8', '1FF4', '2603'], source: '神龍', capture: false }),
      regexCn: Regexes.startsUsing({ id: ['1FA8', '1FF4', '2603'], source: '神龙', capture: false }),
      regexKo: Regexes.startsUsing({ id: ['1FA8', '1FF4', '2603'], source: '신룡', capture: false }),
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
      regex: Regexes.startsUsing({ id: '260A', source: 'Hakkinryu' }),
      regexDe: Regexes.startsUsing({ id: '260A', source: 'Hakkinryu' }),
      regexFr: Regexes.startsUsing({ id: '260A', source: 'Hakkinryu' }),
      regexJa: Regexes.startsUsing({ id: '260A', source: '白金龍' }),
      regexCn: Regexes.startsUsing({ id: '260A', source: '白金龙' }),
      regexKo: Regexes.startsUsing({ id: '260A', source: '백금룡' }),
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Death Sentence on YOU',
            de: 'Todesurteil auf DIR',
          };
        } else if (data.role == 'healer') {
          return {
            en: 'Death Sentence on ' + matches.target,
            de: 'Todesurteil auf ' + matches.target,
          };
        }
      },
      infoText: function(data, matches) {
        if (matches.target != data.me && data.role == 'tank') {
          return {
            en: 'Death Sentence on ' + matches.target,
            de: 'Todesurteil auf ' + matches.target,
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
      regex: Regexes.startsUsing({ id: '264B', source: 'Shinryu' }),
      regexDe: Regexes.startsUsing({ id: '264B', source: 'Shinryu' }),
      regexFr: Regexes.startsUsing({ id: '264B', source: 'Shinryu' }),
      regexJa: Regexes.startsUsing({ id: '264B', source: '神龍' }),
      regexCn: Regexes.startsUsing({ id: '264B', source: '神龙' }),
      regexKo: Regexes.startsUsing({ id: '264B', source: '신룡' }),
      alertText: function(data, matches) {
        if (matches.target == data.me) {
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
            en: 'Tank Buster on ' + matches.target,
            de: 'Tankbuster auf ' + matches.target,
          };
        }
      },
      tts: function(data, matches) {
        if (matches.target == data.me || data.role == 'healer') {
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
      regex: Regexes.startsUsing({ id: '2648', source: 'Shinryu', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2648', source: 'Shinryu', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2648', source: 'Shinryu', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2648', source: '神龍', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2648', source: '神龙', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2648', source: '신룡', capture: false }),
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
      regex: Regexes.startsUsing({ id: '264A', source: 'Shinryu', capture: false }),
      regexDe: Regexes.startsUsing({ id: '264A', source: 'Shinryu', capture: false }),
      regexFr: Regexes.startsUsing({ id: '264A', source: 'Shinryu', capture: false }),
      regexJa: Regexes.startsUsing({ id: '264A', source: '神龍', capture: false }),
      regexCn: Regexes.startsUsing({ id: '264A', source: '神龙', capture: false }),
      regexKo: Regexes.startsUsing({ id: '264A', source: '신룡', capture: false }),
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
      regex: Regexes.startsUsing({ id: '2718', source: 'Left Wing', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2718', source: 'Link(?:e|er|es|en) Schwinge', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2718', source: 'Aile Gauche', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2718', source: 'レフトウィング', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2718', source: '左翼', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2718', source: '왼쪽 날개', capture: false }),
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
      regex: Regexes.startsUsing({ id: '2719', source: 'Right Wing', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2719', source: 'Recht(?:e|er|es|en) Schwinge', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2719', source: 'Aile Droite', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2719', source: 'ライトウィング', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2719', source: '右翼', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2719', source: '오른쪽 날개', capture: false }),
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
      regex: Regexes.headMarker({ id: '0061' }),
      condition: function(data, matches) {
        return matches.target == data.me;
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
      regex: Regexes.headMarker({ id: '007E' }),
      condition: function(data, matches) {
        return matches.target == data.me;
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
      regex: Regexes.headMarker({ id: '0028' }),
      condition: function(data, matches) {
        data.shakerTargets = data.shakerTargets || [];
        data.shakerTargets.push(matches.target);
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
      regex: Regexes.headMarker({ id: '0039' }),
      condition: function(data, matches) {
        return matches.target == data.me;
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
        'Ginryu': 'Ginryu',
        'Hakkinryu': 'Hakkinryu',
        'Left Wing': 'link(?:e|er|es|en) Schwinge',
        'Right Wing': 'recht(?:e|er|es|en) Schwinge',
        'Shinryu': 'Shinryu',
        'Tail': 'Schwanz',
        'The Worm\'s Heart': 'Shinryus Herz',
      },
      'replaceText': {
        'Aerial Blast': 'Windschlag',
        'Aetherial Ray': 'Ätherstrahl',
        'Akh Morn': 'Akh Morn',
        'Akh Rhai': 'Akh Rhai',
        'Atomic Ray': 'Atomstrahlung',
        'Benighting / Wormwail': 'Dunkelhauch / Shinryus Ruf',
        'Benighting Breath': 'Dunkelhauch',
        'Blazing Trail': 'Feuerschweif',
        'Cocoon Markers': 'Kokon Marker',
        'Dark Matter': 'Dunkelmaterie',
        'Death Sentence': 'Todesurteil',
        'Diamond Dust': 'Diamantenstaub',
        'Dragonfist': 'Drachenfaust',
        'Dragonflight': 'Drachenflug',
        'Earth Breath': 'Erdatem',
        'Earthen Fury': 'Gaias Zorn',
        'Fireball': 'Feuerball',
        'First Wing': 'Erster Flügel',
        'Gyre Charge': 'Wirbel-Aufladung',
        'Hellfire': 'Höllenfeuer',
        'Hypernova': 'Supernova',
        'Ice Storm': 'Eissturm',
        'Icicle Impact': 'Eiszapfen-Schlag',
        'Judgment Bolt': 'Ionenschlag',
        'Levinbolt': 'Keraunisches Feld',
        'Meteor Impact': 'Meteoreinschlag',
        'Phase': 'Phase',
        'Protostar': 'Protostern',
        'Reiyu Adds': 'Reiyu Adds',
        'Second Wing': 'Zweiter Flügel',
        'Shatter': 'Zerfallen',
        'Spiked Tail': 'Stachelschweif',
        'Spikesicle': 'Eislanze',
        'Summon Icicle': 'Flugeis',
        'Super Cyclone': 'Superzyklon',
        'TAP BUTTON OR ELSE': 'DRÜCKE TASTEN ETC',
        'Tail Marker': 'Schweifmarker',
        'Tail Slap': 'Schweifklapser',
        'Tail Spit': 'Schweifspieß',
        'Tera Slash': 'Tera-Schlag',
        'Tethers': 'Verbindungen',
        'Tidal Wave': 'Flutwelle',
        'Touchdown': 'Himmelssturz',
      },
      '~effectNames': {
        'Affixed': 'Angekrallt',
        'Burning Chains': 'Brennende Ketten',
        'Burns': 'Brandwunde',
        'Deep Freeze': 'Tiefkühlung',
        'Doom': 'Verhängnis',
        'Electrocution': 'Stromschlag',
        'Fetters': 'Fesselung',
        'Fire Resistance Up': 'Feuerresistenz +',
        'HP Boost': 'LP-Bonus',
        'Legendary Resolve': 'Mythischer Endkampf',
        'Lightning Resistance Down II': 'Blitzresistenz - (stark)',
        'Magic Vulnerability Up': 'Erhöhte Magie-Verwundbarkeit',
        'Physical Vulnerability Up': 'Erhöhte physische Verwundbarkeit',
        'Poison': 'Gift',
        'Rehabilitation': 'Rehabilitation',
        'Sludge': 'Schlamm',
        'Stun': 'Betäubung',
        'Tethers': 'Verbindungen',
        'The Worm\'s Curse': 'Fluch des Drachen',
        'Thin Ice': 'Glatteis',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Cocoon': 'cocon de lumière',
        'Ginryu': 'ginryu',
        'Hakkinryu': 'hakkinryu',
        'Left Wing': 'aile gauche',
        'Right Wing': 'aile droite',
        'Shinryu': 'Shinryu',
        'Tail': 'queue',
        'The Worm\'s Heart': 'cœur du dragon',
      },
      'replaceText': {
        'Aerial Blast': 'Rafale aérienne',
        'Aetherial Ray': 'Rayon éthéré',
        'Akh Morn': 'Akh Morn',
        'Akh Rhai': 'Akh Rhai',
        'Atomic Ray': 'Rayon atomique',
        'Benighting / Wormwail': 'Benighting / Wormwail', // FIXME
        'Benighting Breath': 'Souffle enténébrant',
        'Blazing Trail': 'Trace embrasée',
        'Cocoon Markers': 'Cocoon Markers', // FIXME
        'Dark Matter': 'Matière sombre',
        'Death Sentence': 'Peine de mort',
        'Diamond Dust': 'Poussière de diamant',
        'Dragonfist': 'Poing dragon',
        'Dragonflight': 'Vol du dragon',
        'Earth Breath': 'Souffle de terre',
        'Earthen Fury': 'Fureur tellurique',
        'Fireball': 'Boule de feu',
        'First Wing': 'First Wing', // FIXME
        'Gyre Charge': 'Gyrocharge',
        'Hellfire': 'Flammes de l\'enfer',
        'Hypernova': 'Hypernova',
        'Ice Storm': 'Tempête de glace',
        'Icicle Impact': 'Impact de stalactite',
        'Judgment Bolt': 'Éclair du jugement',
        'Levinbolt': 'Fulguration',
        'Meteor Impact': 'Impact de météore',
        'Phase': 'Phase', // FIXME
        'Protostar': 'Proto-étoile',
        'Reiyu Adds': 'Reiyu Adds', // FIXME
        'Second Wing': 'Second Wing', // FIXME
        'Shatter': 'Éclatement',
        'Spiked Tail': 'Queue barbelée',
        'Spikesicle': 'Stalactopointe',
        'Summon Icicle': 'Appel de stalactite',
        'Super Cyclone': 'Super cyclone',
        'TAP BUTTON OR ELSE': 'TAP BUTTON OR ELSE', // FIXME
        'Tail Marker': 'Tail Marker', // FIXME
        'Tail Slap': 'Gifle caudale',
        'Tail Spit': 'Broche caudale',
        'Tera Slash': 'TéraTaillade',
        'Tethers': 'Tethers', // FIXME
        'Tidal Wave': 'Raz-de-marée',
        'Touchdown': 'Atterrissage',
      },
      '~effectNames': {
        'Affixed': 'Étreinte',
        'Burning Chains': 'Chaînes brûlantes',
        'Burns': 'Brûlure',
        'Deep Freeze': 'Congélation',
        'Doom': 'Glas',
        'Electrocution': 'Électrocution',
        'Fetters': 'Attache',
        'Fire Resistance Up': 'Résistance au feu accrue',
        'HP Boost': 'Bonus de PV',
        'Legendary Resolve': 'Combat épique',
        'Lightning Resistance Down II': 'Résistance à la foudre réduite+',
        'Magic Vulnerability Up': 'Vulnérabilité magique augmentée',
        'Physical Vulnerability Up': 'Vulnérabilité physique augmentée',
        'Poison': 'Poison',
        'Rehabilitation': 'Recouvrement',
        'Sludge': 'Emboué',
        'Stun': 'Étourdissement',
        'Tethers': 'Tethers', // FIXME
        'The Worm\'s Curse': 'Malédiction du dragon',
        'Thin Ice': 'Verglas',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Cocoon': '光の繭',
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
        'Benighting / Wormwail': 'Benighting / Wormwail', // FIXME
        'Benighting Breath': 'ダークネスブレス',
        'Blazing Trail': 'ブレイジングトレイル',
        'Cocoon Markers': 'Cocoon Markers', // FIXME
        'Dark Matter': 'ダークマター',
        'Death Sentence': 'デスセンテンス',
        'Diamond Dust': 'ダイアモンドダスト',
        'Dragonfist': '龍掌',
        'Dragonflight': '昇竜',
        'Earth Breath': 'アースブレス',
        'Earthen Fury': '大地の怒り',
        'Fireball': 'ファイアボール',
        'First Wing': 'First Wing', // FIXME
        'Gyre Charge': 'ジャイヤチャージ',
        'Hellfire': '地獄の火炎',
        'Hypernova': 'スーパーノヴァ',
        'Ice Storm': '吹雪',
        'Icicle Impact': 'アイシクルインパクト',
        'Judgment Bolt': '裁きの雷',
        'Levinbolt': '稲妻',
        'Meteor Impact': 'メテオインパクト',
        'Phase': 'Phase', // FIXME
        'Protostar': 'プロトスター',
        'Reiyu Adds': 'Reiyu Adds', // FIXME
        'Second Wing': 'Second Wing', // FIXME
        'Shatter': '破砕',
        'Spiked Tail': 'スパイクテール',
        'Spikesicle': 'アイシクルスパイク',
        'Summon Icicle': 'サモン・アイシクル',
        'Super Cyclone': 'スーパーサイクロン',
        'TAP BUTTON OR ELSE': 'TAP BUTTON OR ELSE', // FIXME
        'Tail Marker': 'Tail Marker', // FIXME
        'Tail Slap': 'テールスラップ',
        'Tail Spit': 'テールスピット',
        'Tera Slash': 'テラスラッシュ',
        'Tethers': 'Tethers', // FIXME
        'Tidal Wave': 'タイダルウェイブ',
        'Touchdown': 'タッチダウン',
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
        'Tethers': 'Tethers', // FIXME
        'The Worm\'s Curse': '龍の呪言',
        'Thin Ice': '氷床',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Cocoon': '光茧',
        'Ginryu': '银龙',
        'Hakkinryu': '白金龙',
        'Left Wing': '左翼',
        'Right Wing': '右翼',
        'Shinryu': '神龙',
        'Tail': '龙尾',
        'The Worm\'s Heart': '神龙的核心',
      },
      'replaceText': {
        'Aerial Blast': '大气爆发',
        'Aetherial Ray': '以太射线',
        'Akh Morn': '死亡轮回',
        'Akh Rhai': '天光轮回',
        'Atomic Ray': '原子射线',
        'Benighting / Wormwail': 'Benighting / Wormwail', // FIXME
        'Benighting Breath': '黑暗吐息',
        'Blazing Trail': '炽热弥漫',
        'Cocoon Markers': 'Cocoon Markers', // FIXME
        'Dark Matter': '暗物质',
        'Death Sentence': '死刑',
        'Diamond Dust': '钻石星尘',
        'Dragonfist': '龙掌',
        'Dragonflight': '龙腾',
        'Earth Breath': '大地吐息',
        'Earthen Fury': '大地之怒',
        'Fireball': '火球',
        'First Wing': 'First Wing', // FIXME
        'Gyre Charge': '螺旋冲锋',
        'Hellfire': '地狱之火炎',
        'Hypernova': '超新星',
        'Ice Storm': '吹雪',
        'Icicle Impact': '冰柱冲击',
        'Judgment Bolt': '制裁之雷',
        'Levinbolt': '闪电',
        'Meteor Impact': '陨石冲击',
        'Phase': 'Phase', // FIXME
        'Protostar': '原恒星',
        'Reiyu Adds': 'Reiyu Adds', // FIXME
        'Second Wing': 'Second Wing', // FIXME
        'Shatter': '破碎',
        'Spiked Tail': '刺尾',
        'Spikesicle': '冰柱突刺',
        'Summon Icicle': '召唤冰柱',
        'Super Cyclone': '超级气旋',
        'TAP BUTTON OR ELSE': 'TAP BUTTON OR ELSE', // FIXME
        'Tail Marker': 'Tail Marker', // FIXME
        'Tail Slap': '尾部猛击',
        'Tail Spit': '尾部重击',
        'Tera Slash': '万亿斩击',
        'Tethers': 'Tethers', // FIXME
        'Tidal Wave': '巨浪',
        'Touchdown': '空降',
      },
      '~effectNames': {
        'Affixed': '紧抱',
        'Burning Chains': '火焰链',
        'Burns': '火伤',
        'Deep Freeze': '冻结',
        'Doom': '死亡宣告',
        'Electrocution': '感电',
        'Fetters': '拘束',
        'Fire Resistance Up': '火属性耐性提升',
        'HP Boost': '体力增加',
        'Legendary Resolve': '神话决战',
        'Lightning Resistance Down II': '雷属性耐性大幅降低',
        'Magic Vulnerability Up': '魔法受伤加重',
        'Physical Vulnerability Up': '物理受伤加重',
        'Poison': '中毒',
        'Rehabilitation': '体力持续恢复',
        'Sludge': '污泥',
        'Stun': '眩晕',
        'Tethers': 'Tethers', // FIXME
        'The Worm\'s Curse': '神龙诅咒',
        'Thin Ice': '冰面',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Cocoon': '빛의 고치',
        'Ginryu': '은룡',
        'Hakkinryu': '백금룡',
        'Left Wing': '왼쪽 날개',
        'Right Wing': '오른쪽 날개',
        'Shinryu': '신룡',
        'Tail': '신룡의 꼬리',
        'The Worm\'s Heart': '신룡의 심핵',
      },
      'replaceText': {
        'Aerial Blast': '대기 폭발',
        'Aetherial Ray': '에테르 광선',
        'Akh Morn': '아크 몬',
        'Akh Rhai': '아크 라이',
        'Atomic Ray': '원자 파동',
        'Benighting / Wormwail': 'Benighting / Wormwail', // FIXME
        'Benighting Breath': '어둠의 숨결',
        'Blazing Trail': '작열지옥',
        'Cocoon Markers': 'Cocoon Markers', // FIXME
        'Dark Matter': '암흑물질',
        'Death Sentence': '사형 선고',
        'Diamond Dust': '다이아몬드 더스트',
        'Dragonfist': '용의 손바닥',
        'Dragonflight': '용의 비행',
        'Earth Breath': '대지의 숨결',
        'Earthen Fury': '대지의 분노',
        'Fireball': '화염구',
        'First Wing': 'First Wing', // FIXME
        'Gyre Charge': '회전 돌진',
        'Hellfire': '지옥의 화염',
        'Hypernova': '초신성',
        'Ice Storm': '눈보라',
        'Icicle Impact': '고드름 낙하',
        'Judgment Bolt': '심판의 벼락',
        'Levinbolt': '우레',
        'Meteor Impact': '운석 낙하',
        'Phase': 'Phase', // FIXME
        'Protostar': '원시별',
        'Reiyu Adds': 'Reiyu Adds', // FIXME
        'Second Wing': 'Second Wing', // FIXME
        'Shatter': '파쇄',
        'Spiked Tail': '독가시 꼬리',
        'Spikesicle': '고드름 돌진',
        'Summon Icicle': '고드름 소환',
        'Super Cyclone': '대형 돌개바람',
        'TAP BUTTON OR ELSE': 'TAP BUTTON OR ELSE', // FIXME
        'Tail Marker': 'Tail Marker', // FIXME
        'Tail Slap': '꼬리치기',
        'Tail Spit': '꼬리 찌르기',
        'Tera Slash': '테라 슬래시',
        'Tethers': 'Tethers', // FIXME
        'Tidal Wave': '해일',
        'Touchdown': '착지',
      },
      '~effectNames': {
        'Affixed': '매달리기',
        'Burning Chains': '화염 사슬',
        'Burns': '화상',
        'Deep Freeze': '빙결',
        'Doom': '죽음의 선고',
        'Electrocution': '감전',
        'Fetters': '구속',
        'Fire Resistance Up': '불속성 저항 상승',
        'HP Boost': '최대 HP 증가',
        'Legendary Resolve': '신화 결전',
        'Lightning Resistance Down II': '번개속성 저항 감소[강]',
        'Magic Vulnerability Up': '받는 마법 피해량 증가',
        'Physical Vulnerability Up': '받는 물리 피해량 증가',
        'Poison': '독',
        'Rehabilitation': '서서히 HP 회복',
        'Sludge': '진흙탕',
        'Stun': '기절',
        'Tethers': 'Tethers', // FIXME
        'The Worm\'s Curse': '용의 저주',
        'Thin Ice': '얼음 바닥',
      },
    },
  ],
}];
