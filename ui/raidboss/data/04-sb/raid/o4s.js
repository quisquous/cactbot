'use strict';

// O4S - Deltascape 4.0 Savage
[{
  zoneRegex: /^Deltascape V4\.0 \(Savage\)$/,
  timelineFile: 'o4s.txt',
  timelineTriggers: [
    {
      id: 'O4S Vacuum Wave',
      regex: /Vacuum Wave/,
      beforeSeconds: 8,
      alertText: {
        en: 'Vacuum Wave soon',
      },
    },
  ],
  triggers: [
    // Part 1
    { // Phase Tracker: Thunder III not after Decisive Battle.
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
    { // Fire III not after Decisive Battle.
      id: 'O4S1 Fire III',
      regex: Regexes.startsUsing({ id: '23F5', source: 'Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '23F5', source: 'Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '23F5', source: 'Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: '23F5', source: 'エクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '23F5', source: '艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: '23F5', source: '엑스데스', capture: false }),
      infoText: {
        en: 'Fire III',
        de: 'Feuga',
      },
    },
    { // Blizzard III not after Decisive Battle.
      id: 'O4S1 Blizzard III',
      regex: Regexes.startsUsing({ id: '23F7', source: 'Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '23F7', source: 'Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '23F7', source: 'Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: '23F7', source: 'エクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '23F7', source: '艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: '23F7', source: '엑스데스', capture: false }),
      infoText: {
        en: 'Blizzard III',
        de: 'Eisga',
      },
    },
    { // Thunder III not after Decisive Battle.
      id: 'O4S1 Thunder III',
      regex: Regexes.startsUsing({ id: '23F9', source: 'Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '23F9', source: 'Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '23F9', source: 'Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: '23F9', source: 'エクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '23F9', source: '艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: '23F9', source: '엑스데스', capture: false }),
      infoText: function(data) {
        // Tanks/healers always get an alert.
        if (data.role == 'tank' || data.role == 'healer') return false;
        return {
          en: 'Thunder III',
          de: 'Blitzga',
        };
      },
      alertText: function(data) {
        // Tanks/healers always get an alert.
        if (data.role == 'tank' || data.role == 'healer') {
          return {
            en: 'Thunder III: Tank buster',
            de: 'Blitzga: Tank buster',
          };
        }
      },
      tts: function(data) {
        if (data.role == 'tank' || data.role == 'healer') {
          return {
            en: 'thunder',
            de: 'blitzga',
          };
        }
      },
    },
    { // Fire III after Decisive Battle.
      id: 'O4S1 Ultimate Fire III',
      regex: Regexes.startsUsing({ id: '23FB', source: 'Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '23FB', source: 'Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '23FB', source: 'Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: '23FB', source: 'エクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '23FB', source: '艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: '23FB', source: '엑스데스', capture: false }),
      alarmText: {
        en: 'Fire III: Stop',
        de: 'Feuga: Stehenbleiben',
      },
      tts: {
        en: 'fire stop moving',
        de: 'feuga stehenbleiben',
      },
    },
    { // Blizzard III after Decisive Battle.
      id: 'O4S1 Ultimate Blizzard III',
      regex: Regexes.startsUsing({ id: '23FC', source: 'Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '23FC', source: 'Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '23FC', source: 'Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: '23FC', source: 'エクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '23FC', source: '艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: '23FC', source: '엑스데스', capture: false }),
      alertText: {
        en: 'Blizzard III: Keep moving',
        de: 'Eisga: Bewegen',
      },
      tts: {
        en: 'blizzard keep moving',
        de: 'eisga bewegen',
      },
    },
    { // Thunder III after Decisive Battle.
      id: 'O4S1 Ultimate Thunder III',
      regex: Regexes.startsUsing({ id: '23FD', source: 'Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '23FD', source: 'Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '23FD', source: 'Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: '23FD', source: 'エクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '23FD', source: '艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: '23FD', source: '엑스데스', capture: false }),
      alertText: {
        en: 'Thunder III: Get out',
        de: 'Blitzga: Raus da',
      },
      tts: {
        en: 'thunder get out',
        de: 'blitzga raus da',
      },
    },
    { // Flare
      id: 'O4S1 Flare',
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
          };
        }
      },
      run: function(data) {
        delete data.flareTargets;
      },
    },

    // Part 2
    { // Phase Tracker: Grand Cross Alpha.
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
    { // Phase Tracker: Grand Cross Delta.
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
    { // Phase Tracker: Grand Cross Omega.
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
    { // Phase Tracker: Neverwhere.
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
    { // White Wound tracking true
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
    { // White Wound tracking false
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
    { // Black Wound tracking true
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
    { // Black Wound tracking false
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
    { // Beyond death tracking true
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
    { // Beyond death tracking false
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
    { // Allagan field tracking true
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
    { // Allagan field tracking false
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
    { // Inner Flood (move out).
      id: 'O4S2 Flood of Naught: Inside',
      regex: Regexes.startsUsing({ id: '240E', source: 'Neo Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '240E', source: 'Neo Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '240E', source: 'Néo-Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: '240E', source: 'ネオエクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '240E', source: '新生艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: '240E', source: '네오 엑스데스', capture: false }),
      durationSeconds: 6,
      alarmText: function(data) {
        if (data.shouldDieOnLaser()) {
          return {
            en: 'Die on Inside',
            de: 'Innen sterben',
          };
        }
      },
      alertText: function(data) {
        if (!data.shouldDieOnLaser()) {
          return {
            en: 'Go Outside',
            de: 'Nach Außen',
          };
        }
      },
      sound: function(data) {
        if (data.shouldDieOnLaser())
          return data.dieDieDieSound;
      },
      tts: function(data) {
        if (data.shouldDieOnLaser()) {
          return {
            en: 'die in in in',
            de: 'sterben rein rein rein',
          };
        }
        return {
          en: 'out out out',
          de: 'raus raus raus',
        };
      },
    },
    { // Outer Flood (move in).
      id: 'O4S2 Flood of Naught: Outside',
      regex: Regexes.startsUsing({ id: '240F', source: 'Neo Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '240F', source: 'Neo Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '240F', source: 'Néo-Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: '240F', source: 'ネオエクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '240F', source: '新生艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: '240F', source: '네오 엑스데스', capture: false }),
      durationSeconds: 6,
      alarmText: function(data) {
        if (data.shouldDieOnLaser()) {
          return {
            en: 'Die on Outside',
            de: 'Außen sterben',
          };
        }
      },
      alertText: function(data) {
        if (!data.shouldDieOnLaser()) {
          return {
            en: 'Go Inside',
            de: 'Rein gehen',
          };
        }
      },
      sound: function(data) {
        if (data.shouldDieOnLaser())
          return data.dieDieDieSound;
      },
      tts: function(data) {
        if (data.shouldDieOnLaser()) {
          return {
            en: 'die out out out',
            de: 'sterben raus raus raus',
          };
        }
        return {
          en: 'in in in',
          de: 'rein rein rein',
        };
      },
    },
    { // Purple/Blue Flood.
      id: 'O4S2 Flood of Naught: Colors Purple Blue',
      regex: Regexes.startsUsing({ id: '2411', source: 'Neo Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2411', source: 'Neo Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2411', source: 'Néo-Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2411', source: 'ネオエクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2411', source: '新生艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2411', source: '네오 엑스데스', capture: false }),
      durationSeconds: 6,
      alarmText: function(data) {
        if (!data.shouldDieOnLaser())
          return;

        if (data.blackWound) {
          return {
            en: 'Die On Right Blue',
            de: 'In Blauem rechts sterben',
          };
        } else if (data.whiteWound) {
          return {
            en: 'Die On Left Purple',
            de: 'In Pinkem links sterben',
          };
        }
        return {
          en: 'Die on color sides',
          de: 'Auf Farben sterben',
        };
      },
      alertText: function(data) {
        if (data.shouldDieOnLaser())
          return;

        if (data.blackWound) {
          return {
            en: 'Left On Purple',
            de: 'Links auf Pink',
          };
        } else if (data.whiteWound) {
          return {
            en: 'Right On Blue',
            de: 'Rechts auf Blau',
          };
        }
        return {
          en: 'Color sides',
          de: 'Farbige Seiten',
        };
      },
      sound: function(data) {
        if (data.shouldDieOnLaser())
          return data.dieDieDieSound;
      },
      tts: {
        en: 'colors',
        de: 'Farben',
      },
    },
    { // Blue/Purple Flood.
      id: 'O4S2 Flood of Naught: Colors Blue Purple',
      regex: Regexes.startsUsing({ id: '2412', source: 'Neo Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2412', source: 'Neo Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2412', source: 'Néo-Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2412', source: 'ネオエクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2412', source: '新生艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2412', source: '네오 엑스데스', capture: false }),
      durationSeconds: 6,
      alarmText: function(data) {
        if (!data.shouldDieOnLaser())
          return;

        if (data.blackWound) {
          return {
            en: 'Die On Left Blue',
            de: 'Auf Blauem links sterben',
          };
        } else if (data.whiteWound) {
          return {
            en: 'Die On Right Purple',
            de: 'Auf Pinkem rechts sterben',
          };
        }
        return {
          en: 'Die on color sides',
          de: 'Auf Farben sterben',
        };
      },
      alertText: function(data) {
        if (data.shouldDieOnLaser())
          return;

        if (data.blackWound) {
          return {
            en: 'Be Right On Purple',
            de: 'Rechts auf Pink',
          };
        } else if (data.whiteWound) {
          return {
            en: 'Be Left On Blue',
            de: 'Links auf Blau',
          };
        }
        return {
          en: 'Color sides',
          de: 'Farbige Seiten',
        };
      },
      sound: function(data) {
        if (data.shouldDieOnLaser())
          return data.dieDieDieSound;
      },
      tts: {
        en: 'colors',
        de: 'farben',
      },
    },
    { // Laser counter.
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
    { // Charge Flood.
      id: 'O4S2 Flood of Naught: Charge',
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
            };
          }
          return {
            en: 'Charge: be in the very back',
            de: 'Aufladung: Ganz nach hinten',
          };
        }
        if (data.role == 'tank') {
          return {
            en: 'Charge: be in front!',
            de: 'Aufladung: Ganz nach vorn',
          };
        }
        return {
          en: 'Charge: be behind tanks',
          de: 'Aufladung: Hinter die Tanks',
        };
      },
      tts: {
        en: 'charge',
        de: 'aufladung',
      },
    },
    { // Double attack.
      id: 'O4S2 Double Attack',
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
          };
        }
        return {
          en: 'Double Attack: Get out',
          de: 'Doppelangriff: Raus da',
        };
      },
      tts: {
        en: 'double attack',
        de: 'Doppelangriff',
      },
    },
    { // Grand Cross Alpha.
      id: 'O4S2 Grand Cross Alpha',
      regex: Regexes.startsUsing({ id: '242B', source: 'Neo Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '242B', source: 'Neo Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '242B', source: 'Néo-Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: '242B', source: 'ネオエクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '242B', source: '新生艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: '242B', source: '네오 엑스데스', capture: false }),
      infoText: {
        en: 'Grand Cross Alpha: Go to middle',
        de: 'Supernova Alpha: In die Mitte',
      },
      tts: {
        en: 'go to middle',
        de: 'In die Mitte',
      },
    },
    { // Grand Cross Delta.
      id: 'O4S2 Grand Cross Delta',
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
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Grand Cross Delta: Be on sides of boss',
            de: 'Supernova Delta: An die Seiten vom Boss',
          };
        }
        return {
          en: 'Grand Cross Delta: Inside boss',
          de: 'Supernvoa Delta: In den Boss',
        };
      },
      tts: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'delta: be in front',
            de: 'delta: vor den boss',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'delta: be on sides',
            de: 'delta: an die seiten',
          };
        }
        return {
          en: 'delta: be inside boss',
          de: 'delta: in den boss',
        };
      },
    },
    { // Grand Cross Omega.
      id: 'O4S2 Grand Cross Omega',
      regex: Regexes.startsUsing({ id: '242D', source: 'Neo Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '242D', source: 'Neo Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '242D', source: 'Néo-Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: '242D', source: 'ネオエクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '242D', source: '新生艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: '242D', source: '네오 엑스데스', capture: false }),
      infoText: {
        en: 'Grand Cross Omega: Go to middle',
        de: 'Supernova Omega: In die Mitte',
      },
      tts: {
        en: 'go to middle',
        de: 'in die Mitte',
      },
    },
    { // Forked Lightning - Don't Stack.
      id: 'O4S2 Forked Lightning',
      regex: Regexes.gainsEffect({ effect: 'Forked Lightning' }),
      regexDe: Regexes.gainsEffect({ effect: 'Gabelblitz' }),
      regexFr: Regexes.gainsEffect({ effect: 'Éclair Ramifié' }),
      regexJa: Regexes.gainsEffect({ effect: 'フォークライトニング' }),
      regexCn: Regexes.gainsEffect({ effect: '叉形闪电' }),
      regexKo: Regexes.gainsEffect({ effect: '갈래 번개' }),
      delaySeconds: 1,
      alertText: {
        en: 'Forked Lightning: Don\'t Stack',
        de: 'Gabelblitz: Nicht stacken',
      },
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      tts: {
        en: 'lightning get out',
        de: 'blitz raus da',
      },
    },
    { // Acceleration Bomb
      id: 'O4S2 Acceleration Bomb',
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
          };
        }
        return {
          en: 'stop',
          de: 'Stopp',
        };
      },
    },
    {
      id: 'O4S2 Acceleration Bomb Delta',
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
      },
      tts: {
        en: 'bomb',
        de: 'bombe',
      },
    },
    { // Shriek (Omega)
      id: 'O4S2 Omega Shriek',
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
      },
      tts: {
        en: 'shriek',
        de: 'schrei',
      },
    },
    { // Water Tracking (Delta/Omega)
      id: 'O4S2 Water',
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
    { // Water Me (Delta/Omega)
      id: 'O4S2 Water Me',
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
          };
        } else if (data.phase == 'omega') {
          return {
            en: 'water: stack under neo',
            de: 'Wasser: Unter Neo stacken',
          };
        }
      },
      tts: {
        en: 'water stack',
        de: 'Wasser stek',
      },
    },
    { // Beyond Death Tank (Delta)
      id: 'O4S2 Beyond Death Delta Tank',
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
            de: 'Stack auf '+ data.waterHealer,
          };
        }
        return {
          en: 'Stack on water',
          de: 'Bei Wasser stacken',
        };
      },
      tts: {
        en: 'water stack',
        de: 'wasser stek',
      },
    },
    { // Beyond Death (Delta)
      id: 'O4S2 Beyond Death Delta Initial',
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
      },
      tts: {
        en: 'death',
        de: 'tod',
      },
    },
    { // Off Balance (Omega)
      id: 'O4S2 Off Balance Omega',
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
          };
        }
        return {
          en: 'Stack on water',
          de: 'Auf Wasser stacken',
        };
      },
      tts: {
        en: 'water stack',
        de: 'Wasser stek',
      },
    },
    { // Earthshaker
      id: 'O4S2 Earthshaker',
      regex: Regexes.headMarker({ id: '0028' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      alarmText: function(data) {
        if (data.role != 'tank') {
          return {
            en: 'Earthshaker on YOU',
            de: 'Erdstoß auf DIR',
          };
        }
      },
      infoText: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'Earthshaker on YOU',
            de: 'Erdstoß auf DIR',
          };
        }
      },
      tts: {
        en: 'shaker',
        de: 'erstoß',
      },
    },
    { // Delta Attack
      id: 'O4S2 Delta Attack',
      regex: Regexes.startsUsing({ id: '241E', source: 'Neo Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '241E', source: 'Neo Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '241E', source: 'Néo-Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: '241E', source: 'ネオエクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '241E', source: '新生艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: '241E', source: '네오 엑스데스', capture: false }),
      infoText: {
        en: 'Delta Attack: Stack',
        de: 'Delta Attacke: Stack',
      },
      tts: {
        en: 'stack for delta',
        de: 'für delta stek en',
      },
    },
    { // Almagest
      id: 'O4S2 Almagest',
      regex: Regexes.startsUsing({ id: '2417', source: 'Neo Exdeath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2417', source: 'Neo Exdeath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2417', source: 'Néo-Exdeath', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2417', source: 'ネオエクスデス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2417', source: '新生艾克斯迪司', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2417', source: '네오 엑스데스', capture: false }),
      alertText: {
        en: 'Almagest',
        de: 'Almagest',
      },
      tts: {
        en: 'almagest',
        de: 'almagest',
      },
      run: function(data) {
        data.almagestCount = (data.almagestCount || 0) + 1;
      },
    },
    { // Flare
      id: 'O4S2 Flare',
      regex: Regexes.startsUsing({ id: '2401', source: 'Neo Exdeath' }),
      regexDe: Regexes.startsUsing({ id: '2401', source: 'Neo Exdeath' }),
      regexFr: Regexes.startsUsing({ id: '2401', source: 'Néo-Exdeath' }),
      regexJa: Regexes.startsUsing({ id: '2401', source: 'ネオエクスデス' }),
      regexCn: Regexes.startsUsing({ id: '2401', source: '新生艾克斯迪司' }),
      regexKo: Regexes.startsUsing({ id: '2401', source: '네오 엑스데스' }),
      infoText: function(data) {
        if (data.flareTargets.indexOf(data.me) < 0) {
          return {
            en: 'Light and Darkness: Stack',
            de: 'Licht und Dunkel: Stack',
          };
        }
      },
      alarmText: function(data) {
        if (data.flareTargets.indexOf(data.me) >= 0) {
          return {
            en: 'Flare on you',
            de: 'Flare auf dir',
          };
        }
      },
      condition: function(data, matches) {
        data.flareTargets = data.flareTargets || [];
        data.flareTargets.push(matches.target);
        return data.flareTargets.length == 3;
      },
      tts: function(data) {
        if (data.flareTargets.indexOf(data.me) >= 0) {
          return {
            en: 'flare on you',
            de: 'fleer auf dir',
          };
        }
        return {
          en: 'stack',
          de: 'stek',
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
        'Black Hole': 'Schwarz[a] Loch',
        'Engage!': 'Start!',
        'Exdeath': 'Exdeath',
      },
      'replaceText': {
        '--targetable--': '--anvisierbar--',
        '--untargetable--': '--nich anvisierbar--',
        'Black Hole': 'Schwarzes Loch',
        'Black Spark': 'Schwarzer Funke',
        'Blizzard III': 'Eisga',
        'Clearout': 'Kreisfeger',
        'Collision': 'Aufprall',
        'Doom': 'Verhängnis',
        'Enrage': 'Finalangriff',
        'Fire III': 'Feuga',
        'Flare': 'Flare',
        'Holy': 'Sanctus',
        'Meteor': 'Meteor',
        'The Decisive Battle': 'Entscheidungsschlacht',
        'Thunder III': 'Blitzga',
        'Vacuum Wave': 'Vakuumwelle',
        'Zombie Breath': 'Zombie-Atem',
      },
      '~effectNames': {
        'Deep Freeze': 'Tiefkühlung',
        'Doom': 'Verhängnis',
        'Lightning Resistance Down': 'Blitzresistenz -',
        'Paralysis': 'Paralyse',
        'Pyretic': 'Pyretisch',
        'Zombification': 'Zombie',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Black Hole': 'Trou Noir',
        'Engage!': 'À l\'attaque',
        'Exdeath': 'Exdeath',
      },
      'replaceText': {
        '--Reset--': '--Réinitialisation--',
        '--sync--': '--Synchronisation--',
        '--targetable--': '--Ciblable--',
        '--untargetable--': '--Impossible à cibler--',
        'Black Hole': 'Trou Noir',
        'Black Spark': 'Étincelle Noire',
        'Blizzard III': 'Méga Glace',
        'Clearout': 'Fauchage',
        'Collision': 'Impact',
        'Doom': 'Glas',
        'Enrage': 'Enrage',
        'Fire III': 'Méga Feu',
        'Flare': 'Brasier',
        'Holy': 'Miracle',
        'Meteor': 'Météore',
        'The Decisive Battle': 'Combat Décisif',
        'Thunder III': 'Méga Foudre',
        'Vacuum Wave': 'Vacuum',
        'Zombie Breath': 'Haleine Zombie',
      },
      '~effectNames': {
        'Deep Freeze': 'Congélation',
        'Doom': 'Glas',
        'Lightning Resistance Down': 'Résistance à La Foudre Réduite',
        'Paralysis': 'Paralysie',
        'Pyretic': 'Chaleur',
        'Zombification': 'Zombification',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Black Hole': 'ブラックホール',
        'Engage!': '戦闘開始！',
        'Exdeath': 'エクスデス',
      },
      'replaceText': {
        'Black Hole': 'ブラックホール',
        'Black Spark': 'ブラックスパーク',
        'Blizzard III': 'ブリザガ',
        'Clearout': 'なぎ払い',
        'Collision': '衝撃',
        'Doom': '死の宣告',
        'Fire III': 'ファイガ',
        'Flare': 'フレア',
        'Holy': 'ホーリー',
        'Meteor': 'メテオ',
        'The Decisive Battle': '決戦',
        'Thunder III': 'サンダガ',
        'Vacuum Wave': '真空波',
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
  ],
}];
