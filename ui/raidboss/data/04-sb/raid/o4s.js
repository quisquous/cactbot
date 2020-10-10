'use strict';

// O4S - Deltascape 4.0 Savage
[{
  zoneId: ZoneId.DeltascapeV40Savage,
  timelineNeedsFixing: true,
  timelineFile: 'o4s.txt',
  timelineTriggers: [
    {
      id: 'O4S Neo Vacuum Wave',
      regex: /Vacuum Wave/,
      beforeSeconds: 8,
      alertText: {
        en: 'Vacuum Wave soon',
        de: 'Vakuumwelle bald',
        ja: 'まもなく真空波',
        cn: '马上真空波',
      },
    },
  ],
  triggers: [
    // Part 1
    {
      // Phase Tracker: Thunder III not after Decisive Battle.
      id: 'O4S Exdeath Thunder III Counter',
      netRegex: NetRegexes.startsUsing({ id: '23F9', source: 'Exdeath', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '23F9', source: 'Exdeath', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '23F9', source: 'Exdeath', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '23F9', source: 'エクスデス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '23F9', source: '艾克斯迪司', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '23F9', source: '엑스데스', capture: false }),
      run: function(data) {
        data.thunderCount = (data.thunderCount || 0) + 1;
      },
    },
    {
      // Fire III not after Decisive Battle.
      id: 'O4S Exdeath Fire III Counter',
      netRegex: NetRegexes.startsUsing({ id: '23F5', source: 'Exdeath', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '23F5', source: 'Exdeath', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '23F5', source: 'Exdeath', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '23F5', source: 'エクスデス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '23F5', source: '艾克斯迪司', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '23F5', source: '엑스데스', capture: false }),
      infoText: {
        en: 'Fire III',
        de: 'Feuga',
        ja: 'ファイガ',
        cn: '静止',
      },
    },
    {
      // Blizzard III not after Decisive Battle.
      id: 'O4S Exdeath Blizzard III',
      netRegex: NetRegexes.startsUsing({ id: '23F7', source: 'Exdeath', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '23F7', source: 'Exdeath', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '23F7', source: 'Exdeath', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '23F7', source: 'エクスデス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '23F7', source: '艾克斯迪司', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '23F7', source: '엑스데스', capture: false }),
      infoText: {
        en: 'Blizzard III',
        de: 'Eisga',
        ja: 'ブリザガ',
        cn: '蛇皮走位',
      },
    },
    {
      // Thunder III not after Decisive Battle.
      id: 'O4S Exdeath Thunder III',
      netRegex: NetRegexes.startsUsing({ id: '23F9', source: 'Exdeath', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '23F9', source: 'Exdeath', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '23F9', source: 'Exdeath', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '23F9', source: 'エクスデス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '23F9', source: '艾克斯迪司', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '23F9', source: '엑스데스', capture: false }),
      alertText: function(data) {
        // Tanks/healers always get an alert.
        if (data.role == 'tank' || data.role == 'healer') {
          return {
            en: 'Thunder III: Tank buster',
            de: 'Blitzga: Tank buster',
            ja: 'サンダガ: タンクバスター',
            cn: '雷三：坦克死刑',
          };
        }
      },
      infoText: function(data) {
        // Tanks/healers always get an alert.
        if (data.role == 'tank' || data.role == 'healer') return false;
        return {
          en: 'Thunder III',
          de: 'Blitzga',
          ja: 'サンダガ',
          cn: '雷三',
        };
      },
      tts: function(data) {
        if (data.role == 'tank' || data.role == 'healer') {
          return {
            en: 'thunder',
            de: 'blitzga',
            ja: '離れ',
            cn: '远离',
          };
        }
      },
    },
    {
      // Fire III after Decisive Battle.
      id: 'O4S Exdeath Ultimate Fire III',
      netRegex: NetRegexes.startsUsing({ id: '23FB', source: 'Exdeath', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '23FB', source: 'Exdeath', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '23FB', source: 'Exdeath', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '23FB', source: 'エクスデス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '23FB', source: '艾克斯迪司', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '23FB', source: '엑스데스', capture: false }),
      response: Responses.stopMoving(),
    },
    {
      // Blizzard III after Decisive Battle.
      id: 'O4S Exdeath Ultimate Blizzard III',
      netRegex: NetRegexes.startsUsing({ id: '23FC', source: 'Exdeath', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '23FC', source: 'Exdeath', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '23FC', source: 'Exdeath', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '23FC', source: 'エクスデス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '23FC', source: '艾克斯迪司', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '23FC', source: '엑스데스', capture: false }),
      response: Responses.moveAround(),
    },
    {
      // Thunder III after Decisive Battle.
      id: 'O4S Exdeath Ultimate Thunder III',
      netRegex: NetRegexes.startsUsing({ id: '23FD', source: 'Exdeath', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '23FD', source: 'Exdeath', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '23FD', source: 'Exdeath', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '23FD', source: 'エクスデス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '23FD', source: '艾克斯迪司', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '23FD', source: '엑스데스', capture: false }),
      response: Responses.getOut(),
    },
    {
      // Flare
      id: 'O4S Exdeath Flare',
      netRegex: NetRegexes.startsUsing({ id: '2401', source: 'Exdeath' }),
      netRegexDe: NetRegexes.startsUsing({ id: '2401', source: 'Exdeath' }),
      netRegexFr: NetRegexes.startsUsing({ id: '2401', source: 'Exdeath' }),
      netRegexJa: NetRegexes.startsUsing({ id: '2401', source: 'エクスデス' }),
      netRegexCn: NetRegexes.startsUsing({ id: '2401', source: '艾克斯迪司' }),
      netRegexKo: NetRegexes.startsUsing({ id: '2401', source: '엑스데스' }),
      condition: function(data, matches) {
        data.flareTargets = data.flareTargets || [];
        data.flareTargets.push(matches.target);
        return data.flareTargets.length == 3;
      },
      alarmText: function(data) {
        if (data.flareTargets.includes(data.me)) {
          return {
            en: 'Flare on you',
            de: 'Flare auf dir',
            ja: '自分にフレア',
            cn: '核爆点名',
          };
        }
      },
      run: function(data) {
        delete data.flareTargets;
      },
    },

    // Part 2
    {
      id: 'O4S Neo Grand Cross Alpha Tracker',
      netRegex: NetRegexes.startsUsing({ id: '242B', source: 'Neo Exdeath', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '242B', source: 'Neo Exdeath', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '242B', source: 'Néo-Exdeath', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '242B', source: 'ネオエクスデス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '242B', source: '新生艾克斯迪司', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '242B', source: '네오 엑스데스', capture: false }),
      run: function(data) {
        data.phase = 'alpha';
        data.alphaCount = (data.alphaCount || 0) + 1;

        // Common setup.
        data.dieDieDieSound = '../../resources/sounds/Overwatch/Reaper_-_Die_die_die.ogg';
        // TODO: should have options for this.
        data.dieOnLaser = 1;
        data.shouldDieOnLaser = function() {
          if (!this.beyondDeath)
            return false;
          // Beyond death doesn't update for laser #2 if you died on
          // laser #1, so don't tell anybody to die on laser #2.
          // If you still have beyond death, it'll remind you for #3.
          if (this.omegaLaserCount == 2 && this.omegaProbablyDiedOnLaser)
            return false;
          if (this.phase != 'omega')
            return true;
          return this.omegaLaserCount >= this.dieOnLaser;
        };
      },
    },
    {
      id: 'O4S Neo Grand Cross Delta Tracker',
      netRegex: NetRegexes.startsUsing({ id: '242C', source: 'Neo Exdeath', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '242C', source: 'Neo Exdeath', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '242C', source: 'Néo-Exdeath', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '242C', source: 'ネオエクスデス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '242C', source: '新生艾克斯迪司', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '242C', source: '네오 엑스데스', capture: false }),
      run: function(data) {
        data.phase = 'delta';
        data.waterHealer = null;
      },
    },
    {
      id: 'O4S Neo Grand Cross Omega Tracker',
      netRegex: NetRegexes.startsUsing({ id: '242D', source: 'Neo Exdeath', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '242D', source: 'Neo Exdeath', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '242D', source: 'Néo-Exdeath', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '242D', source: 'ネオエクスデス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '242D', source: '新生艾克斯迪司', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '242D', source: '네오 엑스데스', capture: false }),
      run: function(data) {
        data.phase = 'omega';
        data.waterHealer = null;
        data.omegaLaserCount = 1;
      },
    },
    {
      id: 'O4S Neo Neverwhere Tracker',
      netRegex: NetRegexes.startsUsing({ id: '2426', source: 'Neo Exdeath', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2426', source: 'Neo Exdeath', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2426', source: 'Néo-Exdeath', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2426', source: 'ネオエクスデス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2426', source: '新生艾克斯迪司', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2426', source: '네오 엑스데스', capture: false }),
      run: function(data) {
        data.finalphase = true;
      },
    },
    {
      id: 'O4S Neo White Wound Gain',
      netRegex: NetRegexes.gainsEffect({ effectId: '564' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      run: function(data, matches) {
        data.whiteWound = true;
      },
    },
    {
      id: 'O4S Neo White Wound Lost',
      netRegex: NetRegexes.losesEffect({ effectId: '564' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      run: function(data, matches) {
        data.whiteWound = false;
      },
    },
    {
      id: 'O4S Neo Black Wound Gain',
      netRegex: NetRegexes.gainsEffect({ effectId: '565' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      run: function(data, matches) {
        data.blackWound = true;
      },
    },
    {
      id: 'O4S Neo Black Wound Lost',
      netRegex: NetRegexes.losesEffect({ effectId: '565' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      run: function(data, matches) {
        data.blackWound = false;
      },
    },
    {
      id: 'O4S Neo Beyond Death Gain',
      netRegex: NetRegexes.gainsEffect({ effectId: '566' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      run: function(data, matches) {
        data.beyondDeath = true;
      },
    },
    {
      id: 'O4S Neo Beyond Death Lost',
      netRegex: NetRegexes.losesEffect({ effectId: '566' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      run: function(data, matches) {
        data.beyondDeath = false;
      },
    },
    {
      id: 'O4S Neo Allagan Field Gain',
      netRegex: NetRegexes.gainsEffect({ effectId: '1C6' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      run: function(data, matches) {
        data.allaganField = true;
      },
    },
    {
      id: 'O4S Neo Allagan Field Lost',
      netRegex: NetRegexes.losesEffect({ effectId: '1C6' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      run: function(data, matches) {
        data.allaganField = false;
      },
    },
    {
      id: 'O4S Neo Flood of Naught: Inside',
      netRegex: NetRegexes.startsUsing({ id: '240E', source: 'Neo Exdeath', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '240E', source: 'Neo Exdeath', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '240E', source: 'Néo-Exdeath', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '240E', source: 'ネオエクスデス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '240E', source: '新生艾克斯迪司', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '240E', source: '네오 엑스데스', capture: false }),
      durationSeconds: 6,
      sound: function(data) {
        if (data.shouldDieOnLaser())
          return data.dieDieDieSound;
      },
      alarmText: function(data) {
        if (data.shouldDieOnLaser()) {
          return {
            en: 'Die on Inside',
            de: 'Innen sterben',
            ja: '中に死ぬ',
            cn: '在里面死亡',
          };
        }
      },
      alertText: function(data) {
        if (!data.shouldDieOnLaser()) {
          return {
            en: 'Go Outside',
            de: 'Nach Außen',
            ja: '外に出る',
            cn: '去外面',
          };
        }
      },
      tts: function(data) {
        if (data.shouldDieOnLaser()) {
          return {
            en: 'die in in in',
            de: 'sterben rein rein rein',
            ja: '死になさい！',
            cn: '死亡',
          };
        }
        return {
          en: 'out out out',
          de: 'raus raus raus',
          ja: '出ていて！',
          cn: '出去出去',
        };
      },
    },
    {
      id: 'O4S Neo Flood of Naught: Outside',
      netRegex: NetRegexes.startsUsing({ id: '240F', source: 'Neo Exdeath', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '240F', source: 'Neo Exdeath', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '240F', source: 'Néo-Exdeath', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '240F', source: 'ネオエクスデス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '240F', source: '新生艾克斯迪司', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '240F', source: '네오 엑스데스', capture: false }),
      durationSeconds: 6,
      sound: function(data) {
        if (data.shouldDieOnLaser())
          return data.dieDieDieSound;
      },
      alarmText: function(data) {
        if (data.shouldDieOnLaser()) {
          return {
            en: 'Die on Outside',
            de: 'Außen sterben',
            ja: '外に死ぬ',
            cn: '在外面死亡',
          };
        }
      },
      alertText: function(data) {
        if (!data.shouldDieOnLaser()) {
          return {
            en: 'Go Inside',
            de: 'Rein gehen',
            ja: '中に入る',
            cn: '去里面',
          };
        }
      },
      tts: function(data) {
        if (data.shouldDieOnLaser()) {
          return {
            en: 'die out out out',
            de: 'sterben raus raus raus',
            ja: '死になさい！',
            cn: '在外面死亡',
          };
        }
        return {
          en: 'in in in',
          de: 'rein rein rein',
          ja: '入れ入れ',
          cn: '进去进去',
        };
      },
    },
    {
      id: 'O4S Neo Flood of Naught: Colors Purple Blue',
      netRegex: NetRegexes.startsUsing({ id: '2411', source: 'Neo Exdeath', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2411', source: 'Neo Exdeath', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2411', source: 'Néo-Exdeath', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2411', source: 'ネオエクスデス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2411', source: '新生艾克斯迪司', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2411', source: '네오 엑스데스', capture: false }),
      durationSeconds: 6,
      sound: function(data) {
        if (data.shouldDieOnLaser())
          return data.dieDieDieSound;
      },
      alarmText: function(data) {
        if (!data.shouldDieOnLaser())
          return;

        if (data.blackWound) {
          return {
            en: 'Die On Right Blue',
            de: 'In Blauem rechts sterben',
            ja: '右の青色に死ぬ',
            cn: '在右边蓝色死亡',
          };
        } else if (data.whiteWound) {
          return {
            en: 'Die On Left Purple',
            de: 'In Pinkem links sterben',
            ja: '左の紫色に死ぬ',
            cn: '在左边紫色死亡',
          };
        }
        return {
          en: 'Die on color sides',
          de: 'Auf Farben sterben',
          ja: '同じ色に死ぬ',
          cn: '在同色一边死亡',
        };
      },
      alertText: function(data) {
        if (data.shouldDieOnLaser())
          return;

        if (data.blackWound) {
          return {
            en: 'Left On Purple',
            de: 'Links auf Pink',
            ja: '左の紫色に',
            cn: '左边紫色',
          };
        } else if (data.whiteWound) {
          return {
            en: 'Right On Blue',
            de: 'Rechts auf Blau',
            ja: '右の青色に',
            cn: '右边蓝色',
          };
        }
        return {
          en: 'Color sides',
          de: 'Farbige Seiten',
          ja: '同じ色に',
          cn: '颜色一侧',
        };
      },
      tts: {
        en: 'colors',
        de: 'Farben',
        ja: '色',
      },
    },
    {
      id: 'O4S Neo Flood of Naught: Colors Blue Purple',
      netRegex: NetRegexes.startsUsing({ id: '2412', source: 'Neo Exdeath', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2412', source: 'Neo Exdeath', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2412', source: 'Néo-Exdeath', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2412', source: 'ネオエクスデス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2412', source: '新生艾克斯迪司', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2412', source: '네오 엑스데스', capture: false }),
      durationSeconds: 6,
      sound: function(data) {
        if (data.shouldDieOnLaser())
          return data.dieDieDieSound;
      },
      alarmText: function(data) {
        if (!data.shouldDieOnLaser())
          return;

        if (data.blackWound) {
          return {
            en: 'Die On Left Blue',
            de: 'Auf Blauem links sterben',
            ja: '左の青色に死ぬ',
            cn: '在左边蓝色死亡',
          };
        } else if (data.whiteWound) {
          return {
            en: 'Die On Right Purple',
            de: 'Auf Pinkem rechts sterben',
            ja: '右の紫色に死ぬ',
            cn: '在右边紫色死亡',
          };
        }
        return {
          en: 'Die on color sides',
          de: 'Auf Farben sterben',
          ja: '同じ色に死ぬ',
          cn: '在同色一边死亡',
        };
      },
      alertText: function(data) {
        if (data.shouldDieOnLaser())
          return;

        if (data.blackWound) {
          return {
            en: 'Be Right On Purple',
            de: 'Rechts auf Pink',
            ja: '右の紫色に',
            cn: '去右边紫色',
          };
        } else if (data.whiteWound) {
          return {
            en: 'Be Left On Blue',
            de: 'Links auf Blau',
            ja: '左の青色に',
            cn: '去左边蓝色',
          };
        }
        return {
          en: 'Color sides',
          de: 'Farbige Seiten',
          ja: '同じ色に',
          cn: '颜色一侧',
        };
      },
      tts: {
        en: 'colors',
        de: 'farben',
        ja: '色',
        cn: '颜色',
      },
    },
    {
      id: 'O4S Neo Laser Counter',
      netRegex: NetRegexes.startsUsing({ id: ['240E', '240F', '2411', '2412'], source: 'Neo Exdeath', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['240E', '240F', '2411', '2412'], source: 'Neo Exdeath', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['240E', '240F', '2411', '2412'], source: 'Néo-Exdeath', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['240E', '240F', '2411', '2412'], source: 'ネオエクスデス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: ['240E', '240F', '2411', '2412'], source: '新生艾克斯迪司', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: ['240E', '240F', '2411', '2412'], source: '네오 엑스데스', capture: false }),
      run: function(data) {
        if (data.phase != 'omega')
          return;


        // See comments in shouldDieOnLaser.  Beyond Death
        // doesn't get removed until after the 2nd laser
        // appears.  However, colors (THANKFULLY) apply
        // before the next laser appears.
        if (data.shouldDieOnLaser())
          data.omegaProbablyDiedOnLaser = true;


        data.omegaLaserCount++;
      },
    },
    {
      id: 'O4S Neo Flood of Naught: Charge',
      netRegex: NetRegexes.startsUsing({ id: '2416', source: 'Neo Exdeath', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2416', source: 'Neo Exdeath', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2416', source: 'Néo-Exdeath', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2416', source: 'ネオエクスデス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2416', source: '新生艾克斯迪司', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2416', source: '네오 엑스데스', capture: false }),
      infoText: function(data) {
        if (data.allaganField) {
          if (data.role == 'tank') {
            return {
              en: 'Charge: be behind other tank',
              de: 'Aufladung: hinter anderen Tank',
              ja: '突進: 他のタンクの後ろに',
              cn: '站在另一个坦克后面',
            };
          }
          return {
            en: 'Charge: be in the very back',
            de: 'Aufladung: Ganz nach hinten',
            ja: '突進: 後ろの遠くへ',
            cn: '去后面',
          };
        }
        if (data.role == 'tank') {
          return {
            en: 'Charge: be in front!',
            de: 'Aufladung: Ganz nach vorn',
            ja: '突進: 前方に',
            cn: '去前面',
          };
        }
        return {
          en: 'Charge: be behind tanks',
          de: 'Aufladung: Hinter die Tanks',
          ja: '突進: タンクの後ろに',
          cn: '站在坦克后面',
        };
      },
      tts: {
        en: 'charge',
        de: 'aufladung',
        cn: '充能',
        ja: '無の氾濫',
      },
    },
    {
      id: 'O4S Neo Double Attack',
      netRegex: NetRegexes.startsUsing({ id: '241C', source: 'Neo Exdeath', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '241C', source: 'Neo Exdeath', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '241C', source: 'Néo-Exdeath', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '241C', source: 'ネオエクスデス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '241C', source: '新生艾克斯迪司', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '241C', source: '네오 엑스데스', capture: false }),
      alertText: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'Double Attack',
            de: 'Doppelangriff',
            ja: 'ダブルアタック',
            cn: '双重攻击',
          };
        }
        return {
          en: 'Double Attack: Get out',
          de: 'Doppelangriff: Raus da',
          ja: 'ダブルアタック: 外へ',
          cn: '双重攻击：去外面',
        };
      },
      tts: {
        en: 'double attack',
        de: 'Doppelangriff',
        ja: 'ダブルアタック',
        cn: '双重攻击',
      },
    },
    { // Grand Cross Alpha.
      id: 'O4S Neo Grand Cross Alpha',
      netRegex: NetRegexes.startsUsing({ id: '242B', source: 'Neo Exdeath', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '242B', source: 'Neo Exdeath', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '242B', source: 'Néo-Exdeath', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '242B', source: 'ネオエクスデス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '242B', source: '新生艾克斯迪司', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '242B', source: '네오 엑스데스', capture: false }),
      infoText: {
        en: 'Grand Cross Alpha: Go to middle',
        de: 'Supernova Alpha: In die Mitte',
        ja: 'グランドクロス・アルファ: 中央に',
        cn: '前往中间集合',
      },
      tts: {
        en: 'go to middle',
        de: 'In die Mitte',
        ja: '中央に',
        cn: '前往中间',
      },
    },
    {
      id: 'O4S Neo Grand Cross Delta',
      netRegex: NetRegexes.startsUsing({ id: '242C', source: 'Neo Exdeath', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '242C', source: 'Neo Exdeath', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '242C', source: 'Néo-Exdeath', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '242C', source: 'ネオエクスデス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '242C', source: '新生艾克斯迪司', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '242C', source: '네오 엑스데스', capture: false }),
      infoText: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'Grand Cross Delta: Be in front of boss',
            de: 'Supernova Delta: Vor den Boss',
            ja: 'グランドクロス・デルタ: ボスの前に',
            cn: '站在boss前面',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Grand Cross Delta: Be on sides of boss',
            de: 'Supernova Delta: An die Seiten vom Boss',
            ja: 'グランドクロス・デルタ: ボスの横に',
            cn: '站在boss后面',
          };
        }
        return {
          en: 'Grand Cross Delta: Inside boss',
          de: 'Supernvoa Delta: In den Boss',
          ja: 'グランドクロス・デルタ: ボスの真ん中に',
          cn: '站在boss中间',
        };
      },
      tts: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'delta: be in front',
            de: 'delta: vor den boss',
            ja: 'ボスの前に',
            cn: '去前面',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'delta: be on sides',
            de: 'delta: an die seiten',
            ja: 'ボスの横に',
            cn: '去两侧',
          };
        }
        return {
          en: 'delta: be inside boss',
          de: 'delta: in den boss',
          ja: 'ボスの真ん中に',
          cn: '去boss中间',
        };
      },
    },
    {
      id: 'O4S Neo Grand Cross Omega',
      netRegex: NetRegexes.startsUsing({ id: '242D', source: 'Neo Exdeath', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '242D', source: 'Neo Exdeath', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '242D', source: 'Néo-Exdeath', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '242D', source: 'ネオエクスデス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '242D', source: '新生艾克斯迪司', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '242D', source: '네오 엑스데스', capture: false }),
      response: Responses.goMiddle(),
    },
    {
      id: 'O4S Neo Forked Lightning',
      netRegex: NetRegexes.gainsEffect({ effectId: '24B' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      delaySeconds: 1,
      response: Responses.spread(),
    },
    {
      id: 'O4S Neo Acceleration Bomb',
      netRegex: NetRegexes.gainsEffect({ effectId: '568' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      delaySeconds: function(data, matches) {
        return parseFloat(matches.duration) - 4;
      }, // 4 second warning.
      alarmText: function(data) {
        if (data.phase == 'omega') {
          return {
            en: 'look away and stop',
            de: 'wegschauen und stehenbleiben',
            ja: '見ない、動かない',
            cn: '看外面并静止',
          };
        }
        return {
          en: 'stop',
          de: 'Stopp',
          ja: '動かない',
          cn: '静止',
        };
      },
    },
    {
      id: 'O4S Neo Acceleration Bomb Delta',
      netRegex: NetRegexes.gainsEffect({ effectId: '568' }),
      condition: function(data, matches) {
        return matches.target == data.me && data.phase == 'delta';
      },
      infoText: {
        en: 'Acceleration Bomb',
        de: 'Beschleunigungsbombe',
        ja: '加速度爆弾',
        cn: '加速度炸弹',
      },
      tts: {
        en: 'bomb',
        de: 'bombe',
        ja: '加速度爆弾',
        cn: '加速度炸弹',
      },
    },
    {
      id: 'O4S Neo Omega Shriek',
      netRegex: NetRegexes.gainsEffect({ effectId: '1C4' }),
      condition: function(data, matches) {
        return matches.target == data.me && data.phase == 'omega';
      },
      delaySeconds: function(data, matches) {
        return parseFloat(matches.duration) - 5;
      },
      alertText: {
        en: 'shriek: get mid, look away',
        de: 'Schrei: Zur mitte und wegschauen',
        ja: '呪詛の叫声: 中へ、外に向け',
        cn: '石化点名',
      },
      tts: {
        en: 'shriek',
        de: 'schrei',
        ja: '呪詛の叫声',
        cn: '石化',
      },
    },
    {
      id: 'O4S Neo Water Tracker',
      netRegex: NetRegexes.gainsEffect({ effectId: '3FF' }),
      run: function(data, matches) {
        data.waterHealer = matches.target;
      },
    },
    {
      // Water Me (Delta/Omega)
      id: 'O4S Neo Water Me',
      netRegex: NetRegexes.gainsEffect({ effectId: '3FF' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      alarmText: function(data) {
        // Not clear where to tell the healer where to go on delta
        // due to picking a side for uptime strat, or other strats.
        if (data.phase == 'delta') {
          return {
            en: 'water on you',
            de: 'wasser auf dir',
            ja: '自分に水属性圧縮',
            cn: '水点名',
          };
        } else if (data.phase == 'omega') {
          return {
            en: 'water: stack under neo',
            de: 'Wasser: Unter Neo stacken',
            ja: '水属性圧縮: ボスの下に頭割り',
            cn: '去下面',
          };
        }
      },
      tts: {
        en: 'water stack',
        de: 'Wasser stek',
        ja: '頭割り',
        cn: '水分摊',
      },
    },
    {
      // Beyond Death Tank (Delta)
      id: 'O4S Neo Beyond Death Delta Tank',
      netRegex: NetRegexes.gainsEffect({ effectId: '566' }),
      condition: function(data, matches) {
        return data.phase == 'delta' && matches.target == data.me && data.role == 'tank';
      },
      delaySeconds: 0.5,
      infoText: function(data) {
        // Something went awry, or maybe healers dead.  Just say stack on water anyway,
        // instead of trying to be smart when the healers die.
        if (data.waterHealer) {
          return {
            en: 'Stack on ' + data.waterHealer,
            de: 'Stack auf ' + data.waterHealer,
            ja: data.waterHealer + 'に頭割り',
            cn: '分摊于' + data.waterHealer,
          };
        }
        return {
          en: 'Stack on water',
          de: 'Bei Wasser stacken',
          ja: '水持ちと頭割り',
          cn: '和水点名分摊',
        };
      },
      tts: {
        en: 'water stack',
        de: 'wasser stek',
        ja: '頭割り',
        cn: '水分摊',
      },
    },
    {
      // Beyond Death (Delta)
      id: 'O4S Neo Beyond Death Delta Initial',
      netRegex: NetRegexes.gainsEffect({ effectId: '566' }),
      condition: function(data, matches) {
        return data.phase == 'delta' && matches.target == data.me && data.role != 'tank';
      },
      infoText: {
        en: 'Beyond Death',
        de: 'Jenseis Des Jenseits',
        ja: '死の超越',
        cn: '超越死亡',
      },
      tts: {
        en: 'death',
        de: 'tod',
        ja: '死',
        cn: '找死',
      },
    },
    {
      // Off Balance (Omega)
      id: 'O4S Neo Off Balance Omega',
      netRegex: NetRegexes.gainsEffect({ effectId: '569' }),
      condition: function(data, matches) {
        return data.phase == 'omega' && matches.target == data.me;
      },
      delaySeconds: 0.5,
      infoText: function(data) {
        // Good for both dps and tanks.
        if (data.waterHealer) {
          return {
            en: 'Stack under boss on ' + data.waterHealer,
            de: 'Unter Boss auf ' + data.waterHealer + ' stacken',
            ja: 'ボスの下に' + data.waterHealer + 'と頭割り',
            cn: '分摊于' + data.waterHealer,
          };
        }
        return {
          en: 'Stack on water',
          de: 'Auf Wasser stacken',
          ja: '水と頭割り',
          cn: '和水点名分摊',
        };
      },
      tts: {
        en: 'water stack',
        de: 'Wasser stek',
        ja: '頭割り',
        cn: '水分摊',
      },
    },
    {
      id: 'O4S Neo Earthshaker on Tank',
      netRegex: NetRegexes.headMarker({ id: '0028' }),
      condition: function(data, matches) {
        return matches.target == data.me && data.role == 'tank';
      },
      response: Responses.earthshaker('info'),
    },
    {
      id: 'O4S Neo Earthshaker on not Tank',
      netRegex: NetRegexes.headMarker({ id: '0028' }),
      condition: function(data, matches) {
        return matches.target == data.me && data.role != 'tank';
      },
      response: Responses.earthshaker('alarm'),
    },
    {
      id: 'O4S Neo Delta Attack',
      netRegex: NetRegexes.startsUsing({ id: '241E', source: 'Neo Exdeath', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '241E', source: 'Neo Exdeath', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '241E', source: 'Néo-Exdeath', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '241E', source: 'ネオエクスデス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '241E', source: '新生艾克斯迪司', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '241E', source: '네오 엑스데스', capture: false }),
      response: Responses.stackMarker(),
    },
    {
      id: 'O4S Neo Almagest',
      netRegex: NetRegexes.startsUsing({ id: '2417', source: 'Neo Exdeath', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2417', source: 'Neo Exdeath', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2417', source: 'Néo-Exdeath', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2417', source: 'ネオエクスデス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2417', source: '新生艾克斯迪司', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2417', source: '네오 엑스데스', capture: false }),
      alertText: {
        en: 'Almagest',
        de: 'Almagest',
        ja: 'アルマゲスト',
        cn: '大AOE',
      },
      tts: {
        en: 'almagest',
        de: 'almagest',
        ja: 'アルマゲスト',
        cn: '大AOE',
      },
      run: function(data) {
        data.almagestCount = (data.almagestCount || 0) + 1;
      },
    },
    {
      id: 'O4S Neo Flare',
      netRegex: NetRegexes.startsUsing({ id: '2401', source: 'Neo Exdeath' }),
      netRegexDe: NetRegexes.startsUsing({ id: '2401', source: 'Neo Exdeath' }),
      netRegexFr: NetRegexes.startsUsing({ id: '2401', source: 'Néo-Exdeath' }),
      netRegexJa: NetRegexes.startsUsing({ id: '2401', source: 'ネオエクスデス' }),
      netRegexCn: NetRegexes.startsUsing({ id: '2401', source: '新生艾克斯迪司' }),
      netRegexKo: NetRegexes.startsUsing({ id: '2401', source: '네오 엑스데스' }),
      condition: function(data, matches) {
        data.flareTargets = data.flareTargets || [];
        data.flareTargets.push(matches.target);
        return data.flareTargets.length == 3;
      },
      alarmText: function(data) {
        if (data.flareTargets.includes(data.me)) {
          return {
            en: 'Flare on you',
            de: 'Flare auf dir',
            ja: '自分にフレア',
            cn: '核爆点名',
          };
        }
      },
      infoText: function(data) {
        if (!data.flareTargets.includes(data.me)) {
          return {
            en: 'Light and Darkness: Stack',
            de: 'Licht und Dunkel: Stack',
            ja: 'ライト・アンド・ダークネス: 頭割り',
            cn: '分摊点名',
          };
        }
      },
      tts: function(data) {
        if (data.flareTargets.includes(data.me)) {
          return {
            en: 'flare on you',
            de: 'fleer auf dir',
            ja: '自分にフレア',
            cn: '核爆点名',
          };
        }
        return {
          en: 'stack',
          de: 'stek',
          ja: '頭割り',
          cn: '分摊',
        };
      },
      run: function(data) {
        delete data.flareTargets;
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Exdeath': 'Exdeath',
      },
      'replaceText': {
        '--Acceleration Bomb Resolves--': '--Beschleunigungsbombe löst sich auf--',
        '--Allagan Field Explodes--': '--Allagisches Feld explodiert--',
        '--Boss Targetable--': '--Boss anvisierbar--',
        '--Boss Untargetable--': '--Boss nicht anvisierbar--',
        '--LB Gauge Resets--': '--LB Leiste reset--',
        'Aero III': 'Windga',
        'Almagest': 'Almagest',
        'Black Hole': 'Schwarzes Loch',
        'Blizzard III': 'Eisga',
        'Charge': 'Sturm',
        'Charybdis': 'Charybdis',
        'Cursed Shriek': 'Schrei der Verwünschung',
        'Delta Attack': 'Delta-Attacke',
        'Double Attack': 'Doppelangriff',
        'Dualcast': 'Doppelzauber',
        'Earth Shaker': 'Erdstoß',
        'Emptiness': 'Tobende Leere',
        'Final Battle': 'Finaler Kampf',
        'Fire III': 'Feuga',
        'Flare': 'Flare',
        'Flood of Naught': 'Flut der Leere',
        'Forked Lightning': 'Gabelblitz',
        'Frenzied Fist': 'Rasende Faust',
        'Frenzied Sphere': 'Rasender Orbis',
        'Grand Cross Alpha': 'Supernova Alpha',
        'Grand Cross Delta': 'Supernova Delta',
        'Grand Cross Omega': 'Supernova Omega',
        'HP Down Debuff': 'Verringerte HP Debuff',
        'Holy': 'Sanctus',
        'Knockback': 'Rückstoß',
        'Light and Darkness': 'Licht und Dunkelheit',
        'Meteor': 'Meteo',
        'Neverwhere': 'Nirgendwann',
        'Random Elemental': 'Zufälliges Elementar',
        'Thunder III': 'Blitzga',
        'Vacuum Wave': 'Vakuumwelle',
        'Water': 'Aqua',
        'White Hole': 'Weißes Loch',
        'Zombie Breath': 'Zombie-Atem',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Exdeath': 'Exdeath',
      },
      'replaceText': {
        'Aero III': 'Méga Vent',
        'Almagest': 'Almageste',
        'Black Hole': 'Trou noir',
        'Blizzard III': 'Méga Glace',
        'Charge': 'Charge',
        'Charybdis': 'Charybde',
        'Cursed Shriek': 'Cri maudit',
        'Delta Attack': 'Attaque Delta',
        'Double Attack': 'Double attaque',
        'Dualcast': 'Chaîne de sorts',
        'Earth Shaker': 'Secousse',
        'Emptiness': 'Désolation du néant',
        'Fire III': 'Méga Feu',
        'Flare': 'Brasier',
        'Flood of Naught': 'Crue du néant',
        'Forked Lightning': 'Éclair ramifié',
        'Frenzied Fist': 'Poing de la démence',
        'Frenzied Sphere': 'Démence terminale',
        'Grand Cross Alpha': 'Croix suprême alpha',
        'Grand Cross Delta': 'Croix suprême delta',
        'Grand Cross Omega': 'Croix suprême oméga',
        'Holy': 'Miracle',
        'Light and Darkness': 'Clair-obscur',
        'Meteor': 'Météore',
        'Neverwhere': 'Anarchie',
        'Thunder III': 'Méga Foudre',
        'Vacuum Wave': 'Vague de vide',
        'Water': 'Eau',
        'White Hole': 'Trou blanc',
        'Zombie Breath': 'Haleine zombie',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Exdeath': 'エクスデス',
      },
      'replaceText': {
        '--Acceleration Bomb Resolves--': '--加速度爆弾処理--',
        '--Allagan Field Explodes--': '--アラガンフィールド処理--',
        '--Boss Targetable--': '--ボスターゲット可能--',
        '--Boss Untargetable--': '--ボスターゲット不可--',
        '--LB Gauge Resets--': '--LBゲージリセット--',
        'Aero III': 'エアロガ',
        'Almagest': 'アルマゲスト',
        'Black Hole': 'ブラックホール',
        'Blizzard III': 'ブリザガ',
        'Charge': 'チャージ',
        'Charybdis': 'ミールストーム',
        'Cursed Shriek': '呪詛の叫声',
        'Delta Attack': 'デルタアタック',
        'Double Attack': 'ダブルアタック',
        'Dualcast': '連続魔',
        'Earth Shaker': 'アースシェイカー',
        'Emptiness': '無の暴走',
        'Final Battle': '最後の闘い',
        'Fire III': 'ファイガ',
        'Flare': 'フレア',
        'Flood of Naught': '無の氾濫',
        'Forked Lightning': 'フォークライトニング',
        'Frenzied Fist': '狂乱の拳',
        'Frenzied Sphere': '狂乱の極地',
        'Grand Cross Alpha': 'グランドクロス・アルファ',
        'Grand Cross Delta': 'グランドクロス・デルタ',
        'Grand Cross Omega': 'グランドクロス・オメガ',
        'HP Down Debuff': '最大HPダウン',
        'Holy': 'ホーリー',
        'Knockback': 'ノックバック',
        'Light and Darkness': 'ライト・アンド・ダークネス',
        'Meteor': 'メテオ',
        'Neverwhere': '法則崩壊',
        'Random Elemental': 'ランダムエレメント',
        'Thunder III': 'サンダガ',
        'Vacuum Wave': '真空波',
        'Water': 'ウォータ',
        'White Hole': 'ホワイトホール',
        'Zombie Breath': 'ゾンビブレス',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Exdeath': '艾克斯迪司',
      },
      'replaceText': {
        '--Acceleration Bomb Resolves--': '--加速度炸弹处理--',
        '--Allagan Field Explodes--': '--亚拉戈领域爆炸--',
        '--Boss Targetable--': '--Boss 可选中--',
        '--Boss Untargetable--': '--Boss 不可选中--',
        '--LB Gauge Resets--': '--LB量表重置--',
        'Aero III': '暴风',
        'Almagest': '至高无上',
        'Black Hole': '黑洞',
        'Blizzard III': '冰封',
        'Charge': '刺冲',
        'Charybdis': '大漩涡',
        'Cursed Shriek': '诅咒之嚎',
        'Delta Attack': '三角攻击',
        'Double Attack': '双重攻击',
        'Tethers': '连线',
        'Dualcast': '连续咏唱',
        'Earth Shaker': '大地摇动',
        'Emptiness': '无之失控',
        'Final Battle': '最终之战',
        'Fire III': '爆炎',
        'Flare': '核爆',
        'Flood of Naught': '无之泛滥',
        'Forked Lightning': '叉形闪电',
        'Frenzied Fist': '狂乱之拳',
        'Frenzied Sphere': '狂乱领域',
        'Grand Cross Alpha': '大十字·阿尔法',
        'Grand Cross Delta': '大十字·德尔塔',
        'Grand Cross Omega': '大十字·欧米茄',
        'HP Down Debuff': 'HP下降Debuff',
        'Holy': '神圣',
        'Knockback': '击退',
        'Light and Darkness': '光与暗',
        'Meteor': '陨石',
        'Neverwhere': '规律崩坏',
        'Random Elemental': '随机元灵',
        'Thunder III': '暴雷',
        'Vacuum Wave': '真空波',
        'Water': '流水',
        'White Hole': '白洞',
        'Zombie Breath': '死亡吐息',
      },
    },
    {
      'locale': 'ko',
      'missingTranslations': true,
      'replaceSync': {
        'Exdeath': '엑스데스',
      },
      'replaceText': {
        'Aero III': '에어로가',
        'Almagest': '알마게스트',
        'Black Hole': '블랙홀',
        'Blizzard III': '블리자가',
        'Charge': '돌격',
        'Charybdis': '대소용돌이',
        'Cursed Shriek': '저주의 외침',
        'Delta Attack': '델타 공격',
        'Double Attack': '이중 공격',
        'Dualcast': '연속 마법',
        'Earth Shaker': '요동치는 대지',
        'Emptiness': '무의 폭주',
        'Fire III': '파이가',
        'Flare': '플레어',
        'Flood of Naught': '무의 범람',
        'Frenzied Fist': '광란의 주먹',
        'Frenzied Sphere': '광란의 극지',
        'Grand Cross Alpha': '그랜드크로스: 알파',
        'Grand Cross Delta': '그랜드크로스: 델타',
        'Grand Cross Omega': '그랜드크로스: 오메가',
        'Holy': '홀리',
        'Light and Darkness': '빛과 어둠',
        'Meteor': '메테오',
        'Neverwhere': '법칙 붕괴',
        'Thunder III': '선더가',
        'Vacuum Wave': '진공파',
        'Water': '워터',
        'White Hole': '화이트홀',
        'Zombie Breath': '좀비 숨결',
      },
    },
  ],
}];
