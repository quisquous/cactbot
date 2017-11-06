// O4S - Deltascape 4.0 Savage
[{
  zoneRegex: /(Deltascape V4.0 \(Savage\)|Unknown Zone \(2Ba\))/,
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
      run: function(data) { data.phase = 'alpha'; data.alphaCount = (data.alphaCount || 0) + 1; },
    },
    { // Phase Tracker: Grand Cross Delta.
      regex: /:242C:Neo Exdeath starts using/,
      run: function(data) { data.phase = 'delta'; },
    },
    { // Phase Tracker: Grand Cross Omega.
      regex: /:242D:Neo Exdeath starts using/,
      run: function(data) { data.phase = 'omega'; },
    },
    { // Phase Tracker: Neverwhere.
      regex: /:2426:Neo Exdeath starts using/,
      run: function(data) { data.finalphase = true; },
    },
    { // Inner Flood (move out).
      id: 'O4S2 Flood of Naught: Inside',
      regex: /:240E:Neo Exdeath starts using/,
      alertText: 'Go Outside',
      tts: 'out out out',
    },
    { // Outer Flood (move in).
      id: 'O4S2 Flood of Naught: Outside',
      regex: /:240F:Neo Exdeath starts using/,
      alertText: 'Go Inside',
      tts: 'in in in',
    },
    { // Purple/Blue Flood.
      id: 'O4S2 Flood of Naught: Colors',
      regex: /:2411:Neo Exdeath starts using/,
      alertText: 'Color sides',
      tts: 'colors',
    },
    { // Blue/Purple Flood.
      id: 'O4S2 Flood of Naught: Colors',
      regex: /:2412:Neo Exdeath starts using/,
      alertText: 'Color sides',
      tts: 'colors',
    },
    { // Charge Flood.
      id: 'O4S2 Flood of Naught: Charge',
      regex: /:2416:Neo Exdeath starts using/,
      infoText: 'Flood of Naught: Charge',
    },
    {  // Double attack.
      id: 'O4S2 Double Attack',
      regex: /:241C:Neo Exdeath starts using/,
      alertText: 'Double Attack: Get out',
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
    { // Forked Lightning - Get out.
      id: 'O4S2 Forked Lightning',
      regex: /:(\y{Name}) gains the effect of Forked Lightning from/,
      delaySeconds: 1,
      alertText: 'Forked Lightning: Get out',
      condition: function(data, matches) { return matches[1] == data.me; },
      tts: 'lightning get out',
    },
    { // Acceleration Bomb
      id: 'O4S2 Acceleration Bomb',
      regex: /:(\y{Name}) gains the effect of (?:Unknown_568|Acceleration Bomb) from .*? for ([0-9.]+) Seconds/,
      alarmText: 'Stop',
      delaySeconds: function(data, matches) { return parseFloat(matches[2]) - 4; },  // 4 second warning.
      condition: function(data, matches) { return matches[1] == data.me; },
      tts: 'stop',
    },
    { // Beyond Death (Delta)
      id: 'O4S2 Beyond Death',
      regex: /:(\y{Name}) gains the effect of (?:Unknown_566|Beyond Death) from .*? for ([0-9.]+) Seconds/,
      delaySeconds: 7,
      alarmText: 'Beyond Death: Die',
      sound: '../../resources/sounds/Overwatch/Reaper_-_Die_die_die.ogg',
      condition: function(data, matches) { return data.phase == 'delta' && matches[1] == data.me; },
      tts: 'die die die',
    },
    { // Beyond Death (Omega)
      id: 'O4S2 Beyond Death',
      regex: /:(\y{Name}) gains the effect of (?:Unknown_566|Beyond Death) from .*? for ([0-9.]+) Seconds/,
      delaySeconds: 8,  // 20 seconds if you want the third flood cast, 8 for the first.
      alarmText: 'Beyond Death: Die',
      sound: '../../resources/sounds/Overwatch/Reaper_-_Die_die_die.ogg',
      condition: function(data, matches) { return data.phase == 'omega' && matches[1] == data.me; },
      tts: 'die die die',
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
      regex: /gains the effect of Reprisal from .*? for ([0-9.]+) Seconds/,
      durationSeconds: function(data, matches) { return parseFloat(matches[1]); },
      infoText: 'Reprisal active',
      condition: function(data) { return data.finalphase && !data.reprisal; },
      run: function(data) { data.reprisal = true; },
    },
    { // Final phase Addle warning when Reprisal is ending.
      id: 'O4S2 Reprisal',
      regex: /loses the effect of Reprisal from/,
      alertText: 'Reprisal ended',
      condition: function(data) { return data.finalphase && data.reprisal; },
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
      }
    },
  ]
}]
