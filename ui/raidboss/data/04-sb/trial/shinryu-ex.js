'use strict';

// Shinryu Extreme
[{
  zoneRegex: {
    en: /^The Minstrel's Ballad: Shinryu's Domain$/,
    cn: /^神龙梦幻歼灭战$/,
    ko: /^극 신룡 토벌전$/,
  },
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
            cn: '死亡轮回点名',
            ko: '아크몬 대상자',
          };
        } else if (data.role == 'tank') {
          return {
            en: 'Akh Morn on ' + data.ShortName(matches.target),
            de: 'Akh Morn auf ' + data.ShortName(matches.target),
            cn: '死亡轮回点' + data.ShortName(matches.target),
            ko: '"' + data.ShortName(matches.target) + '" 아크몬',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches.target == data.me || data.role == 'tank')
          return;

        return {
          en: 'Akh Rhai: spread and move',
          de: 'Akh Rhai: Verteilen und bewegen',
          cn: '天光轮回：散开和移动',
          ko: '아크 라이: 산개, 이동',
        };
      },
      tts: {
        en: 'akh morn',
        de: 'akh morn',
        cn: '死亡轮回',
        ko: '아크몬',
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
        cn: '冰地面：站一起和停止移动',
        ko: '얼음: 집합하고 이동하지 않기',
      },
      tts: {
        en: 'stop',
        de: 'stopp',
        cn: '停止',
        ko: '이동하지 않기',
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
        cn: '离开中间',
        ko: '중앙 피하기',
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
        cn: '进水圈',
        ko: '물 장판에 들어가기',
      },
      tts: {
        en: 'water',
        de: 'wasser',
        cn: '进水圈',
        ko: '물 장판',
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
            cn: '停下，冰地面',
            ko: '멈춰서 얼기',
          };
        }
        return {
          en: 'Stack in water',
          de: 'In Wasser stacken',
          cn: '在水圈攻击',
          ko: '물 장판에 모이기',
        };
      },
      tts: function(data) {
        if (data.phase == 3) {
          return {
            en: 'stop to get frozen',
            de: 'Stopp! Einfrieren lassen',
            cn: '停下，冰地面',
            ko: '멈춰서 얼기',
          };
        }
        return {
          en: 'water',
          de: 'Wasser',
          cn: '水圈',
          ko: '물 장판',
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
        cn: '离开水圈',
        ko: '물 장판 밖으로',
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
            cn: '闪电，保持移动',
            ko: '번개 공격 산개, 계속 움직이기',
          };
        }
        return {
          en: 'Spread out, no water',
          de: 'Verteilen und nicht in\'s Wasser',
          cn: '散开，离开水圈',
          ko: '산개, 물장판 X',
        };
      },
      tts: function(data) {
        if (data.phase == 3) {
          return {
            en: 'bait bolt, keep moving',
            de: 'Blitz ködern, weiterbewegen',
            cn: '闪电，保持移动',
            ko: '번개 공격 산개, 계속 움직이기',
          };
        }
        return {
          en: 'levinbolt',
          de: 'Blitz',
          cn: '离开闪电',
          ko: '우레',
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
            cn: '散开',
            ko: '떨어지기',
          };
        }
      },
      tts: function(data) {
        if (data.phase == 3) {
          return {
            en: 'move away',
            de: 'weckbewegen',
            cn: '散开',
            ko: '떨어지기',
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
        cn: '冰柱，去左边',
        ko: '고드름, 왼쪽 먼저',
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
        cn: '冰柱，去右边',
        ko: '고드름, 오른쪽 먼저',
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
        cn: '击退，找水圈',
        ko: '넉백, 물기둥 확인',
      },
      tts: {
        en: 'knockback',
        de: 'Rückstoß',
        cn: '击退',
        ko: '넉백',
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
        cn: '不需要更多奶了',
        ko: '힐 그만',
      },
      tts: {
        en: 'stop healing',
        de: 'keine Heilung mehr',
        cn: '停奶',
        ko: '힐 그만',
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
        cn: '打尾巴',
        ko: '꼬리 공격',
      },
      tts: {
        en: 'tail',
        de: 'schweif',
        cn: '尾巴',
        ko: '꼬리',
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
        cn: '打核心',
        ko: '심핵 공격',
      },
      tts: {
        en: 'heart',
        de: 'herz',
        cn: '核心',
        ko: '심핵',
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
        cn: '前方顺劈',
        ko: '급강하 폭격 피하기',
      },
      tts: {
        en: 'divebombs',
        de: 'sturzflug',
        cn: '顺劈',
        ko: '급강하 폭격',
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
            cn: '死刑点名',
            ko: '사형 선고 대상자',
          };
        } else if (data.role == 'healer') {
          return {
            en: 'Death Sentence on ' + data.ShortName(matches.target),
            de: 'Todesurteil auf ' + data.ShortName(matches.target),
            cn: '死刑点名' + data.ShortName(matches.target),
            ko: '"' + data.ShortName(matches.target) + '" 사형 선고',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches.target != data.me && data.role == 'tank') {
          return {
            en: 'Death Sentence on ' + data.ShortName(matches.target),
            de: 'Todesurteil auf ' + data.ShortName(matches.target),
            cn: '死刑点名' + data.ShortName(matches.target),
            ko: '"' + data.ShortName(matches.target) + '" 사형 선고',
          };
        }
      },
      tts: function(data) {
        if (data.role == 'healer' || data.role == 'tank') {
          return {
            en: 'Death Sentence',
            de: 'Todesurteil',
            cn: '死刑',
            ko: '사형 선고',
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
      response: Responses.tankBusterSwap(),
    },
    {
      id: 'ShinryuEx Wormwail',
      regex: Regexes.startsUsing({ id: '2648', source: 'Shinryu', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2648', source: 'Shinryu', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2648', source: 'Shinryu', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2648', source: '神龍', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2648', source: '神龙', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2648', source: '신룡', capture: false }),
      response: Responses.getUnder(),
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
        cn: '离开正面',
        ko: '범위 밖으로',
      },
      tts: {
        en: 'cleave',
        de: 'klief',
        cn: '顺劈',
        ko: '범위 공격',
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
        cn: '击杀左翼',
        ko: '왼쪽 날개 먼저',
      },
      tts: {
        en: 'left first',
        de: 'links zuerst',
        cn: '击杀左翼',
        ko: '왼쪽 먼저',
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
        cn: '击杀右翼',
        ko: '오른쪽 날개 먼저',
      },
      tts: {
        en: 'right first',
        de: 'rechts zuerst',
        cn: '击杀右翼',
        ko: '오른쪽 날개',
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
            cn: '拉断锁链然后攻击',
            ko: '선 끊고 모이기',
          };
        }
        return {
          en: 'break tethers',
          de: 'Ketten zerreissen',
          cn: '拉断锁链',
          ko: '선 끊기',
        };
      },
      tts: function(data) {
        if (data.phase == 3) {
          return {
            en: 'break tethers then stack',
            de: 'Kette zerreissen, dann stack',
            cn: '拉断锁链然后攻击',
            ko: '선 끊고 모이기',
          };
        }
        return {
          en: 'break tethers',
          de: 'Ketten zerreissen',
          cn: '拉断锁链',
          ko: '선 끊기',
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
        cn: '龙尾点名',
        ko: '꼬리 징 대상자',
      },
      tts: {
        en: 'tail marker',
        de: 'schweif marker',
        cn: '龙尾点名',
        ko: '꼬리 징',
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
            cn: '大地动摇点名',
            ko: '어스 대상자',
          };
        }
      },
      alertText: function(data) {
        if (data.shakerTargets.indexOf(data.me) == -1) {
          return {
            en: 'avoid earthshakers',
            de: 'Stöße ausweichen',
            cn: '远离大地动摇',
            ko: '어스 피하기',
          };
        }
      },
      tts: function(data) {
        if (data.shakerTargets.indexOf(data.me) == -1) {
          return {
            en: 'avoid shakers',
            de: 'Stöße ausweichen',
            cn: '离开点名',
            ko: '어스 피하기',
          };
        }
        return {
          en: 'earthshaker',
          de: 'erdstoß',
          cn: '大地动摇',
          ko: '어스 징',
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
      response: Responses.spread(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Cocoon': 'Lichtsphäre',
        'Ginryu': 'Ginryu',
        'Hakkinryu': 'Hakkinryu',
        'Icicle': 'Eiszapfen',
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
      'missingTranslations': true,
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
        'Benighting Breath': 'Souffle enténébrant',
        'Blazing Trail': 'Trace embrasée',
        'Dark Matter': 'Matière sombre',
        'Death Sentence': 'Peine de mort',
        'Diamond Dust': 'Poussière de diamant',
        'Dragonfist': 'Poing dragon',
        'Dragonflight': 'Vol du dragon',
        'Earth Breath': 'Souffle de terre',
        'Earthen Fury': 'Fureur tellurique',
        'Fireball': 'Boule de feu',
        'Gyre Charge': 'Gyrocharge',
        'Hellfire': 'Flammes de l\'enfer',
        'Hypernova': 'Hypernova',
        'Ice Storm': 'Tempête de glace',
        'Icicle Impact': 'Impact de stalactite',
        'Judgment Bolt': 'Éclair du jugement',
        'Levinbolt': 'Fulguration',
        'Meteor Impact': 'Impact de météore',
        'Protostar': 'Proto-étoile',
        'Shatter': 'Éclatement',
        'Spiked Tail': 'Queue barbelée',
        'Spikesicle': 'Stalactopointe',
        'Summon Icicle': 'Appel de stalactite',
        'Super Cyclone': 'Super cyclone',
        'Tail Slap': 'Gifle caudale',
        'Tail Spit': 'Broche caudale',
        'Tera Slash': 'TéraTaillade',
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
        'The Worm\'s Curse': 'Malédiction du dragon',
        'Thin Ice': 'Verglas',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
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
        'Gyre Charge': 'ジャイヤチャージ',
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
        'Benighting / Wormwail': '黑暗吐息/神龙啸',
        'Benighting Breath': '黑暗吐息',
        'Blazing Trail': '炽热弥漫',
        'Cocoon Markers': '光茧点名',
        'Dark Matter': '暗物质',
        'Death Sentence': '死刑',
        'Diamond Dust': '钻石星尘',
        'Dragonfist': '龙掌',
        'Dragonflight': '龙腾',
        'Earth Breath': '大地吐息',
        'Earthen Fury': '大地之怒',
        'Fireball': '火球',
        'First Wing': '第一只翅膀',
        'Gyre Charge': '螺旋冲锋',
        'Hellfire': '地狱之火炎',
        'Hypernova': '超新星',
        'Ice Storm': '吹雪',
        'Icicle Impact': '冰柱冲击',
        'Judgment Bolt': '制裁之雷',
        'Levinbolt': '闪电',
        'Meteor Impact': '陨石冲击',
        'Phase': '阶段',
        'Protostar': '原恒星',
        'Reiyu Adds': '小怪',
        'Second Wing': '第二只翅膀',
        'Shatter': '破碎',
        'Spiked Tail': '刺尾',
        'Spikesicle': '冰柱突刺',
        'Summon Icicle': '召唤冰柱',
        'Super Cyclone': '超级气旋',
        'TAP BUTTON OR ELSE': 'XJB按',
        'Tail Marker': '尾巴点名',
        'Tail Slap': '尾部猛击',
        'Tail Spit': '尾部重击',
        'Tera Slash': '万亿斩击',
        'Tethers': '连线',
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
        'Tethers': '连线',
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
        'Tail(?! )': '신룡의 꼬리',
        'The Worm\'s Heart': '신룡의 심핵',
      },
      'replaceText': {
        'Aerial Blast': '대기 폭발',
        'Aetherial Ray': '에테르 광선',
        'Akh Morn': '아크 몬',
        'Akh Rhai': '아크 라이',
        'Atomic Ray': '원자 파동',
        'Benighting / Wormwail': '어둠의 숨결 / 신룡의 포효',
        'Benighting Breath': '어둠의 숨결',
        'Blazing Trail': '작열지옥',
        'Cocoon Markers': '빛의 고체 징',
        'Dark Matter': '암흑물질',
        'Death Sentence': '사형 선고',
        'Diamond Dust': '다이아몬드 더스트',
        'Dragonfist': '용의 손바닥',
        'Dragonflight': '용의 비행',
        'Earth Breath': '대지의 숨결',
        'Earthen Fury': '대지의 분노',
        'Fireball': '화염구',
        'First Wing': '첫번째 날개',
        'Gyre Charge': '회전 돌진',
        'Hellfire': '지옥의 화염',
        'Hypernova': '초신성',
        'Ice Storm': '눈보라',
        'Icicle Impact': '고드름 낙하',
        'Judgment Bolt': '심판의 벼락',
        'Levinbolt': '우레',
        'Meteor Impact': '운석 낙하',
        'Phase': '페이즈',
        'Protostar': '원시별',
        'Reiyu Adds': '영룡 쫄',
        'Rhai': '아크 라이',
        'Second Wing': '두번째 날개',
        'Shatter': '파쇄',
        'Spiked Tail': '독가시 꼬리',
        'Spikesicle': '고드름 돌진',
        'Summon Icicle': '고드름 소환',
        'Super Cyclone': '대형 돌개바람',
        'TAP BUTTON OR ELSE': '긴 급 조 작',
        'T\\/H': '탱/힐',
        'Tail Marker': '꼬리 징',
        'Tail Slap': '꼬리치기',
        'Tail Spit': '꼬리 찌르기',
        'Tera Slash': '테라 슬래시',
        'Tethers': '선',
        'Tidal Wave': '해일',
        'Touchdown': '착지',
        'dps': '딜러',
        'healer[s]*': '힐러',
        'tank': '탱커',
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
        'Tethers': '선',
        'The Worm\'s Curse': '용의 저주',
        'Thin Ice': '얼음 바닥',
      },
    },
  ],
}];
