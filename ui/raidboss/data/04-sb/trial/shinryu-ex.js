'use strict';

// Shinryu Extreme
[{
  zoneId: ZoneId.TheMinstrelsBalladShinryusDomain,
  timelineFile: 'shinryu-ex.txt',
  triggers: [
    {
      id: 'ShinryuEx Heart Cleanup',
      netRegex: NetRegexes.removingCombatant({ name: 'Shinryu', capture: false }),
      netRegexDe: NetRegexes.removingCombatant({ name: 'Shinryu', capture: false }),
      netRegexFr: NetRegexes.removingCombatant({ name: 'Shinryu', capture: false }),
      netRegexJa: NetRegexes.removingCombatant({ name: '神龍', capture: false }),
      netRegexCn: NetRegexes.removingCombatant({ name: '神龙', capture: false }),
      netRegexKo: NetRegexes.removingCombatant({ name: '신룡', capture: false }),
      run: function(data) {
        // Explicitly clear so ugly heart message doesn't appear after wipe.
        delete data.phase;
      },
    },
    {
      id: 'ShinryuEx Phase 1',
      netRegex: NetRegexes.startsUsing({ id: '25DE', source: 'Shinryu', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '25DE', source: 'Shinryu', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '25DE', source: 'Shinryu', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '25DE', source: '神龍', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '25DE', source: '神龙', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '25DE', source: '신룡', capture: false }),
      run: function(data) {
        data.phase = 1;
      },
    },
    {
      id: 'ShinryuEx Phase 2',
      netRegex: NetRegexes.startsUsing({ id: '25E7', source: 'Shinryu', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '25E7', source: 'Shinryu', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '25E7', source: 'Shinryu', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '25E7', source: '神龍', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '25E7', source: '神龙', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '25E7', source: '신룡', capture: false }),
      run: function(data) {
        data.phase = 2;
      },
    },
    {
      id: 'ShinryuEx Phase 3',
      netRegex: NetRegexes.startsUsing({ id: '25E4', source: 'Shinryu', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '25E4', source: 'Shinryu', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '25E4', source: 'Shinryu', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '25E4', source: '神龍', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '25E4', source: '神龙', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '25E4', source: '신룡', capture: false }),
      run: function(data) {
        data.phase = 3;
      },
    },
    {
      id: 'ShinryuEx Phase 4',
      netRegex: NetRegexes.startsUsing({ id: '264E', source: 'Shinryu', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '264E', source: 'Shinryu', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '264E', source: 'Shinryu', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '264E', source: '神龍', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '264E', source: '神龙', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '264E', source: '신룡', capture: false }),
      run: function(data) {
        data.phase = 4;
      },
    },
    {
      id: 'ShinryuEx Akh Morn',
      netRegex: NetRegexes.startsUsing({ id: '25F3', source: 'Shinryu' }),
      netRegexDe: NetRegexes.startsUsing({ id: '25F3', source: 'Shinryu' }),
      netRegexFr: NetRegexes.startsUsing({ id: '25F3', source: 'Shinryu' }),
      netRegexJa: NetRegexes.startsUsing({ id: '25F3', source: '神龍' }),
      netRegexCn: NetRegexes.startsUsing({ id: '25F3', source: '神龙' }),
      netRegexKo: NetRegexes.startsUsing({ id: '25F3', source: '신룡' }),
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Akh Morn on YOU',
            de: 'Akh Morn auf DIR',
            fr: 'Akh Morn sur VOUS',
            ja: '自分にアク・モーン',
            cn: '死亡轮回点名',
            ko: '아크몬 대상자',
          };
        } else if (data.role == 'tank') {
          return {
            en: 'Akh Morn on ' + data.ShortName(matches.target),
            de: 'Akh Morn auf ' + data.ShortName(matches.target),
            fr: 'Akh Morn sur ' + data.ShortName(matches.target),
            ja: data.ShortName(matches.target) + 'にアク・モーン',
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
          fr: 'Akh Rhai: Dispersion et bougez',
          ja: 'アク・ラーイ: 散開 動け',
          cn: '天光轮回：散开和移动',
          ko: '아크 라이: 산개, 이동',
        };
      },
      tts: {
        en: 'akh morn',
        de: 'akh morn',
        fr: 'akh morn',
        ja: 'アク・モーン',
        cn: '死亡轮回',
        ko: '아크몬',
      },
    },
    {
      id: 'ShinryuEx Diamond Dust',
      netRegex: NetRegexes.startsUsing({ id: '25DD', source: 'Shinryu', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '25DD', source: 'Shinryu', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '25DD', source: 'Shinryu', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '25DD', source: '神龍', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '25DD', source: '神龙', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '25DD', source: '신룡', capture: false }),
      infoText: {
        en: 'Ice: Stack and Stop',
        de: 'Eis: Stack und Stehenbleiben',
        fr: 'Glace : Packez-vous et arrêtez',
        ja: '氷: スタック 動かない',
        cn: '冰地面：站一起和停止移动',
        ko: '얼음: 집합하고 이동하지 않기',
      },
      tts: {
        en: 'stop',
        de: 'stopp',
        fr: 'arrêtez',
        ja: '動かない',
        cn: '停止',
        ko: '이동하지 않기',
      },
    },
    {
      id: 'ShinryuEx Dragonfist',
      netRegex: NetRegexes.startsUsing({ id: '2611', source: 'Shinryu', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2611', source: 'Shinryu', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2611', source: 'Shinryu', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2611', source: '神龍', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2611', source: '神龙', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2611', source: '신룡', capture: false }),
      infoText: {
        en: 'Out of middle',
        de: 'Raus aus der Mitte',
        fr: 'Sortez du milieu',
        ja: '中央から離れ',
        cn: '离开中间',
        ko: '중앙 피하기',
      },
    },
    {
      id: 'ShinryuEx Hellfire',
      netRegex: NetRegexes.startsUsing({ id: '25DB', source: 'Shinryu', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '25DB', source: 'Shinryu', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '25DB', source: 'Shinryu', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '25DB', source: '神龍', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '25DB', source: '神龙', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '25DB', source: '신룡', capture: false }),
      durationSeconds: 7,
      alertText: {
        en: 'Get in water',
        de: 'In\'s Wasser',
        fr: 'Allez dans l\'eau',
        ja: '水に入る',
        cn: '进水圈',
        ko: '물 장판에 들어가기',
      },
      tts: {
        en: 'water',
        de: 'wasser',
        fr: 'eau',
        ja: 'みず',
        cn: '进水圈',
        ko: '물 장판',
      },
    },
    {
      // TODO: the original trigger didn't differentiate the two ability ids.
      // Probably the phase conditional could get removed if it did.
      id: 'ShinryuEx Hypernova',
      netRegex: NetRegexes.startsUsing({ id: ['271F', '25E8'], source: 'Right Wing', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['271F', '25E8'], source: 'Recht(?:e|er|es|en) Schwinge', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['271F', '25E8'], source: 'Aile Droite', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['271F', '25E8'], source: 'ライトウィング', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: ['271F', '25E8'], source: '右翼', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: ['271F', '25E8'], source: '오른쪽 날개', capture: false }),
      durationSeconds: 7,
      alertText: function(data) {
        if (data.phase == 3) {
          return {
            en: 'stop to get frozen',
            de: 'Stopp! Einfrieren lassen',
            fr: 'Arrêtez, laissez-vous gelé',
            ja: '止まれ、凍結',
            cn: '停下，冰地面',
            ko: '멈춰서 얼기',
          };
        }
        return {
          en: 'Stack in water',
          de: 'In Wasser stacken',
          fr: 'Packez-vous dans l\'eau',
          ja: '水に集合',
          cn: '在水圈攻击',
          ko: '물 장판에 모이기',
        };
      },
      tts: function(data) {
        if (data.phase == 3) {
          return {
            en: 'stop to get frozen',
            de: 'Stopp! Einfrieren lassen',
            fr: 'arrêtez, laissez-vous gelé',
            ja: '止まれ、凍結',
            cn: '停下，冰地面',
            ko: '멈춰서 얼기',
          };
        }
        return {
          en: 'water',
          de: 'Wasser',
          fr: 'eau',
          ja: '水',
          cn: '水圈',
          ko: '물 장판',
        };
      },
    },
    {
      id: 'ShinryuEx Judgement Bolt',
      netRegex: NetRegexes.startsUsing({ id: '25DC', source: 'Shinryu', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '25DC', source: 'Shinryu', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '25DC', source: 'Shinryu', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '25DC', source: '神龍', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '25DC', source: '神龙', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '25DC', source: '신룡', capture: false }),
      durationSeconds: 7,
      alertText: {
        en: 'out of water',
        de: 'Raus aus dem Wasser',
        fr: 'Sortez de l\'eau',
        ja: '水から離れ',
        cn: '离开水圈',
        ko: '물 장판 밖으로',
      },
    },
    {
      id: 'ShinryuEx Levinbolt',
      netRegex: NetRegexes.startsUsing({ id: ['25EA', '2720', '2725'], source: 'Right Wing', target: 'Right Wing', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['25EA', '2720', '2725'], source: 'Recht(?:e|er|es|en) Schwinge', target: 'Recht(?:e|er|es|en) Schwinge', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['25EA', '2720', '2725'], source: 'Aile Droite', target: 'Aile Droite', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['25EA', '2720', '2725'], source: 'ライトウィング', target: 'ライトウィング', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: ['25EA', '2720', '2725'], source: '右翼', target: '右翼', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: ['25EA', '2720', '2725'], source: '오른쪽 날개', target: '오른쪽 날개', capture: false }),
      durationSeconds: 7,
      alertText: function(data) {
        if (data.phase == 3) {
          return {
            en: 'bait bolt, keep moving',
            de: 'Blitz ködern, weiterbewegen',
            fr: 'Attirez la foudre, continuez à bouger',
            ja: '稲妻: 動き続ける',
            cn: '闪电，保持移动',
            ko: '번개 공격 산개, 계속 움직이기',
          };
        }
        return {
          en: 'Spread out, no water',
          de: 'Verteilen und nicht in\'s Wasser',
          fr: 'Dispersez-vous en dehors de l\'eau',
          ja: '散開、水に入らない',
          cn: '散开，离开水圈',
          ko: '산개, 물장판 X',
        };
      },
      tts: function(data) {
        if (data.phase == 3) {
          return {
            en: 'bait bolt, keep moving',
            de: 'Blitz ködern, weiterbewegen',
            fr: 'Attirez la foudre, continuez à bouger',
            ja: '稲妻、動き続ける',
            cn: '闪电，保持移动',
            ko: '번개 공격 산개, 계속 움직이기',
          };
        }
        return {
          en: 'levinbolt',
          de: 'Blitz',
          fr: 'fulguration',
          ja: '稲妻',
          cn: '离开闪电',
          ko: '우레',
        };
      },
    },
    {
      id: 'ShinryuEx Levinbolt Phase 3',
      netRegex: NetRegexes.startsUsing({ id: ['25EA', '2720', '2725'], source: 'Right Wing', target: 'Right Wing', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['25EA', '2720', '2725'], source: 'Recht(?:e|er|es|en) Schwinge', target: 'Recht(?:e|er|es|en) Schwinge', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['25EA', '2720', '2725'], source: 'Aile Droite', target: 'Aile Droite', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['25EA', '2720', '2725'], source: 'ライトウィング', target: 'ライトウィング', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: ['25EA', '2720', '2725'], source: '右翼', target: '右翼', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: ['25EA', '2720', '2725'], source: '오른쪽 날개', target: '오른쪽 날개', capture: false }),
      delaySeconds: 9.5,
      alarmText: function(data) {
        if (data.phase == 3) {
          return {
            en: 'move away',
            de: 'wegbewegen',
            fr: 'Éloignez-vous',
            ja: '散開',
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
            fr: 'Éloignez-vous',
            ja: '散開',
            cn: '散开',
            ko: '떨어지기',
          };
        }
      },
    },
    {
      id: 'ShinryuEx Icicle Left',
      netRegex: NetRegexes.abilityFull({ id: '25EF', source: 'Icicle', x: '-29\\.99', y: '-15', capture: false }),
      netRegexDe: NetRegexes.abilityFull({ id: '25EF', source: 'Eiszapfen', x: '-29\\.99', y: '-15', capture: false }),
      netRegexFr: NetRegexes.abilityFull({ id: '25EF', source: 'Stalactite', x: '-29\\.99', y: '-15', capture: false }),
      netRegexJa: NetRegexes.abilityFull({ id: '25EF', source: 'アイシクル', x: '-29\\.99', y: '-15', capture: false }),
      netRegexCn: NetRegexes.abilityFull({ id: '25EF', source: '冰柱', x: '-29\\.99', y: '-15', capture: false }),
      netRegexKo: NetRegexes.abilityFull({ id: '25EF', source: '고드름', x: '-29\\.99', y: '-15', capture: false }),
      alarmText: {
        en: 'icicle, lean west',
        de: 'Eiszapfen, nach westen',
        fr: 'Stalactite, penchez vers l\'ouest',
        ja: 'アイシクル: 西へ',
        cn: '冰柱，去左边',
        ko: '고드름, 왼쪽 먼저',
      },
    },
    {
      id: 'ShinryuEx Icicle Right',
      netRegex: NetRegexes.abilityFull({ id: '25EF', source: 'Icicle', x: '-29\\.99', y: '-25', capture: false }),
      netRegexDe: NetRegexes.abilityFull({ id: '25EF', source: 'Eiszapfen', x: '-29\\.99', y: '-25', capture: false }),
      netRegexFr: NetRegexes.abilityFull({ id: '25EF', source: 'Stalactite', x: '-29\\.99', y: '-25', capture: false }),
      netRegexJa: NetRegexes.abilityFull({ id: '25EF', source: 'アイシクル', x: '-29\\.99', y: '-25', capture: false }),
      netRegexCn: NetRegexes.abilityFull({ id: '25EF', source: '冰柱', x: '-29\\.99', y: '-25', capture: false }),
      netRegexKo: NetRegexes.abilityFull({ id: '25EF', source: '고드름', x: '-29\\.99', y: '-25', capture: false }),
      alarmText: {
        en: 'icicle, lean east',
        de: 'Eiszapfen, nach Osten',
        fr: 'Stalactite, penchez vers l\'est',
        ja: 'アイシクル: 東へ',
        cn: '冰柱，去右边',
        ko: '고드름, 오른쪽 먼저',
      },
    },
    {
      id: 'ShinryuEx Tidal Wave',
      netRegex: NetRegexes.startsUsing({ id: '25DA', source: 'Shinryu', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '25DA', source: 'Shinryu', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '25DA', source: 'Shinryu', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '25DA', source: '神龍', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '25DA', source: '神龙', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '25DA', source: '신룡', capture: false }),
      delaySeconds: 3,
      durationSeconds: 5,
      infoText: {
        en: 'Knockback, look for water',
        de: 'Rückstoß, nach Wasser schauen',
        fr: 'Poussée, cherchez l\'eau',
        ja: 'ノックバック、水を探せ',
        cn: '击退，找水圈',
        ko: '넉백, 물기둥 확인',
      },
      tts: {
        en: 'knockback',
        de: 'Rückstoß',
        fr: 'poussée',
        ja: 'ノックバック',
        cn: '击退',
        ko: '넉백',
      },
    },
    {
      id: 'ShinryuEx Final Tidal Wave',
      netRegex: NetRegexes.startsUsing({ id: '264E', source: 'Shinryu', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '264E', source: 'Shinryu', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '264E', source: 'Shinryu', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '264E', source: '神龍', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '264E', source: '神龙', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '264E', source: '신룡', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'no more heals needed',
        de: 'keine Heilung mehr nötig',
        fr: 'Pas besoin de soigner',
        ja: 'ヒールはもう要らない',
        cn: '不需要更多奶了',
        ko: '힐 그만',
      },
      tts: {
        en: 'stop healing',
        de: 'keine Heilung mehr',
        fr: 'arrêtez^de soigner',
        ja: 'ヒール ストップ',
        cn: '停奶',
        ko: '힐 그만',
      },
    },
    {
      id: 'ShinryuEx Tail Slap',
      netRegex: NetRegexes.startsUsing({ id: '25E2', source: 'Tail', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '25E2', source: 'Schwanz', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '25E2', source: 'Queue', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '25E2', source: '神龍の尾', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '25E2', source: '龙尾', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '25E2', source: '신룡의 꼬리', capture: false }),
      delaySeconds: 2,
      infoText: {
        en: 'Tail: Switch targets',
        de: 'Schweif: Zielwechsel',
        fr: 'Queue : Changez de cible',
        ja: '尾: タゲチェンジ',
        cn: '打尾巴',
        ko: '꼬리 공격',
      },
      tts: {
        en: 'tail',
        de: 'schweif',
        fr: 'queue',
        ja: '尾',
        cn: '尾巴',
        ko: '꼬리',
      },
    },
    {
      id: 'ShinryuEx Heart',
      netRegex: NetRegexes.addedCombatant({ name: 'The Worm\'s Heart', capture: false }),
      netRegexDe: NetRegexes.addedCombatant({ name: 'Shinryus Herz', capture: false }),
      netRegexFr: NetRegexes.addedCombatant({ name: 'Cœur Du Dragon', capture: false }),
      netRegexJa: NetRegexes.addedCombatant({ name: '神龍の心核', capture: false }),
      netRegexCn: NetRegexes.addedCombatant({ name: '神龙的核心', capture: false }),
      netRegexKo: NetRegexes.addedCombatant({ name: '신룡의 심핵', capture: false }),
      condition: function(data) {
        // Prevent ugly heart message on wipe.
        return data.phase == 1;
      },
      // TODO: If tail is alive, delay this message?
      infoText: {
        en: 'Heart: Switch targets',
        de: 'Herz: Ziel wechseln',
        fr: 'Cœur : Changez de cible',
        ja: '心核: タゲチェンジ',
        cn: '打核心',
        ko: '심핵 공격',
      },
      tts: {
        en: 'heart',
        de: 'herz',
        fr: 'cœur',
        ja: '心核',
        cn: '核心',
        ko: '심핵',
      },
    },
    {
      // TODO: can't find the id of this, so using all of them.
      id: 'ShinryuEx Divebomb',
      netRegex: NetRegexes.startsUsing({ id: ['1FA8', '1FF4', '2603'], source: 'Shinryu', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['1FA8', '1FF4', '2603'], source: 'Shinryu', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['1FA8', '1FF4', '2603'], source: 'Shinryu', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['1FA8', '1FF4', '2603'], source: '神龍', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: ['1FA8', '1FF4', '2603'], source: '神龙', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: ['1FA8', '1FF4', '2603'], source: '신룡', capture: false }),
      alarmText: {
        en: 'avoid divebomb',
        de: 'Divebomb ausweichen',
        fr: 'Évitez la bombe plongeante',
        ja: 'ダイブボムに避け',
        cn: '前方顺劈',
        ko: '급강하 폭격 피하기',
      },
      tts: {
        en: 'divebombs',
        de: 'sturzflug',
        fr: 'bombe plongeante',
        ja: 'ダイブボム',
        cn: '顺劈',
        ko: '급강하 폭격',
      },
    },
    {
      id: 'ShinryuEx Death Sentence',
      netRegex: NetRegexes.startsUsing({ id: '260A', source: 'Hakkinryu' }),
      netRegexDe: NetRegexes.startsUsing({ id: '260A', source: 'Hakkinryu' }),
      netRegexFr: NetRegexes.startsUsing({ id: '260A', source: 'Hakkinryu' }),
      netRegexJa: NetRegexes.startsUsing({ id: '260A', source: '白金龍' }),
      netRegexCn: NetRegexes.startsUsing({ id: '260A', source: '白金龙' }),
      netRegexKo: NetRegexes.startsUsing({ id: '260A', source: '백금룡' }),
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Death Sentence on YOU',
            de: 'Todesurteil auf DIR',
            fr: 'Peine de mort sur VOUS',
            ja: '自分にデスセンテンス',
            cn: '死刑点名',
            ko: '사형 선고 대상자',
          };
        } else if (data.role == 'healer') {
          return {
            en: 'Death Sentence on ' + data.ShortName(matches.target),
            de: 'Todesurteil auf ' + data.ShortName(matches.target),
            fr: 'Peine de mort sur ' + data.ShortName(matches.target),
            ja: data.ShortName(matches.target) + 'にデスセンテンス',
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
            fr: 'Peine de mort sur ' + data.ShortName(matches.target),
            ja: data.ShortName(matches.target) + 'にデスセンテンス',
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
            fr: 'Peine de mort',
            ja: 'デスセンテンス',
            cn: '死刑',
            ko: '사형 선고',
          };
        }
      },
    },
    {
      id: 'ShinryuEx Tera Slash',
      netRegex: NetRegexes.startsUsing({ id: '264B', source: 'Shinryu' }),
      netRegexDe: NetRegexes.startsUsing({ id: '264B', source: 'Shinryu' }),
      netRegexFr: NetRegexes.startsUsing({ id: '264B', source: 'Shinryu' }),
      netRegexJa: NetRegexes.startsUsing({ id: '264B', source: '神龍' }),
      netRegexCn: NetRegexes.startsUsing({ id: '264B', source: '神龙' }),
      netRegexKo: NetRegexes.startsUsing({ id: '264B', source: '신룡' }),
      response: Responses.tankBusterSwap(),
    },
    {
      id: 'ShinryuEx Wormwail',
      netRegex: NetRegexes.startsUsing({ id: '2648', source: 'Shinryu', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2648', source: 'Shinryu', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2648', source: 'Shinryu', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2648', source: '神龍', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2648', source: '神龙', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2648', source: '신룡', capture: false }),
      response: Responses.getUnder(),
    },
    {
      id: 'ShinryuEx Breath',
      netRegex: NetRegexes.startsUsing({ id: '264A', source: 'Shinryu', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '264A', source: 'Shinryu', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '264A', source: 'Shinryu', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '264A', source: '神龍', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '264A', source: '神龙', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '264A', source: '신룡', capture: false }),
      alertText: {
        en: 'front cleave',
        de: 'Frontalcleave',
        fr: 'Cleave devant',
        ja: '正面から離れ',
        cn: '离开正面',
        ko: '범위 밖으로',
      },
      tts: {
        en: 'cleave',
        de: 'klief',
        fr: 'cleave',
        ja: '前方範囲攻撃',
        cn: '顺劈',
        ko: '범위 공격',
      },
    },
    {
      id: 'ShinryuEx Final Left Wing',
      netRegex: NetRegexes.startsUsing({ id: '2718', source: 'Left Wing', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2718', source: 'Link(?:e|er|es|en) Schwinge', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2718', source: 'Aile Gauche', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2718', source: 'レフトウィング', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2718', source: '左翼', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2718', source: '왼쪽 날개', capture: false }),
      condition: function(data) {
        return !data.finalWing;
      },
      alertText: {
        en: 'kill left first',
        de: 'linken Flügel zuerst',
        fr: 'Tuez la gauche en première',
        ja: 'レフトウィングに攻撃',
        cn: '击杀左翼',
        ko: '왼쪽 날개 먼저',
      },
      tts: {
        en: 'left first',
        de: 'links zuerst',
        fr: 'gauche en première',
        ja: 'レフト',
        cn: '击杀左翼',
        ko: '왼쪽 먼저',
      },
      run: function(data) {
        data.finalWing = true;
      },
    },
    {
      id: 'ShinryuEx Final Right Wing',
      netRegex: NetRegexes.startsUsing({ id: '2719', source: 'Right Wing', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2719', source: 'Recht(?:e|er|es|en) Schwinge', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2719', source: 'Aile Droite', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2719', source: 'ライトウィング', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2719', source: '右翼', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2719', source: '오른쪽 날개', capture: false }),
      condition: function(data) {
        return !data.finalWing;
      },
      alertText: {
        en: 'kill right first',
        de: 'rechten Flügel zuerst',
        fr: 'Tuez la droite en première',
        ja: 'ライトウィングに攻撃',
        cn: '击杀右翼',
        ko: '오른쪽 날개 먼저',
      },
      tts: {
        en: 'right first',
        de: 'rechts zuerst',
        fr: 'droite en première',
        ja: 'ライト',
        cn: '击杀右翼',
        ko: '오른쪽 날개',
      },
      run: function(data) {
        data.finalWing = true;
      },
    },
    {
      id: 'ShinryuEx Tethers',
      netRegex: NetRegexes.headMarker({ id: '0061' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      delaySeconds: 3.8,
      infoText: function(data) {
        if (data.phase == 3) {
          return {
            en: 'break tethers then stack',
            de: 'Kette zerreissen, dann stack',
            fr: 'Cassez les liens, puis packez-vous',
            ja: '鎖を引き、集合',
            cn: '拉断锁链然后攻击',
            ko: '선 끊고 모이기',
          };
        }
        return {
          en: 'break tethers',
          de: 'Ketten zerreissen',
          fr: 'Cassez les liens',
          ja: '鎖',
          cn: '拉断锁链',
          ko: '선 끊기',
        };
      },
      tts: function(data) {
        if (data.phase == 3) {
          return {
            en: 'break tethers then stack',
            de: 'Kette zerreissen, dann stack',
            fr: 'Cassez les liens, puis packez-vous',
            ja: '鎖を引き、集合',
            cn: '拉断锁链然后攻击',
            ko: '선 끊고 모이기',
          };
        }
        return {
          en: 'break tethers',
          de: 'Ketten zerreissen',
          fr: 'Cassez les liens',
          ja: '鎖',
          cn: '拉断锁链',
          ko: '선 끊기',
        };
      },
    },
    {
      id: 'ShinryuEx Tail Marker',
      netRegex: NetRegexes.headMarker({ id: '007E' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      alarmText: {
        en: 'tail marker on you',
        de: 'Schweifmarker auf dir',
        fr: 'Marqueur Queue sur VOUS',
        ja: '自分にテイル',
        cn: '龙尾点名',
        ko: '꼬리 징 대상자',
      },
      tts: {
        en: 'tail marker',
        de: 'schweif marker',
        fr: 'marqueur queue',
        ja: 'テイル',
        cn: '龙尾点名',
        ko: '꼬리 징',
      },
    },
    {
      id: 'ShinryuEx Shakers',
      netRegex: NetRegexes.headMarker({ id: '0028' }),
      condition: function(data, matches) {
        data.shakerTargets = data.shakerTargets || [];
        data.shakerTargets.push(matches.target);
        return data.shakerTargets.length == 2;
      },
      alarmText: function(data) {
        if (data.shakerTargets.includes(data.me)) {
          return {
            en: 'earthshaker on you',
            de: 'Erdstoss auf dir',
            fr: 'Secousse sur VOUS',
            ja: '自分にアースシェーカー',
            cn: '大地动摇点名',
            ko: '어스 대상자',
          };
        }
      },
      alertText: function(data) {
        if (!data.shakerTargets.includes(data.me)) {
          return {
            en: 'avoid earthshakers',
            de: 'Stöße ausweichen',
            fr: 'Évitez les secousses',
            ja: 'アースシェーカーに避け',
            cn: '远离大地动摇',
            ko: '어스 피하기',
          };
        }
      },
      tts: function(data) {
        if (!data.shakerTargets.includes(data.me)) {
          return {
            en: 'avoid shakers',
            de: 'Stöße ausweichen',
            fr: 'évitez les secousses',
            ja: 'アースシェーカー',
            cn: '离开点名',
            ko: '어스 피하기',
          };
        }
        return {
          en: 'earthshaker',
          de: 'erdstoß',
          fr: 'secousse',
          ja: 'アースシェーカー',
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
      netRegex: NetRegexes.headMarker({ id: '0039' }),
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
        'Hakkinryu': 'Hakkinryu',
        'Left Wing': 'link(?:e|er|es|en) Schwinge',
        'Right Wing': 'recht(?:e|er|es|en) Schwinge',
        'Shinryu': 'Shinryu',
        'Tail': 'Schwanz',
        'The Worm\'s Heart': 'Shinryus Herz',
        'Icicle': 'Eiszapfen',
      },
      'replaceText': {
        'Aerial Blast': 'Windschlag',
        'Akh Morn': 'Akh Morn',
        'Atomic Ray': 'Atomstrahlung',
        'Benighting / Wormwail': 'Dunkelhauch / Shinryus Ruf',
        'Cocoon Markers': 'Kokon Marker',
        'Dark Matter': 'Dunkelmaterie',
        'Diamond Dust': 'Diamantenstaub',
        'Dragonfist': 'Drachenfaust',
        'Earth Breath': 'Erdatem',
        'Earthen Fury': 'Gaias Zorn',
        'First Wing': 'Erster Flügel',
        'Gyre Charge': 'Wirbel-Aufladung',
        'Hellfire': 'Höllenfeuer',
        'Hypernova': 'Supernova',
        'Ice Storm': 'Eissturm',
        'Judgment Bolt': 'Ionenschlag',
        'Levinbolt': 'Keraunisches Feld',
        'Meteor Impact': 'Meteoreinschlag',
        'Phase': 'Phase',
        'Protostar': 'Protostern',
        'Reiyu Adds': 'Reiyu Adds',
        'Second Wing': 'Zweiter Flügel',
        'Summon Icicle': 'Flugeis',
        'TAP BUTTON OR ELSE': 'DRÜCKE TASTEN ETC',
        'Tail Marker': 'Schweifmarker',
        'Tail Slap': 'Schweifklapser',
        'Tail Spit': 'Schweifspieß',
        'Tera Slash': 'Tera-Schlag',
        'Tethers': 'Verbindungen',
        'Tidal Wave': 'Flutwelle',
        'Touchdown': 'Himmelssturz',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Hakkinryu': 'hakkinryu',
        'Icicle': 'stalactite',
        'Left Wing': 'aile gauche',
        'Right Wing': 'aile droite',
        'Shinryu': 'Shinryu',
        'The Worm\'s Heart': 'cœur du dragon',
        'Tail': 'queue',
      },
      'replaceText': {
        '--Phase': '--Phase',
        'Aerial Blast': 'Rafale aérienne',
        'Akh Morn / Rhai': 'Akh Morn / Rhai',
        'Atomic Ray': 'Rayon atomique',
        'Benighting / Wormwail': 'Souffle / Gémissement',
        'Cocoon Markers': 'Marqueurs Cocon',
        'Dark Matter': 'Matière sombre',
        'Diamond Dust': 'Poussière de diamant',
        'Dragonfist': 'Poing dragon',
        'Earth Breath': 'Souffle de terre',
        'Earthen Fury': 'Fureur tellurique',
        'First Wing': 'Première aile',
        'Gyre Charge': 'Gyrocharge',
        'Hellfire': 'Flammes de l\'enfer',
        'Hypernova': 'Hypernova',
        'Ice Storm': 'Tempête de glace',
        'Judgment Bolt': 'Éclair du jugement',
        'Levinbolt': 'Fulguration',
        'Meteor Impact': 'Impact de météore',
        'Protostar': 'Proto-étoile',
        'Reiyu Adds': 'Adds Ryu',
        'Second Wing': 'Seconde aile',
        'Summon Icicle': 'Appel de stalactite',
        'Tail Marker': 'Marqueur Queue',
        'Tail Slap': 'Gifle caudale',
        'Tail Spit': 'Broche caudale',
        'TAP BUTTON OR ELSE': 'CLIQUEZ SUR LE BOUTON OU AUTRE',
        'Tera Slash': 'TéraTaillade',
        'Tethers': 'Liens',
        'Tidal Wave': 'Raz-de-marée',
        'Touchdown': 'Atterrissage',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Hakkinryu': '白金龍',
        'Left Wing': 'レフトウィング',
        'Right Wing': 'ライトウィング',
        'Shinryu': '神龍',
        'Tail': '神龍の尾',
        'The Worm\'s Heart': '神龍の心核',
      },
      'replaceText': {
        'Aerial Blast': 'エリアルブラスト',
        'Akh Morn': 'アク・モーン',
        'Atomic Ray': 'アトミックレイ',
        'Benighting / Wormwail': 'ダークネスブレス / 神龍の咆哮',
        'Cocoon Markers': 'マユ マーク',
        'Dark Matter': 'ダークマター',
        'Diamond Dust': 'ダイアモンドダスト',
        'Dragonfist': '龍掌',
        'Earth Breath': 'アースブレス',
        'Earthen Fury': '大地の怒り',
        'First Wing': '翼一つ目',
        'Gyre Charge': 'ジャイヤチャージ',
        'Hellfire': '地獄の火炎',
        'Hypernova': 'スーパーノヴァ',
        'Ice Storm': '吹雪',
        'Judgment Bolt': '裁きの雷',
        'Levinbolt': '稲妻',
        'Meteor Impact': 'メテオインパクト',
        'Phase': 'フェイス',
        'Protostar': 'プロトスター',
        'Reiyu Adds': '雑魚',
        'Second Wing': '翼二つ目',
        'Summon Icicle': 'サモン・アイシクル',
        'TAP BUTTON OR ELSE': 'ボタンを押せ！',
        'Tail Marker': 'テイル マーク',
        'Tail Slap': 'テールスラップ',
        'Tail Spit': 'テールスピット',
        'Tera Slash': 'テラスラッシュ',
        'Tethers': '線',
        'Tidal Wave': 'タイダルウェイブ',
        'Touchdown': 'タッチダウン',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Hakkinryu': '白金龙',
        'Left Wing': '左翼',
        'Right Wing': '右翼',
        'Shinryu': '神龙',
        'Tail': '龙尾',
        'The Worm\'s Heart': '神龙的核心',
      },
      'replaceText': {
        'Aerial Blast': '大气爆发',
        'Akh Morn': '死亡轮回',
        'Atomic Ray': '原子射线',
        'Benighting / Wormwail': '黑暗吐息/神龙啸',
        'Cocoon Markers': '光茧点名',
        'Dark Matter': '暗物质',
        'Diamond Dust': '钻石星尘',
        'Dragonfist': '龙掌',
        'Earth Breath': '大地吐息',
        'Earthen Fury': '大地之怒',
        'First Wing': '第一只翅膀',
        'Gyre Charge': '螺旋冲锋',
        'Hellfire': '地狱之火炎',
        'Hypernova': '超新星',
        'Ice Storm': '吹雪',
        'Judgment Bolt': '制裁之雷',
        'Levinbolt': '闪电',
        'Meteor Impact': '陨石冲击',
        'Phase': '阶段',
        'Protostar': '原恒星',
        'Reiyu Adds': '小怪',
        'Second Wing': '第二只翅膀',
        'Summon Icicle': '召唤冰柱',
        'TAP BUTTON OR ELSE': 'XJB按',
        'Tail Marker': '尾巴点名',
        'Tail Slap': '尾部猛击',
        'Tail Spit': '尾部重击',
        'Tera Slash': '万亿斩击',
        'Tethers': '连线',
        'Tidal Wave': '巨浪',
        'Touchdown': '空降',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Hakkinryu': '백금룡',
        'Left Wing': '왼쪽 날개',
        'Right Wing': '오른쪽 날개',
        'Shinryu': '신룡',
        'Tail(?! )': '신룡의 꼬리',
        'The Worm\'s Heart': '신룡의 심핵',
      },
      'replaceText': {
        'T\\/H': '탱/힐',
        'healer[s]*': '힐러',
        'dps': '딜러',
        'tank': '탱커',
        'Rhai': '아크 라이',
        'Aerial Blast': '대기 폭발',
        'Akh Morn': '아크 몬',
        'Atomic Ray': '원자 파동',
        'Benighting / Wormwail': '어둠의 숨결 / 신룡의 포효',
        'Cocoon Markers': '빛의 고체 징',
        'Dark Matter': '암흑물질',
        'Diamond Dust': '다이아몬드 더스트',
        'Dragonfist': '용의 손바닥',
        'Earth Breath': '대지의 숨결',
        'Earthen Fury': '대지의 분노',
        'First Wing': '첫번째 날개',
        'Gyre Charge': '회전 돌진',
        'Hellfire': '지옥의 화염',
        'Hypernova': '초신성',
        'Ice Storm': '눈보라',
        'Judgment Bolt': '심판의 벼락',
        'Levinbolt': '우레',
        'Meteor Impact': '운석 낙하',
        'Phase': '페이즈',
        'Protostar': '원시별',
        'Reiyu Adds': '영룡 쫄',
        'Second Wing': '두번째 날개',
        'Summon Icicle': '고드름 소환',
        'TAP BUTTON OR ELSE': '긴 급 조 작',
        'Tail Marker': '꼬리 징',
        'Tail Slap': '꼬리치기',
        'Tail Spit': '꼬리 찌르기',
        'Tera Slash': '테라 슬래시',
        'Tethers': '선',
        'Tidal Wave': '해일',
        'Touchdown': '착지',
      },
    },
  ],
}];
