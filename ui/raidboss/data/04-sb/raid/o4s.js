'use strict';

// O4S - Deltascape 4.0 Savage
[{
  zoneRegex: {
    en: /^Deltascape V4\.0 \(Savage\)$/,
    cn: /^欧米茄零式时空狭缝 \(德尔塔幻境4\)$/,
  },
  timelineFile: 'o4s.txt',
  timelineTriggers: [
    {
      id: 'O4S Neo Vacuum Wave',
      regex: /Vacuum Wave/,
      beforeSeconds: 8,
      alertText: {
        en: 'Vacuum Wave soon',
        de: 'Vakuumwelle bald',
        cn: '马上真空波',
      },
    },
  ],
  triggers: [
    // Part 1
    {
      // Phase Tracker: Thunder III not after Decisive Battle.
      id: 'O4S Exdeath Thunder III Counter',
      regex: Regexes.startsUsing({ id: '23F9', source: 'Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '23F9', source: 'Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '23F9', source: 'Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: '23F9', source: 'エクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '23F9', source: '艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: '23F9', source: '엑스데스', capture: false }),
      run: function(data) {
        data.thunderCount = (data.thunderCount || 0) + 1;
      },
    },
    {
      // Fire III not after Decisive Battle.
      id: 'O4S Exdeath Fire III Counter',
      regex: Regexes.startsUsing({ id: '23F5', source: 'Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '23F5', source: 'Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '23F5', source: 'Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: '23F5', source: 'エクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '23F5', source: '艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: '23F5', source: '엑스데스', capture: false }),
      infoText: {
        en: 'Fire III',
        de: 'Feuga',
        cn: '静止',
      },
    },
    {
      // Blizzard III not after Decisive Battle.
      id: 'O4S Exdeath Blizzard III',
      regex: Regexes.startsUsing({ id: '23F7', source: 'Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '23F7', source: 'Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '23F7', source: 'Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: '23F7', source: 'エクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '23F7', source: '艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: '23F7', source: '엑스데스', capture: false }),
      infoText: {
        en: 'Blizzard III',
        de: 'Eisga',
        cn: '蛇皮走位',
      },
    },
    {
      // Thunder III not after Decisive Battle.
      id: 'O4S Exdeath Thunder III',
      regex: Regexes.startsUsing({ id: '23F9', source: 'Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '23F9', source: 'Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '23F9', source: 'Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: '23F9', source: 'エクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '23F9', source: '艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: '23F9', source: '엑스데스', capture: false }),
      alertText: function(data) {
        // Tanks/healers always get an alert.
        if (data.role == 'tank' || data.role == 'healer') {
          return {
            en: 'Thunder III: Tank buster',
            de: 'Blitzga: Tank buster',
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
          cn: '雷三',
        };
      },
      tts: function(data) {
        if (data.role == 'tank' || data.role == 'healer') {
          return {
            en: 'thunder',
            de: 'blitzga',
            cn: '远离',
          };
        }
      },
    },
    {
      // Fire III after Decisive Battle.
      id: 'O4S Exdeath Ultimate Fire III',
      regex: Regexes.startsUsing({ id: '23FB', source: 'Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '23FB', source: 'Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '23FB', source: 'Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: '23FB', source: 'エクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '23FB', source: '艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: '23FB', source: '엑스데스', capture: false }),
      response: Responses.stopMoving(),
    },
    {
      // Blizzard III after Decisive Battle.
      id: 'O4S Exdeath Ultimate Blizzard III',
      regex: Regexes.startsUsing({ id: '23FC', source: 'Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '23FC', source: 'Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '23FC', source: 'Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: '23FC', source: 'エクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '23FC', source: '艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: '23FC', source: '엑스데스', capture: false }),
      response: Responses.move(),
    },
    {
      // Thunder III after Decisive Battle.
      id: 'O4S Exdeath Ultimate Thunder III',
      regex: Regexes.startsUsing({ id: '23FD', source: 'Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '23FD', source: 'Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '23FD', source: 'Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: '23FD', source: 'エクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '23FD', source: '艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: '23FD', source: '엑스데스', capture: false }),
      response: Responses.getOut(),
    },
    {
      // Flare
      id: 'O4S Exdeath Flare',
      regex: Regexes.startsUsing({ id: '2401', source: 'Exdeath' }),
      regexDe: Regexes.startsUsing({ id: '2401', source: 'Exdeath' }),
      regexFr: Regexes.startsUsing({ id: '2401', source: 'Exdeath' }),
      regexJa: Regexes.startsUsing({ id: '2401', source: 'エクスデス' }),
      regexCn: Regexes.startsUsing({ id: '2401', source: '艾克斯迪司' }),
      regexKo: Regexes.startsUsing({ id: '2401', source: '엑스데스' }),
      condition: function(data, matches) {
        data.flareTargets = data.flareTargets || [];
        data.flareTargets.push(matches.target);
        return data.flareTargets.length == 3;
      },
      alarmText: function(data) {
        if (data.flareTargets.indexOf(data.me) >= 0) {
          return {
            en: 'Flare on you',
            de: 'Flare auf dir',
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
      regex: Regexes.startsUsing({ id: '242B', source: 'Neo Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '242B', source: 'Neo Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '242B', source: 'Néo-Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: '242B', source: 'ネオエクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '242B', source: '新生艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: '242B', source: '네오 엑스데스', capture: false }),
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
      regex: Regexes.startsUsing({ id: '242C', source: 'Neo Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '242C', source: 'Neo Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '242C', source: 'Néo-Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: '242C', source: 'ネオエクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '242C', source: '新生艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: '242C', source: '네오 엑스데스', capture: false }),
      run: function(data) {
        data.phase = 'delta';
        data.waterHealer = null;
      },
    },
    {
      id: 'O4S Neo Grand Cross Omega Tracker',
      regex: Regexes.startsUsing({ id: '242D', source: 'Neo Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '242D', source: 'Neo Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '242D', source: 'Néo-Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: '242D', source: 'ネオエクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '242D', source: '新生艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: '242D', source: '네오 엑스데스', capture: false }),
      run: function(data) {
        data.phase = 'omega';
        data.waterHealer = null;
        data.omegaLaserCount = 1;
      },
    },
    {
      id: 'O4S Neo Neverwhere Tracker',
      regex: Regexes.startsUsing({ id: '2426', source: 'Neo Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2426', source: 'Neo Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2426', source: 'Néo-Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2426', source: 'ネオエクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2426', source: '新生艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2426', source: '네오 엑스데스', capture: false }),
      run: function(data) {
        data.finalphase = true;
      },
    },
    {
      id: 'O4S Neo White Wound Gain',
      regex: Regexes.gainsEffect({ effect: 'White Wound' }),
      regexDe: Regexes.gainsEffect({ effect: 'Wunde Des Lebenden' }),
      regexFr: Regexes.gainsEffect({ effect: 'Lésion Du Vivant' }),
      regexJa: Regexes.gainsEffect({ effect: '生者の傷' }),
      regexCn: Regexes.gainsEffect({ effect: '生者之伤' }),
      regexKo: Regexes.gainsEffect({ effect: '산 자의 상처' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      run: function(data, matches) {
        data.whiteWound = true;
      },
    },
    {
      id: 'O4S Neo White Wound Lost',
      regex: Regexes.losesEffect({ effect: 'White Wound' }),
      regexDe: Regexes.losesEffect({ effect: 'Wunde Des Lebenden' }),
      regexFr: Regexes.losesEffect({ effect: 'Lésion Du Vivant' }),
      regexJa: Regexes.losesEffect({ effect: '生者の傷' }),
      regexCn: Regexes.losesEffect({ effect: '生者之伤' }),
      regexKo: Regexes.losesEffect({ effect: '산 자의 상처' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      run: function(data, matches) {
        data.whiteWound = false;
      },
    },
    {
      id: 'O4S Neo Black Wound Gain',
      regex: Regexes.gainsEffect({ effect: 'Black Wound' }),
      regexDe: Regexes.gainsEffect({ effect: 'Wunde Des Toten' }),
      regexFr: Regexes.gainsEffect({ effect: 'Lésion Du Défunt' }),
      regexJa: Regexes.gainsEffect({ effect: '死者の傷' }),
      regexCn: Regexes.gainsEffect({ effect: '死者之伤' }),
      regexKo: Regexes.gainsEffect({ effect: '죽은 자의 상처' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      run: function(data, matches) {
        data.blackWound = true;
      },
    },
    {
      id: 'O4S Neo Black Wound Lost',
      regex: Regexes.losesEffect({ effect: 'Black Wound' }),
      regexDe: Regexes.losesEffect({ effect: 'Wunde Des Toten' }),
      regexFr: Regexes.losesEffect({ effect: 'Lésion Du Défunt' }),
      regexJa: Regexes.losesEffect({ effect: '死者の傷' }),
      regexCn: Regexes.losesEffect({ effect: '死者之伤' }),
      regexKo: Regexes.losesEffect({ effect: '죽은 자의 상처' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      run: function(data, matches) {
        data.blackWound = false;
      },
    },
    {
      id: 'O4S Neo Beyond Death Gain',
      regex: Regexes.gainsEffect({ effect: 'Beyond Death' }),
      regexDe: Regexes.gainsEffect({ effect: 'Jenseits Des Jenseits' }),
      regexFr: Regexes.gainsEffect({ effect: 'Outre-Mort' }),
      regexJa: Regexes.gainsEffect({ effect: '死の超越' }),
      regexCn: Regexes.gainsEffect({ effect: '超越死亡' }),
      regexKo: Regexes.gainsEffect({ effect: '죽음 초월' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      run: function(data, matches) {
        data.beyondDeath = true;
      },
    },
    {
      id: 'O4S Neo Beyond Death Lost',
      regex: Regexes.losesEffect({ effect: 'Beyond Death' }),
      regexDe: Regexes.losesEffect({ effect: 'Jenseits Des Jenseits' }),
      regexFr: Regexes.losesEffect({ effect: 'Outre-Mort' }),
      regexJa: Regexes.losesEffect({ effect: '死の超越' }),
      regexCn: Regexes.losesEffect({ effect: '超越死亡' }),
      regexKo: Regexes.losesEffect({ effect: '죽음 초월' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      run: function(data, matches) {
        data.beyondDeath = false;
      },
    },
    {
      id: 'O4S Neo Allagan Field Gain',
      regex: Regexes.gainsEffect({ effect: 'Allagan Field' }),
      regexDe: Regexes.gainsEffect({ effect: 'Allagisches Feld' }),
      regexFr: Regexes.gainsEffect({ effect: 'Champ Allagois' }),
      regexJa: Regexes.gainsEffect({ effect: 'アラガンフィールド' }),
      regexCn: Regexes.gainsEffect({ effect: '亚拉戈领域' }),
      regexKo: Regexes.gainsEffect({ effect: '알라그 필드' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      run: function(data, matches) {
        data.allaganField = true;
      },
    },
    {
      id: 'O4S Neo Allagan Field Lost',
      regex: Regexes.losesEffect({ effect: 'Allagan Field' }),
      regexDe: Regexes.losesEffect({ effect: 'Allagisches Feld' }),
      regexFr: Regexes.losesEffect({ effect: 'Champ Allagois' }),
      regexJa: Regexes.losesEffect({ effect: 'アラガンフィールド' }),
      regexCn: Regexes.losesEffect({ effect: '亚拉戈领域' }),
      regexKo: Regexes.losesEffect({ effect: '알라그 필드' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      run: function(data, matches) {
        data.allaganField = false;
      },
    },
    {
      id: 'O4S Neo Flood of Naught: Inside',
      regex: Regexes.startsUsing({ id: '240E', source: 'Neo Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '240E', source: 'Neo Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '240E', source: 'Néo-Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: '240E', source: 'ネオエクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '240E', source: '新生艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: '240E', source: '네오 엑스데스', capture: false }),
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
            cn: '在里面死亡',
          };
        }
      },
      alertText: function(data) {
        if (!data.shouldDieOnLaser()) {
          return {
            en: 'Go Outside',
            de: 'Nach Außen',
            cn: '去外面',
          };
        }
      },
      tts: function(data) {
        if (data.shouldDieOnLaser()) {
          return {
            en: 'die in in in',
            de: 'sterben rein rein rein',
            cn: '死亡',
          };
        }
        return {
          en: 'out out out',
          de: 'raus raus raus',
          cn: '出去出去',
        };
      },
    },
    {
      id: 'O4S Neo Flood of Naught: Outside',
      regex: Regexes.startsUsing({ id: '240F', source: 'Neo Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '240F', source: 'Neo Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '240F', source: 'Néo-Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: '240F', source: 'ネオエクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '240F', source: '新生艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: '240F', source: '네오 엑스데스', capture: false }),
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
            cn: '在外面死亡',
          };
        }
      },
      alertText: function(data) {
        if (!data.shouldDieOnLaser()) {
          return {
            en: 'Go Inside',
            de: 'Rein gehen',
            cn: '去里面',
          };
        }
      },
      tts: function(data) {
        if (data.shouldDieOnLaser()) {
          return {
            en: 'die out out out',
            de: 'sterben raus raus raus',
            cn: '在外面死亡',
          };
        }
        return {
          en: 'in in in',
          de: 'rein rein rein',
          cn: '进去进去',
        };
      },
    },
    {
      id: 'O4S Neo Flood of Naught: Colors Purple Blue',
      regex: Regexes.startsUsing({ id: '2411', source: 'Neo Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2411', source: 'Neo Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2411', source: 'Néo-Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2411', source: 'ネオエクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2411', source: '新生艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2411', source: '네오 엑스데스', capture: false }),
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
            cn: '在右边蓝色死亡',
          };
        } else if (data.whiteWound) {
          return {
            en: 'Die On Left Purple',
            de: 'In Pinkem links sterben',
            cn: '在左边紫色死亡',
          };
        }
        return {
          en: 'Die on color sides',
          de: 'Auf Farben sterben',
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
            cn: '左边紫色',
          };
        } else if (data.whiteWound) {
          return {
            en: 'Right On Blue',
            de: 'Rechts auf Blau',
            cn: '右边蓝色',
          };
        }
        return {
          en: 'Color sides',
          de: 'Farbige Seiten',
          cn: '颜色一侧',
        };
      },
      tts: {
        en: 'colors',
        de: 'Farben',
      },
    },
    {
      id: 'O4S Neo Flood of Naught: Colors Blue Purple',
      regex: Regexes.startsUsing({ id: '2412', source: 'Neo Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2412', source: 'Neo Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2412', source: 'Néo-Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2412', source: 'ネオエクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2412', source: '新生艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2412', source: '네오 엑스데스', capture: false }),
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
            cn: '在左边蓝色死亡',
          };
        } else if (data.whiteWound) {
          return {
            en: 'Die On Right Purple',
            de: 'Auf Pinkem rechts sterben',
            cn: '在右边紫色死亡',
          };
        }
        return {
          en: 'Die on color sides',
          de: 'Auf Farben sterben',
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
            cn: '去右边紫色',
          };
        } else if (data.whiteWound) {
          return {
            en: 'Be Left On Blue',
            de: 'Links auf Blau',
            cn: '去左边蓝色',
          };
        }
        return {
          en: 'Color sides',
          de: 'Farbige Seiten',
          cn: '颜色一侧',
        };
      },
      tts: {
        en: 'colors',
        de: 'farben',
        cn: '颜色',
      },
    },
    {
      id: 'O4S Neo Laser Counter',
      regex: Regexes.startsUsing({ id: ['240E', '240F', '2411', '2412'], source: 'Neo Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: ['240E', '240F', '2411', '2412'], source: 'Neo Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: ['240E', '240F', '2411', '2412'], source: 'Néo-Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: ['240E', '240F', '2411', '2412'], source: 'ネオエクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: ['240E', '240F', '2411', '2412'], source: '新生艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: ['240E', '240F', '2411', '2412'], source: '네오 엑스데스', capture: false }),
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
      regex: Regexes.startsUsing({ id: '2416', source: 'Neo Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2416', source: 'Neo Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2416', source: 'Néo-Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2416', source: 'ネオエクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2416', source: '新生艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2416', source: '네오 엑스데스', capture: false }),
      infoText: function(data) {
        if (data.allaganField) {
          if (data.role == 'tank') {
            return {
              en: 'Charge: be behind other tank',
              de: 'Aufladung: hinter anderen Tank',
              cn: '站在另一个坦克后面',
            };
          }
          return {
            en: 'Charge: be in the very back',
            de: 'Aufladung: Ganz nach hinten',
            cn: '去后面',
          };
        }
        if (data.role == 'tank') {
          return {
            en: 'Charge: be in front!',
            de: 'Aufladung: Ganz nach vorn',
            cn: '去前面',
          };
        }
        return {
          en: 'Charge: be behind tanks',
          de: 'Aufladung: Hinter die Tanks',
          cn: '站在坦克后面',
        };
      },
      tts: {
        en: 'charge',
        de: 'aufladung',
        cn: '充能',
      },
    },
    {
      id: 'O4S Neo Double Attack',
      regex: Regexes.startsUsing({ id: '241C', source: 'Neo Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '241C', source: 'Neo Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '241C', source: 'Néo-Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: '241C', source: 'ネオエクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '241C', source: '新生艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: '241C', source: '네오 엑스데스', capture: false }),
      alertText: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'Double Attack',
            de: 'Doppelangriff',
            cn: '双重攻击',
          };
        }
        return {
          en: 'Double Attack: Get out',
          de: 'Doppelangriff: Raus da',
          cn: '双重攻击：去外面',
        };
      },
      tts: {
        en: 'double attack',
        de: 'Doppelangriff',
        cn: '双重攻击',
      },
    },
    { // Grand Cross Alpha.
      id: 'O4S Neo Grand Cross Alpha',
      regex: Regexes.startsUsing({ id: '242B', source: 'Neo Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '242B', source: 'Neo Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '242B', source: 'Néo-Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: '242B', source: 'ネオエクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '242B', source: '新生艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: '242B', source: '네오 엑스데스', capture: false }),
      infoText: {
        en: 'Grand Cross Alpha: Go to middle',
        de: 'Supernova Alpha: In die Mitte',
        cn: '前往中间集合',
      },
      tts: {
        en: 'go to middle',
        de: 'In die Mitte',
        cn: '前往中间',
      },
    },
    {
      id: 'O4S Neo Grand Cross Delta',
      regex: Regexes.startsUsing({ id: '242C', source: 'Neo Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '242C', source: 'Neo Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '242C', source: 'Néo-Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: '242C', source: 'ネオエクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '242C', source: '新生艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: '242C', source: '네오 엑스데스', capture: false }),
      infoText: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'Grand Cross Delta: Be in front of boss',
            de: 'Supernova Delta: Vor den Boss',
            cn: '站在boss前面',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Grand Cross Delta: Be on sides of boss',
            de: 'Supernova Delta: An die Seiten vom Boss',
            cn: '站在boss后面',
          };
        }
        return {
          en: 'Grand Cross Delta: Inside boss',
          de: 'Supernvoa Delta: In den Boss',
          cn: '站在boss中间',
        };
      },
      tts: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'delta: be in front',
            de: 'delta: vor den boss',
            cn: '去前面',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'delta: be on sides',
            de: 'delta: an die seiten',
            cn: '去两侧',
          };
        }
        return {
          en: 'delta: be inside boss',
          de: 'delta: in den boss',
          cn: '去boss中间',
        };
      },
    },
    {
      id: 'O4S Neo Grand Cross Omega',
      regex: Regexes.startsUsing({ id: '242D', source: 'Neo Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '242D', source: 'Neo Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '242D', source: 'Néo-Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: '242D', source: 'ネオエクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '242D', source: '新生艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: '242D', source: '네오 엑스데스', capture: false }),
      response: Responses.goMiddle(),
    },
    {
      id: 'O4S Neo Forked Lightning',
      regex: Regexes.gainsEffect({ effect: 'Forked Lightning' }),
      regexDe: Regexes.gainsEffect({ effect: 'Gabelblitz' }),
      regexFr: Regexes.gainsEffect({ effect: 'Éclair Ramifié' }),
      regexJa: Regexes.gainsEffect({ effect: 'フォークライトニング' }),
      regexCn: Regexes.gainsEffect({ effect: '叉形闪电' }),
      regexKo: Regexes.gainsEffect({ effect: '갈래 번개' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      delaySeconds: 1,
      response: Responses.spread(),
    },
    {
      id: 'O4S Neo Acceleration Bomb',
      regex: Regexes.gainsEffect({ effect: 'Acceleration Bomb' }),
      regexDe: Regexes.gainsEffect({ effect: 'Beschleunigungsbombe' }),
      regexFr: Regexes.gainsEffect({ effect: 'Bombe À Accélération' }),
      regexJa: Regexes.gainsEffect({ effect: '加速度爆弾' }),
      regexCn: Regexes.gainsEffect({ effect: '加速度炸弹' }),
      regexKo: Regexes.gainsEffect({ effect: '가속도 폭탄' }),
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
            cn: '看外面并静止',
          };
        }
        return {
          en: 'stop',
          de: 'Stopp',
          cn: '静止',
        };
      },
    },
    {
      id: 'O4S Neo Acceleration Bomb Delta',
      regex: Regexes.gainsEffect({ effect: 'Acceleration Bomb' }),
      regexDe: Regexes.gainsEffect({ effect: 'Beschleunigungsbombe' }),
      regexFr: Regexes.gainsEffect({ effect: 'Bombe À Accélération' }),
      regexJa: Regexes.gainsEffect({ effect: '加速度爆弾' }),
      regexCn: Regexes.gainsEffect({ effect: '加速度炸弹' }),
      regexKo: Regexes.gainsEffect({ effect: '가속도 폭탄' }),
      condition: function(data, matches) {
        return matches.target == data.me && data.phase == 'delta';
      },
      infoText: {
        en: 'Acceleration Bomb',
        de: 'Beschleunigungsbombe',
        cn: '加速度炸弹',
      },
      tts: {
        en: 'bomb',
        de: 'bombe',
        cn: '加速度炸弹',
      },
    },
    {
      id: 'O4S Neo Omega Shriek',
      regex: Regexes.gainsEffect({ effect: 'Cursed Shriek' }),
      regexDe: Regexes.gainsEffect({ effect: 'Schrei Der Verwünschung' }),
      regexFr: Regexes.gainsEffect({ effect: 'Cri Du Maléfice' }),
      regexJa: Regexes.gainsEffect({ effect: '呪詛の叫声' }),
      regexCn: Regexes.gainsEffect({ effect: '诅咒之嚎' }),
      regexKo: Regexes.gainsEffect({ effect: '저주의 외침' }),
      condition: function(data, matches) {
        return matches.target == data.me && data.phase == 'omega';
      },
      delaySeconds: function(data, matches) {
        return parseFloat(matches.duration) - 5;
      },
      alertText: {
        en: 'shriek: get mid, look away',
        de: 'Schrei: Zur mitte und wegschauen',
        cn: '石化点名',
      },
      tts: {
        en: 'shriek',
        de: 'schrei',
        cn: '石化',
      },
    },
    {
      id: 'O4S Neo Water Tracker',
      regex: Regexes.gainsEffect({ effect: 'Compressed Water' }),
      regexDe: Regexes.gainsEffect({ effect: 'Wasserkompression' }),
      regexFr: Regexes.gainsEffect({ effect: 'Compression Aqueuse' }),
      regexJa: Regexes.gainsEffect({ effect: '水属性圧縮' }),
      regexCn: Regexes.gainsEffect({ effect: '水属性压缩' }),
      regexKo: Regexes.gainsEffect({ effect: '물속성 압축' }),
      run: function(data, matches) {
        data.waterHealer = matches.target;
      },
    },
    {
      // Water Me (Delta/Omega)
      id: 'O4S Neo Water Me',
      regex: Regexes.gainsEffect({ effect: 'Compressed Water' }),
      regexDe: Regexes.gainsEffect({ effect: 'Wasserkompression' }),
      regexFr: Regexes.gainsEffect({ effect: 'Compression Aqueuse' }),
      regexJa: Regexes.gainsEffect({ effect: '水属性圧縮' }),
      regexCn: Regexes.gainsEffect({ effect: '水属性压缩' }),
      regexKo: Regexes.gainsEffect({ effect: '물속성 압축' }),
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
            cn: '水点名',
          };
        } else if (data.phase == 'omega') {
          return {
            en: 'water: stack under neo',
            de: 'Wasser: Unter Neo stacken',
            cn: '去下面',
          };
        }
      },
      tts: {
        en: 'water stack',
        de: 'Wasser stek',
        cn: '水分摊',
      },
    },
    {
      // Beyond Death Tank (Delta)
      id: 'O4S Neo Beyond Death Delta Tank',
      regex: Regexes.gainsEffect({ effect: 'Beyond Death' }),
      regexDe: Regexes.gainsEffect({ effect: 'Jenseits Des Jenseits' }),
      regexFr: Regexes.gainsEffect({ effect: 'Outre-Mort' }),
      regexJa: Regexes.gainsEffect({ effect: '死の超越' }),
      regexCn: Regexes.gainsEffect({ effect: '超越死亡' }),
      regexKo: Regexes.gainsEffect({ effect: '죽음 초월' }),
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
            cn: '分摊于' + data.waterHealer,
          };
        }
        return {
          en: 'Stack on water',
          de: 'Bei Wasser stacken',
          cn: '和水点名分摊',
        };
      },
      tts: {
        en: 'water stack',
        de: 'wasser stek',
        cn: '水分摊',
      },
    },
    {
      // Beyond Death (Delta)
      id: 'O4S Neo Beyond Death Delta Initial',
      regex: Regexes.gainsEffect({ effect: 'Beyond Death' }),
      regexDe: Regexes.gainsEffect({ effect: 'Jenseits Des Jenseits' }),
      regexFr: Regexes.gainsEffect({ effect: 'Outre-Mort' }),
      regexJa: Regexes.gainsEffect({ effect: '死の超越' }),
      regexCn: Regexes.gainsEffect({ effect: '超越死亡' }),
      regexKo: Regexes.gainsEffect({ effect: '죽음 초월' }),
      condition: function(data, matches) {
        return data.phase == 'delta' && matches.target == data.me && data.role != 'tank';
      },
      infoText: {
        en: 'Beyond Death',
        de: 'Jenseis Des Jenseits',
        cn: '超越死亡',
      },
      tts: {
        en: 'death',
        de: 'tod',
        cn: '找死',
      },
    },
    {
      // Off Balance (Omega)
      id: 'O4S Neo Off Balance Omega',
      regex: Regexes.gainsEffect({ effect: 'Off-Balance' }),
      regexDe: Regexes.gainsEffect({ effect: 'Gleichgewichtsverlust' }),
      regexFr: Regexes.gainsEffect({ effect: 'Perte D\'Équilibre' }),
      regexJa: Regexes.gainsEffect({ effect: 'ノックバック確定' }),
      regexCn: Regexes.gainsEffect({ effect: '弱不禁风' }),
      regexKo: Regexes.gainsEffect({ effect: '밀쳐내기 확정' }),
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
            cn: '分摊于' + data.waterHealer,
          };
        }
        return {
          en: 'Stack on water',
          de: 'Auf Wasser stacken',
          cn: '和水点名分摊',
        };
      },
      tts: {
        en: 'water stack',
        de: 'Wasser stek',
        cn: '水分摊',
      },
    },
    {
      id: 'O4S Neo Earthshaker on Tank',
      regex: Regexes.headMarker({ id: '0028' }),
      condition: function(data, matches) {
        return matches.target == data.me && data.role == 'tank';
      },
      response: Responses.earthshaker('info'),
    },
    {
      id: 'O4S Neo Earthshaker on not Tank',
      regex: Regexes.headMarker({ id: '0028' }),
      condition: function(data, matches) {
        return matches.target == data.me && data.role != 'tank';
      },
      response: Responses.earthshaker('alarm'),
    },
    {
      id: 'O4S Neo Delta Attack',
      regex: Regexes.startsUsing({ id: '241E', source: 'Neo Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '241E', source: 'Neo Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '241E', source: 'Néo-Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: '241E', source: 'ネオエクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '241E', source: '新生艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: '241E', source: '네오 엑스데스', capture: false }),
      response: Responses.stack(),
    },
    {
      id: 'O4S Neo Almagest',
      regex: Regexes.startsUsing({ id: '2417', source: 'Neo Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2417', source: 'Neo Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2417', source: 'Néo-Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2417', source: 'ネオエクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2417', source: '新生艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2417', source: '네오 엑스데스', capture: false }),
      alertText: {
        en: 'Almagest',
        de: 'Almagest',
        cn: '大AOE',
      },
      tts: {
        en: 'almagest',
        de: 'almagest',
        cn: '大AOE',
      },
      run: function(data) {
        data.almagestCount = (data.almagestCount || 0) + 1;
      },
    },
    {
      id: 'O4S Neo Flare',
      regex: Regexes.startsUsing({ id: '2401', source: 'Neo Exdeath' }),
      regexDe: Regexes.startsUsing({ id: '2401', source: 'Neo Exdeath' }),
      regexFr: Regexes.startsUsing({ id: '2401', source: 'Néo-Exdeath' }),
      regexJa: Regexes.startsUsing({ id: '2401', source: 'ネオエクスデス' }),
      regexCn: Regexes.startsUsing({ id: '2401', source: '新生艾克斯迪司' }),
      regexKo: Regexes.startsUsing({ id: '2401', source: '네오 엑스데스' }),
      condition: function(data, matches) {
        data.flareTargets = data.flareTargets || [];
        data.flareTargets.push(matches.target);
        return data.flareTargets.length == 3;
      },
      alarmText: function(data) {
        if (data.flareTargets.indexOf(data.me) >= 0) {
          return {
            en: 'Flare on you',
            de: 'Flare auf dir',
            cn: '核爆点名',
          };
        }
      },
      infoText: function(data) {
        if (data.flareTargets.indexOf(data.me) < 0) {
          return {
            en: 'Light and Darkness: Stack',
            de: 'Licht und Dunkel: Stack',
            cn: '分摊点名',
          };
        }
      },
      tts: function(data) {
        if (data.flareTargets.indexOf(data.me) >= 0) {
          return {
            en: 'flare on you',
            de: 'fleer auf dir',
            cn: '核爆点名',
          };
        }
        return {
          en: 'stack',
          de: 'stek',
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
        'Black Hole': 'Schwarzes Loch',
        'Exdeath': 'Exdeath',
        'White Wound': 'Wunde Des Lebenden',
        'Black Wound': 'Wunde Des Toten',
        'Beyond Death': 'Jenseits Des Jenseits',
        'Allagan Field': 'Allagisches Feld',
        'Off-Balance': 'Gleichgewichtsverlust',
        'Compressed Water': 'Wasserkompression',
        'Cursed Shriek': 'Schrei Der Verwünschung',
        'Acceleration Bomb': 'Beschleunigungsbombe',
        'Forked Lightning': 'Gabelblitz',
      },
      'replaceText': {
        '--Acceleration Bomb Resolves--': '--Acceleration Bomb Resolves--', // FIXME
        '--Allagan Field Explodes--': '--Allagan Field Explodes--', // FIXME
        '--Boss Targetable--': '--Boss Targetable--', // FIXME
        '--Boss Untargetable--': '--Boss Untargetable--', // FIXME
        '--LB Gauge Resets--': '--LB Gauge Resets--', // FIXME
        'Aero III': 'Windga',
        'Almagest': 'Almagest',
        'Black Hole': 'Schwarzes Loch',
        'Black Spark': 'Schwarzer Funke',
        'Blizzard III': 'Eisga',
        'Charge': 'Sturm',
        'Charybdis': 'Charybdis',
        'Clearout': 'Kreisfeger',
        'Collision': 'Aufprall',
        'Cursed Shriek': 'Schrei der Verwünschung',
        'Delta Attack': 'Delta-Attacke',
        'Doom': 'Verhängnis',
        'Double Attack': 'Doppelangriff',
        'Double Attack Tethers': 'Double Attack Tethers', // FIXME
        'Dualcast': 'Doppelzauber',
        'Earth Shaker': 'Erdstoß',
        'Emptiness': 'Tobende Leere',
        'Final Battle': 'Final Battle', // FIXME
        'Fire III': 'Feuga',
        'Flare': 'Flare',
        'Flood of Naught': 'Flut der Leere',
        'Forked Lightning': 'Gabelblitz',
        'Frenzied Fist': 'Rasende Faust',
        'Frenzied Sphere': 'Rasender Orbis',
        'Grand Cross Alpha': 'Supernova Alpha',
        'Grand Cross Delta': 'Supernova Delta',
        'Grand Cross Omega': 'Supernova Omega',
        'HP Down Debuff': 'HP Down Debuff', // FIXME
        'Holy': 'Sanctus',
        'Knockback': 'Knockback', // FIXME
        'Light and Darkness': 'Licht und Dunkelheit',
        'Meteor': 'Meteo',
        'Neverwhere': 'Nirgendwann',
        'Random Elemental': 'Random Elemental', // FIXME
        'The Decisive Battle': 'Entscheidungsschlacht',
        'Thunder III': 'Blitzga',
        'Vacuum Wave': 'Vakuumwelle',
        'Water': 'Aqua',
        'White Hole': 'Weißes Loch',
        'Zombie Breath': 'Zombie-Atem',
      },
      '~effectNames': {
        'Deep Freeze': 'Tiefkühlung',
        'Doom': 'Verhängnis',
        'Lightning Resistance Down': 'Blitzresistenz -',
        'Paralysis': 'Paralyse',
        'Pyretic': 'Hitze',
        'Zombification': 'Zombie',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Black Hole': 'Trou noir',
        'Exdeath': 'Exdeath',
      },
      'replaceText': {
        '--Acceleration Bomb Resolves--': '--Acceleration Bomb Resolves--', // FIXME
        '--Allagan Field Explodes--': '--Allagan Field Explodes--', // FIXME
        '--Boss Targetable--': '--Boss Targetable--', // FIXME
        '--Boss Untargetable--': '--Boss Untargetable--', // FIXME
        '--LB Gauge Resets--': '--LB Gauge Resets--', // FIXME
        'Aero III': 'Méga Vent',
        'Almagest': 'Almageste',
        'Black Hole': 'Trou noir',
        'Black Spark': 'Étincelle noire',
        'Blizzard III': 'Méga Glace',
        'Charge': 'Charge',
        'Charybdis': 'Charybde',
        'Clearout': 'Fauchage',
        'Collision': 'Impact',
        'Cursed Shriek': 'Cri maudit',
        'Delta Attack': 'Attaque Delta',
        'Doom': 'Glas',
        'Double Attack': 'Double attaque',
        'Double Attack Tethers': 'Double Attack Tethers', // FIXME
        'Dualcast': 'Chaîne de sorts',
        'Earth Shaker': 'Secousse',
        'Emptiness': 'Désolation du néant',
        'Final Battle': 'Final Battle', // FIXME
        'Fire III': 'Méga Feu',
        'Flare': 'Brasier',
        'Flood of Naught': 'Crue du néant',
        'Forked Lightning': 'Éclair ramifié',
        'Frenzied Fist': 'Poing de la démence',
        'Frenzied Sphere': 'Démence terminale',
        'Grand Cross Alpha': 'Croix suprême alpha',
        'Grand Cross Delta': 'Croix suprême delta',
        'Grand Cross Omega': 'Croix suprême oméga',
        'HP Down Debuff': 'HP Down Debuff', // FIXME
        'Holy': 'Miracle',
        'Knockback': 'Knockback', // FIXME
        'Light and Darkness': 'Clair-obscur',
        'Meteor': 'Météore',
        'Neverwhere': 'Anarchie',
        'Random Elemental': 'Random Elemental', // FIXME
        'The Decisive Battle': 'Combat décisif',
        'Thunder III': 'Méga Foudre',
        'Vacuum Wave': 'Vague de vide',
        'Water': 'Eau',
        'White Hole': 'Trou blanc',
        'Zombie Breath': 'Haleine zombie',
      },
      '~effectNames': {
        'Deep Freeze': 'Congélation',
        'Doom': 'Glas',
        'Lightning Resistance Down': 'Résistance à la foudre réduite',
        'Paralysis': 'Paralysie',
        'Pyretic': 'Ardeur',
        'Zombification': 'Zombification',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Black Hole': 'ブラックホール',
        'Exdeath': 'エクスデス',
      },
      'replaceText': {
        '--Acceleration Bomb Resolves--': '--Acceleration Bomb Resolves--', // FIXME
        '--Allagan Field Explodes--': '--Allagan Field Explodes--', // FIXME
        '--Boss Targetable--': '--Boss Targetable--', // FIXME
        '--Boss Untargetable--': '--Boss Untargetable--', // FIXME
        '--LB Gauge Resets--': '--LB Gauge Resets--', // FIXME
        'Aero III': 'エアロガ',
        'Almagest': 'アルマゲスト',
        'Black Hole': 'ブラックホール',
        'Black Spark': 'ブラックスパーク',
        'Blizzard III': 'ブリザガ',
        'Charge': 'チャージ',
        'Charybdis': 'ミールストーム',
        'Clearout': 'なぎ払い',
        'Collision': '衝撃',
        'Cursed Shriek': '呪詛の叫声',
        'Delta Attack': 'デルタアタック',
        'Doom': '死の宣告',
        'Double Attack': 'ダブルアタック',
        'Double Attack Tethers': 'Double Attack Tethers', // FIXME
        'Dualcast': '連続魔',
        'Earth Shaker': 'アースシェイカー',
        'Emptiness': '無の暴走',
        'Final Battle': 'Final Battle', // FIXME
        'Fire III': 'ファイガ',
        'Flare': 'フレア',
        'Flood of Naught': '無の氾濫',
        'Forked Lightning': 'フォークライトニング',
        'Frenzied Fist': '狂乱の拳',
        'Frenzied Sphere': '狂乱の極地',
        'Grand Cross Alpha': 'グランドクロス・アルファ',
        'Grand Cross Delta': 'グランドクロス・デルタ',
        'Grand Cross Omega': 'グランドクロス・オメガ',
        'HP Down Debuff': 'HP Down Debuff', // FIXME
        'Holy': 'ホーリー',
        'Knockback': 'Knockback', // FIXME
        'Light and Darkness': 'ライト・アンド・ダークネス',
        'Meteor': 'メテオ',
        'Neverwhere': '法則崩壊',
        'Random Elemental': 'Random Elemental', // FIXME
        'The Decisive Battle': '決戦',
        'Thunder III': 'サンダガ',
        'Vacuum Wave': '真空波',
        'Water': 'ウォータ',
        'White Hole': 'ホワイトホール',
        'Zombie Breath': 'ゾンビブレス',
      },
      '~effectNames': {
        'Deep Freeze': '氷結',
        'Doom': '死の宣告',
        'Lightning Resistance Down': '雷属性耐性低下',
        'Paralysis': '麻痺',
        'Pyretic': 'ヒート',
        'Zombification': 'ゾンビー',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Black Hole': '黑洞',
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
        'Black Spark': '黑洞',
        'Blizzard III': '冰封',
        'Charge': '刺冲',
        'Charybdis': '大漩涡',
        'Clearout': '横扫',
        'Collision': '冲击',
        'Cursed Shriek': '诅咒之嚎',
        'Delta Attack': '三角攻击',
        'Doom': '死亡宣告',
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
        'The Decisive Battle': '决战',
        'Thunder III': '暴雷',
        'Vacuum Wave': '真空波',
        'Water': '流水',
        'White Hole': '白洞',
        'Zombie Breath': '死亡吐息',
      },
      '~effectNames': {
        'Deep Freeze': '冻结',
        'Doom': '死亡宣告',
        'Lightning Resistance Down': '雷属性耐性降低',
        'Paralysis': '麻痹',
        'Pyretic': '热病',
        'Zombification': '僵尸',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Black Hole': '블랙홀',
        'Exdeath': '엑스데스',
      },
      'replaceText': {
        '--Acceleration Bomb Resolves--': '--Acceleration Bomb Resolves--', // FIXME
        '--Allagan Field Explodes--': '--Allagan Field Explodes--', // FIXME
        '--Boss Targetable--': '--Boss Targetable--', // FIXME
        '--Boss Untargetable--': '--Boss Untargetable--', // FIXME
        '--LB Gauge Resets--': '--LB Gauge Resets--', // FIXME
        'Aero III': '에어로가',
        'Almagest': '알마게스트',
        'Black Hole': '블랙홀',
        'Black Spark': '검은 불꽃',
        'Blizzard III': '블리자가',
        'Charge': '돌격',
        'Charybdis': '대소용돌이',
        'Clearout': '휩쓸기',
        'Collision': '충격',
        'Cursed Shriek': '저주의 외침',
        'Delta Attack': '델타 공격',
        'Doom': '죽음의 선고',
        'Double Attack': '이중 공격',
        'Double Attack Tethers': 'Double Attack Tethers', // FIXME
        'Dualcast': '연속 마법',
        'Earth Shaker': '요동치는 대지',
        'Emptiness': '무의 폭주',
        'Final Battle': 'Final Battle', // FIXME
        'Fire III': '파이가',
        'Flare': '플레어',
        'Flood of Naught': '무의 범람',
        'Forked Lightning': '', // FIXME
        'Frenzied Fist': '광란의 주먹',
        'Frenzied Sphere': '광란의 극지',
        'Grand Cross Alpha': '그랜드크로스: 알파',
        'Grand Cross Delta': '그랜드크로스: 델타',
        'Grand Cross Omega': '그랜드크로스: 오메가',
        'HP Down Debuff': 'HP Down Debuff', // FIXME
        'Holy': '홀리',
        'Knockback': 'Knockback', // FIXME
        'Light and Darkness': '빛과 어둠',
        'Meteor': '메테오',
        'Neverwhere': '법칙 붕괴',
        'Random Elemental': 'Random Elemental', // FIXME
        'The Decisive Battle': '결전',
        'Thunder III': '선더가',
        'Vacuum Wave': '진공파',
        'Water': '워터',
        'White Hole': '화이트홀',
        'Zombie Breath': '좀비 숨결',
      },
      '~effectNames': {
        'Deep Freeze': '빙결',
        'Doom': '죽음의 선고',
        'Lightning Resistance Down': '번개속성 저항 감소',
        'Paralysis': '마비',
        'Pyretic': '', // FIXME
        'Zombification': '좀비',
      },
    },
  ],
}];
