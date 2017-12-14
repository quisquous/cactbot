// O4S - Deltascape 4.0 Savage
[{
  zoneRegex: /(Deltascape V4.0 \(Savage\)|Unknown Zone \(2Ba\))/,
  timelineFile: 'o4s.txt',
  timeline: `
    infotext "Vacuum Wave" before 8 "Vacuum Wave soon"
    `,
  triggers: [
    // Part 1
    { // Phase Tracker: Thunder III not after Decisive Battle.
      regex: /:23F9:Exdeath starts using/,
      run: function(data) { data.thunderCount = (data.thunderCount || 0) + 1; },
    },
    { // Fire III not after Decisive Battle.
      id: 'O4S1 Fire III',
      regex: /:23F5:Exdeath starts using/,
      infoText: 'Fire III',
    },
    { // Blizzard III not after Decisive Battle.
      id: 'O4S1 Blizzard III',
      regex: /:23F7:Exdeath starts using/,
      infoText: 'Blizzard III' ,
    },
    { // Thunder III not after Decisive Battle.
      id: 'O4S1 Thunder III',
      regex: /:23F9:Exdeath starts using/,
      infoText: function(data) {
        // Tanks/healers always get an alert.
        if (data.role == 'tank' || data.role == 'healer') return false;
        // Only the first for casters, other dps always get an info.
        if (data.role == 'dps-caster' && data.thunderCount) return false;
        return 'Thunder III';
      },
      alertText: function(data) {
        // Tanks/healers always get an alert.
        if (data.role == 'tank' || data.role == 'healer') return 'Thunder III: Tank buster';
        // Non-casters always get an info.
        if (data.role != 'dps-caster') return false;
        // Casters get an alert after the first.
        if (data.thunderCount == 2) return 'Thunder III: Addle during';
        if (data.thunderCount == 3) return 'Thunder III: Addle after';
      },
      tts: function(data) {
        if (data.role == 'tank' || data.role == 'healer')
          return 'thunder';
      },
    },
    { // Fire III after Decisive Battle.
      id: 'O4S1 Ultimate Fire III',
      regex: /:23FB:Exdeath starts using/,
      alarmText: 'Fire III: Stop',
      tts: 'fire stop moving',
    },
    { // Blizzard III after Decisive Battle.
      id: 'O4S1 Ultimate Blizzard III',
      regex: /:23FC:Exdeath starts using/,
      alertText: 'Blizzard III: Keep moving',
      tts: 'blizzard keep moving',
    },
    { // Thunder III after Decisive Battle.
      id: 'O4S1 Ultimate Thunder III',
      regex: /:23FD:Exdeath starts using/,
      alertText: 'Thunder III: Get out',
      tts: 'thunder get out',
    },
    { // Flare
      id: 'O4S1 Flare',
      regex: /2401:Exdeath starts using (?:Unknown_2401|Flare) on (\y{Name})/,
      alarmText: function(data) {
        if (data.flareTargets.indexOf(data.me) >= 0)
          return 'Flare on you';
      },
      condition: function(data, matches) {
        data.flareTargets = data.flareTargets || [];
        data.flareTargets.push(matches[1]);
        return data.flareTargets.length == 3;
      },
      tts: function(data) {
        if (data.flareTargets.indexOf(data.me) >= 0)
          return 'Flare on you';
      },
      run: function(data) {
        delete data.flareTargets;
      }
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
      run: function(data) { data.finalphase = true; },
    },
    { // Wound tracking
      regex: /:(\y{Name}) (gains|loses) the effect of White Wound/,
      condition: function(data, matches) { return matches[1] == data.me; },
      run: function(data, matches) { data.whiteWound = matches[2] == 'gains'; },
    },
    { // Wound tracking
      regex: /:(\y{Name}) (gains|loses) the effect of Black Wound/,
      condition: function(data, matches) { return matches[1] == data.me; },
      run: function(data, matches) { data.blackWound = matches[2] == 'gains'; },
    },
    { // Beyond death tracking
      regex: /:(\y{Name}) (gains|loses) the effect of Beyond Death/,
      condition: function(data, matches) { return matches[1] == data.me; },
      run: function(data, matches) { data.beyondDeath = matches[2] == 'gains'; },
    },
    { // Allagan field tracking
      regex: /:(\y{Name}) (gains|loses) the effect of Allagan Field/,
      condition: function(data, matches) { return matches[1] == data.me; },
      run: function(data, matches) { data.allaganField = matches[2] == 'gains'; },
    },
    { // Inner Flood (move out).
      id: 'O4S2 Flood of Naught: Inside',
      regex: /:240E:Neo Exdeath starts using/,
      durationSeconds: 6,
      alarmText: function(data) {
        if (data.shouldDieOnLaser())
          return 'Die on Inside';
      },
      alertText: function(data) {
        if (!data.shouldDieOnLaser())
          return 'Go Outside';
      },
      sound: function(data) {
        if (data.shouldDieOnLaser())
          return data.dieDieDieSound;
      },
      tts: function(data) {
        if (data.shouldDieOnLaser())
          return 'die in in in';
        return 'out out out';
      },
    },
    { // Outer Flood (move in).
      id: 'O4S2 Flood of Naught: Outside',
      regex: /:240F:Neo Exdeath starts using/,
      durationSeconds: 6,
      alarmText: function(data) {
        if (data.shouldDieOnLaser())
          return 'Die on Outside';
      },
      alertText: function(data) {
        if (!data.shouldDieOnLaser())
          return 'Go Inside';
      },
      sound: function(data) {
        if (data.shouldDieOnLaser())
          return data.dieDieDieSound;
      },
      tts: function(data) {
        if (data.shouldDieOnLaser())
          return 'die out out out';
        return 'in in in';
      },
    },
    { // Purple/Blue Flood.
      id: 'O4S2 Flood of Naught: Colors Purple Blue',
      regex: /:2411:Neo Exdeath starts using/,
      durationSeconds: 6,
      alarmText: function(data) {
        if (!data.shouldDieOnLaser())
          return;
        if (data.blackWound)
          return 'Die On Right Blue';
        else if (data.whiteWound)
          return 'Die On Left Purple';
        return 'Die on color sides';
      },
      alertText: function(data) {
        if (data.shouldDieOnLaser())
          return;
        if (data.blackWound)
          return 'Left On Purple';
        else if (data.whiteWound)
          return 'Right On Blue';
        return 'Color sides';
      },
      sound: function(data) {
        if (data.shouldDieOnLaser())
          return data.dieDieDieSound;
      },
      tts: 'colors',
    },
    { // Blue/Purple Flood.
      id: 'O4S2 Flood of Naught: Colors Blue Purple',
      regex: /:2412:Neo Exdeath starts using/,
      durationSeconds: 6,
      alarmText: function(data) {
        if (!data.shouldDieOnLaser())
          return;
        if (data.blackWound)
          return 'Die On Left Blue';
        else if (data.whiteWound)
          return 'Die On Right Purple';
        return 'Die on color sides';
      },
      alertText: function(data) {
        if (data.shouldDieOnLaser())
          return;
        if (data.blackWound)
          return 'Be Right On Purple';
        else if (data.whiteWound)
          return 'Be Left On Blue';
        return 'Color sides';
      },
      sound: function(data) {
        if (data.shouldDieOnLaser())
          return data.dieDieDieSound;
      },
      tts: 'colors',
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
          if (data.role == 'tank')
            return 'Charge: be behind other tank';
          else
            return 'Charge: be in the very back';
        } else {
          if (data.role == 'tank')
            return 'Charge: be in front!';
          else
            return 'Charge: be behind tanks';
        }
      },
      tts: 'charge',
    },
    {  // Double attack.
      id: 'O4S2 Double Attack',
      regex: /:241C:Neo Exdeath starts using/,
      alertText: function(data) {
        if (data.role == 'tank')
          return 'Double Attack';
        return 'Double Attack: Get out';
      },
      tts: 'double attack',
    },
    { // Grand Cross Alpha.
      id: 'O4S2 Grand Cross Alpha',
      regex: /:242B:Neo Exdeath starts using/,
      infoText: 'Grand Cross Alpha: Go to middle',
      tts: 'go to middle',
    },
    { // Grand Cross Alpha finished cast - Use Apoc on tank except before Omega.
      id: 'O4S2 Apocatastasis',
      regex: /:242B:Neo Exdeath starts using/,
      delaySeconds: 5,
      alertText: 'Apocatastasis on tank',
      condition: function(data, matches) { return data.role == 'dps-caster' && (data.alphaCount == 1 || data.alphaCount == 3); },
    },
    { // Grand Cross Delta.
      id: 'O4S2 Grand Cross Delta',
      regex: /:242C:Neo Exdeath starts using/,
      infoText: function(data) {
        if (data.role == 'tank')
          return 'Grand Cross Delta: Be in front of boss';
        if (data.role == 'healer')
          return 'Grand Cross Delta: Be on sides of boss';
        return 'Grand Cross Delta: Inside boss';
      },
      tts: function(data) {
        if (data.role == 'tank')
          return 'delta: be in front';
        if (data.role == 'healer')
          return 'delta: be on sides';
        return 'delta: be inside boss';
      },
    },
    { // Grand Cross Omega.
      id: 'O4S2 Grand Cross Omega',
      regex: /:242D:Neo Exdeath starts using/,
      infoText: 'Grand Cross Omega: Go to middle',
      tts: 'go to middle',
    },
    { // Grand Cross Omega finished cast - Use Apoc on healer.
      id: 'O4S2 Apocatastasis',
      regex: /:242D:Neo Exdeath starts using/,
      delaySeconds: 8,
      alertText: 'Apocatastasis on healer',
      condition: function(data, matches) { return data.role == 'dps-caster'; },
    },
    { // Forked Lightning - Don't Stack.
      id: 'O4S2 Forked Lightning',
      regex: /:(\y{Name}) gains the effect of Forked Lightning from/,
      delaySeconds: 1,
      alertText: "Forked Lightning: Don't Stack",
      condition: function(data, matches) { return matches[1] == data.me; },
      tts: 'lightning get out',
    },
    { // Acceleration Bomb
      id: 'O4S2 Acceleration Bomb',
      regex: /:(\y{Name}) gains the effect of Acceleration Bomb from .*? for (\y{Float}) Seconds/,
      condition: function(data, matches) { return matches[1] == data.me; },
      delaySeconds: function(data, matches) { return data.ParseLocaleFloat(matches[2]) - 4; },  // 4 second warning.
      alarmText: function(data) {
        if (data.phase == 'omega')
          return 'look away and stop';
        return 'stop';
      },
      tts: 'stop',
    },
    {
      id: 'O4S2 Acceleration Bomb Delta',
      regex: /:(\y{Name}) gains the effect of Acceleration Bomb from .*? for (\y{Float}) Seconds/,
      condition: function(data, matches) { return matches[1] == data.me && data.phase == 'delta'; },
      infoText: 'Acceleration Bomb',
      tts: 'bomb',
    },
    { // Shriek (Omega)
      id: 'O4S2 Omega Shriek',
      regex: /:(\y{Name}) gains the effect of Cursed Shriek from .*? for (\y{Float}) Seconds/,
      condition: function(data, matches) { return matches[1] == data.me && data.phase == 'omega'; },
      delaySeconds: function(data, matches) { return data.ParseLocaleFloat(matches[2]) - 5; },
      alertText: 'shriek: get mid, look away',
      tts: 'shriek',
    },
    { // Water Tracking (Delta/Omega)
      id: 'O4S2 Water',
      regex: /:(\y{Name}) gains the effect of Compressed Water/,
      run: function(data, matches) {
        data.waterHealer = matches[1];
      },
    },
    { // Water Me (Delta/Omega)
      id: 'O4S2 Water Me',
      regex: /:(\y{Name}) gains the effect of Compressed Water/,
      condition: function(data, matches) { return matches[1] == data.me; },
      alarmText: function(data) {
        // Not clear where to tell the healer where to go on delta
        // due to picking a side for uptime strat, or other strats.
        if (data.phase == 'delta')
          return 'water on you';
        else if (data.phase == 'omega')
          return 'water: stack under neo';
      },
      tts: 'water stack',
    },
    { // Beyond Death Tank (Delta)
      id: 'O4S2 Beyond Death Delta Tank',
      regex: /:(\y{Name}) gains the effect of Beyond Death from .*? for (\y{Float}) Seconds/,
      condition: function(data, matches) {
        return data.phase == 'delta' && matches[1] == data.me && data.role == 'tank';
      },
      delaySeconds: 0.5,
      infoText: function(data) {
        // Something went awry, or maybe healers dead.  Just say stack on water anyway,
        // instead of trying to be smart when the healers die.
        if (data.waterHealer)
          return 'Stack on ' + data.waterHealer;
        else
          return 'Stack on water';
      },
      tts: 'water stack',
    },
    { // Beyond Death (Delta)
      id: 'O4S2 Beyond Death Delta Initial',
      regex: /:(\y{Name}) gains the effect of Beyond Death from .*? for (\y{Float}) Seconds/,
      condition: function(data, matches) {
        return data.phase == 'delta' && matches[1] == data.me && data.role != 'tank';
      },
      infoText: 'Beyond Death',
      tts: 'death',
    },
    { // Off Balance (Omega)
      id: 'O4S2 Off Balance Omega',
      regex: /:(\y{Name}) gains the effect of Off-Balance/,
      condition: function(data, matches) {
        return data.phase == 'omega' && matches[1] == data.me;
      },
      delaySeconds: 0.5,
      infoText: function(data) {
        // Good for both dps and tanks.
        if (data.waterHealer)
          return 'Stack under boss on ' + data.waterHealer;
        else
          return 'Stack on water';
      },
      tts: 'water stack',
    },
    { // Earthshaker
      id: 'O4S2 Earthshaker',
      regex: /1B:........:(\y{Name}):....:....:0028:0000:0000:0000:/,
      condition: function(data, matches) { return matches[1] == data.me; },
      alarmText: function(data) {
        if (data.role != 'tank')
          return 'Earthshaker on YOU';
      },
      infoText: function(data) {
        if (data.role == 'tank')
          return 'Earthshaker on you';
      },
      tts: 'shaker',
    },
    { // Delta Attack
      id: 'O4S2 Delta Attack',
      regex: /:241E:Neo Exdeath starts using/,
      infoText: 'Delta Attack: Stack',
      tts: 'stack for delta',
    },
    { // Almagest
      id: 'O4S2 Almagest',
      regex: /:2417:Neo Exdeath starts using/,
      alertText: function(data) {
        // 4th almagest skips Dismantle but get Addle.
        // 5th almagest skips Addle but gets Troubadour/Dismantle.
        if (data.job == 'MCH' && data.almagestCount != 3) return 'Almagest: Dismantle';
        if (data.role == 'dps-caster' && data.almagestCount != 4) return 'Almagest: Addle';
        if (data.job == 'BRD' && data.almagestCount == 4) return 'Almagest: Troubadour';
        return 'Almagest';
      },
      tts: 'almagest',
      run: function(data) { data.almagestCount = (data.almagestCount || 0) + 1; },
    },
    { // Final phase Addle warning when Reprisal is ending.
      id: 'O4S2 Reprisal',
      regex: /gains the effect of Reprisal from .*? for (\y{Float}) Seconds/,
      durationSeconds: function(data, matches) { return data.ParseLocaleFloat(matches[1]); },
      infoText: 'Reprisal active',
      condition: function(data) { return data.finalphase && !data.reprisal; },
      run: function(data) { data.reprisal = true; },
    },
    { // Final phase Addle warning when Reprisal is ending.
      id: 'O4S2 Reprisal',
      regex: /loses the effect of Reprisal from/,
      condition: function(data) { return data.finalphase && data.reprisal; },
      alertText: 'Reprisal ended',
      run: function(data) { data.reprisal = false; },
    },
    { // Flare
      id: 'O4S2 Flare',
      regex: /2401:Neo Exdeath starts using (?:Unknown_2401|Flare) on (\y{Name})/,
      infoText: function(data) {
        if (data.flareTargets.indexOf(data.me) < 0) {
          return 'Light and Darkness: Stack';
        }
      },
      alarmText: function(data) {
        if (data.flareTargets.indexOf(data.me) >= 0)
          return 'Flare on you';
      },
      condition: function(data, matches) {
        data.flareTargets = data.flareTargets || [];
        data.flareTargets.push(matches[1]);
        return data.flareTargets.length == 3;
      },
      tts: function(data) {
        if (data.flareTargets.indexOf(data.me) >= 0)
          return 'flare on you';
        else
          return 'stack';
      },
      run: function(data) {
        delete data.flareTargets;
      },
    },
  ]
}]
