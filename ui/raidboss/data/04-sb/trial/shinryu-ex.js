'use strict';

// Shinryu Extreme
[{
  zoneRegex: /^The Minstrel's Ballad: Shinryu's Domain$/,
  timelineFile: 'shinryu-ex.txt',
  triggers: [
    {
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
        'Tethers$': 'Verbindungen',
        'Tethers .healers.': 'Verbindungen (Heiler)',
        'Tethers .T/H.': 'Verbindungen (T/H)',
        'Tail Marker .healer.': 'Schweifmarker (Heiler)',
        'Tail Marker .tank.': 'Schweifmarker (Heiler)',
        'Tail Marker .dps.': 'Schweifmarker (DPS)',
        'Tail Marker .T/H.': 'Schweifmarker (T/H)',
        'Cocoon Markers': 'Kokon Marker',
        'Benighting / Wormwail': 'Dunkelhauch / Shinryus Ruf',
        'Reiyu Adds': 'Reiyu Adds',
        'First Wing': 'Erster Flügel',
        'Second Wing': 'Zweiter Flügel',
        'TAP BUTTON OR ELSE': 'DRÜCKE TASTEN ETC',
        'Gyre Charge': 'Wirbel-Aufladung',
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
