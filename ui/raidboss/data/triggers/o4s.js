'use strict';

// O4S - Deltascape 4.0 Savage
[{
  zoneRegex: /(Deltascape V4.0 \(Savage\)|Unknown Zone \(2Ba\))/,
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
      regex: /:23F9:Exdeath starts using/,
      run: function(data) {
        data.thunderCount = (data.thunderCount || 0) + 1;
      },
    },
    { // Fire III not after Decisive Battle.
      id: 'O4S1 Fire III',
      regex: /:23F5:Exdeath starts using/,
      infoText: {
        en: 'Fire III',
        de: 'Feuga',
      },
    },
    { // Blizzard III not after Decisive Battle.
      id: 'O4S1 Blizzard III',
      regex: /:23F7:Exdeath starts using/,
      infoText: {
        en: 'Blizzard III',
        de: 'Eisga',
      },
    },
    { // Thunder III not after Decisive Battle.
      id: 'O4S1 Thunder III',
      regex: /:23F9:Exdeath starts using/,
      infoText: function(data) {
        // Tanks/healers always get an alert.
        if (data.role == 'tank' || data.role == 'healer') return false;
        // Only the first for casters, other dps always get an info.
        if (data.role == 'dps-caster' && data.thunderCount) return false;
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
        // Non-casters always get an info.
        if (data.role != 'dps-caster') return false;
        // Casters get an alert after the first.
        if (data.thunderCount == 2) {
          return {
            en: 'Thunder III: Addle during',
            de: 'Blitzga: Stumpfsinn dabei einsetzen',
          };
        }
        if (data.thunderCount == 3) {
          return {
            en: 'Thunder III: Addle after',
            de: 'Blitzga: Stumpfsinn danach einsetzen',
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
      regex: /:23FB:Exdeath starts using/,
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
      regex: /:23FC:Exdeath starts using/,
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
      regex: /:23FD:Exdeath starts using/,
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
      regex: /2401:Exdeath starts using (?:Unknown_2401|Flare) on (\y{Name})/,
      condition: function(data, matches) {
        data.flareTargets = data.flareTargets || [];
        data.flareTargets.push(matches[1]);
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
      regex: /:242B:Neo Exdeath starts using/,
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
      regex: /:242C:Neo Exdeath starts using/,
      run: function(data) {
        data.phase = 'delta';
        data.waterHealer = null;
      },
    },
    { // Phase Tracker: Grand Cross Omega.
      regex: /:242D:Neo Exdeath starts using/,
      run: function(data) {
        data.phase = 'omega';
        data.waterHealer = null;
        data.omegaLaserCount = 1;
      },
    },
    { // Phase Tracker: Neverwhere.
      regex: /:2426:Neo Exdeath starts using/,
      run: function(data) {
        data.finalphase = true;
      },
    },
    { // Wound tracking
      regex: /:(\y{Name}) (gains|loses) the effect of White Wound/,
      regexDe: /:(\y{Name}) (gains|loses) the effect of Wunde Des Lebenden/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      run: function(data, matches) {
        data.whiteWound = matches[2] == 'gains';
      },
    },
    { // Wound tracking
      regex: /:(\y{Name}) (gains|loses) the effect of Black Wound/,
      regexDe: /:(\y{Name}) (gains|loses) the effect of Wunde Des Toten/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      run: function(data, matches) {
        data.blackWound = matches[2] == 'gains';
      },
    },
    { // Beyond death tracking
      regex: /:(\y{Name}) (gains|loses) the effect of Beyond Death/,
      regexDe: /:(\y{Name}) (gains|loses) the effect of Jenseis Des Jenseits/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      run: function(data, matches) {
        data.beyondDeath = matches[2] == 'gains';
      },
    },
    { // Allagan field tracking
      regex: /:(\y{Name}) (gains|loses) the effect of Allagan Field/,
      regexDe: /:(\y{Name}) (gains|loses) the effect of Allagisches Feld/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      run: function(data, matches) {
        data.allaganField = matches[2] == 'gains';
      },
    },
    { // Inner Flood (move out).
      id: 'O4S2 Flood of Naught: Inside',
      regex: /:240E:Neo Exdeath starts using/,
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
      regex: /:240F:Neo Exdeath starts using/,
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
      regex: /:2411:Neo Exdeath starts using/,
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
      regex: /:2412:Neo Exdeath starts using/,
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
      regex: /:24(OE|0F|11|12):Neo Exdeath starts using/,
      run: function(data, matches) {
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
      regex: /:2416:Neo Exdeath starts using/,
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
      regex: /:241C:Neo Exdeath starts using/,
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
      regex: /:242B:Neo Exdeath starts using/,
      infoText: {
        en: 'Grand Cross Alpha: Go to middle',
        de: 'Supernova Alpha: In die Mitte',
      },
      tts: {
        en: 'go to middle',
        de: 'In die Mitte',
      },
    },
    { // Grand Cross Alpha finished cast - Use Apoc on tank except before Omega.
      id: 'O4S2 Apocatastasis',
      regex: /:242B:Neo Exdeath starts using/,
      delaySeconds: 5,
      alertText: {
        en: 'Apocatastasis on tank',
        de: 'Apokatastasis auf Tank',
      },
      condition: function(data, matches) {
        return data.role == 'dps-caster' && (data.alphaCount == 1 || data.alphaCount == 3);
      },
    },
    { // Grand Cross Delta.
      id: 'O4S2 Grand Cross Delta',
      regex: /:242C:Neo Exdeath starts using/,
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
      regex: /:242D:Neo Exdeath starts using/,
      infoText: {
        en: 'Grand Cross Omega: Go to middle',
        de: 'Supernova Omega: In die Mitte',
      },
      tts: {
        en: 'go to middle',
        de: 'in die Mitte',
      },
    },
    { // Grand Cross Omega finished cast - Use Apoc on healer.
      id: 'O4S2 Apocatastasis',
      regex: /:242D:Neo Exdeath starts using/,
      delaySeconds: 8,
      alertText: {
        en: 'Apocatastasis on healer',
        de: 'Apokatastasis auf Heiler',
      },
      condition: function(data, matches) {
        return data.role == 'dps-caster';
      },
    },
    { // Forked Lightning - Don't Stack.
      id: 'O4S2 Forked Lightning',
      regex: /:(\y{Name}) gains the effect of Forked Lightning from/,
      regexDe: /:(\y{Name}) gains the effect of Gabelblitz from/,
      delaySeconds: 1,
      alertText: {
        en: 'Forked Lightning: Don\'t Stack',
        de: 'Gabelblitz: Nicht stacken',
      },
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      tts: {
        en: 'lightning get out',
        de: 'blitz raus da',
      },
    },
    { // Acceleration Bomb
      id: 'O4S2 Acceleration Bomb',
      regex: /:(\y{Name}) gains the effect of Acceleration Bomb from .*? for (\y{Float}) Seconds/,
      regexDe: /:(\y{Name}) gains the effect of Beschleunigungsbombe from .*? for (\y{Float}) Seconds/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      delaySeconds: function(data, matches) {
        return parseFloat(matches[2]) - 4;
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
      regex: /:(\y{Name}) gains the effect of Acceleration Bomb from .*? for (\y{Float}) Seconds/,
      regexDe: /:(\y{Name}) gains the effect of Beschleunigungsbombe from .*? for (\y{Float}) Seconds/,
      condition: function(data, matches) {
        return matches[1] == data.me && data.phase == 'delta';
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
      regex: /:(\y{Name}) gains the effect of Cursed Shriek from .*? for (\y{Float}) Seconds/,
      regexDe: /:(\y{Name}) gains the effect of Schrei Der Verwünschung from .*? for (\y{Float}) Seconds/,
      condition: function(data, matches) {
        return matches[1] == data.me && data.phase == 'omega';
      },
      delaySeconds: function(data, matches) {
        return parseFloat(matches[2]) - 5;
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
      regex: /:(\y{Name}) gains the effect of Compressed Water/,
      regexDe: /:(\y{Name}) gains the effect of Wasserkompression/,
      run: function(data, matches) {
        data.waterHealer = matches[1];
      },
    },
    { // Water Me (Delta/Omega)
      id: 'O4S2 Water Me',
      regex: /:(\y{Name}) gains the effect of Compressed Water/,
      regex: /:(\y{Name}) gains the effect of Wasserkompression/,
      condition: function(data, matches) {
        return matches[1] == data.me;
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
      regex: /:(\y{Name}) gains the effect of Beyond Death from .*? for (\y{Float}) Seconds/,
      regexDe: /:(\y{Name}) gains the effect of Jenseits Des Jenseits from .*? for (\y{Float}) Seconds/,
      condition: function(data, matches) {
        return data.phase == 'delta' && matches[1] == data.me && data.role == 'tank';
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
      regex: /:(\y{Name}) gains the effect of Beyond Death from .*? for (\y{Float}) Seconds/,
      regexDe: /:(\y{Name}) gains the effect of Jenseits Des Jenseits from .*? for (\y{Float}) Seconds/,
      condition: function(data, matches) {
        return data.phase == 'delta' && matches[1] == data.me && data.role != 'tank';
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
      regex: /:(\y{Name}) gains the effect of Off-Balance/,
      regexDe: /:(\y{Name}) gains the effect of Gleichgewichtsverlust/,
      condition: function(data, matches) {
        return data.phase == 'omega' && matches[1] == data.me;
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
      regex: /1B:........:(\y{Name}):....:....:0028:0000:0000:0000:/,
      condition: function(data, matches) {
        return matches[1] == data.me;
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
      regex: /:241E:Neo Exdeath starts using/,
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
      regex: /:2417:Neo Exdeath starts using/,
      alertText: function(data) {
        // 4th almagest skips Dismantle but get Addle.
        // 5th almagest skips Addle but gets Troubadour/Dismantle.
        if (data.job == 'MCH' && data.almagestCount != 3) {
          return {
            en: 'Almagest: Dismantle',
            de: 'Almagest: Zerlegen',
          };
        }
        if (data.role == 'dps-caster' && data.almagestCount != 4) {
          return {
            en: 'Almagest: Addle',
            de: 'Almagest: Stumpfsinn',
          };
        }
        if (data.job == 'BRD' && data.almagestCount == 4) {
          return {
            en: 'Almagest: Troubadour',
            de: 'Almagest: Troubadour',
          };
        }
        return {
          en: 'Almagest',
          de: 'Almagest',
        };
      },
      tts: {
        en: 'almagest',
        de: 'almagest',
      },
      run: function(data) {
        data.almagestCount = (data.almagestCount || 0) + 1;
      },
    },
    { // Final phase Addle warning when Reprisal is ending.
      id: 'O4S2 Reprisal',
      regex: /gains the effect of Reprisal from .*? for (\y{Float}) Seconds/,
      regex: /gains the effect of Reflexion from .*? for (\y{Float}) Seconds/,
      durationSeconds: function(data, matches) {
        return parseFloat(matches[1]);
      },
      infoText: {
        en: 'Reprisal active',
        de: 'Reflexion aktiv',
      },
      condition: function(data) {
        return data.finalphase && !data.reprisal;
      },
      run: function(data) {
        data.reprisal = true;
      },
    },
    { // Final phase Addle warning when Reprisal is ending.
      id: 'O4S2 Reprisal',
      regex: /loses the effect of Reprisal from/,
      regex: /loses the effect of Reflexion from/,
      condition: function(data) {
        return data.finalphase && data.reprisal;
      },
      alertText: {
        en: 'Reprisal ended',
        de: 'Reflexion zu Ende',
      },
      run: function(data) {
        data.reprisal = false;
      },
    },
    { // Flare
      id: 'O4S2 Flare',
      regex: /2401:Neo Exdeath starts using (?:Unknown_2401|Flare) on (\y{Name})/,
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
        data.flareTargets.push(matches[1]);
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
}];
