var kAurasTriggers = {};

/*
{ // Example trigger.
  //
  // Fields that can be a function will receive the following arguments:
  // data: An object that triggers may store state on. It is reset when combat ends.
  //       It comes with the following fields pre-set:
  //       me: The player's character name.
  //       job: The player's job.
  //       role: The role of the player's job (tank/healer/dps-melee/dps-ranged/dps-caster).
  // matches: The regex match result of the trigger's regex to the log line it matched.
  //          matches[0] will be the entire match, and matches[1] will be the first group
  //          in the regex, etc. This can be used to pull data out of the log line.
  //
  // Regular expression to match against.
  regex: /trigger-regex-(with-position-1)-here/,
  // Number of seconds to show the icon and/or text for. Either seconds or a function(data, matches).
  durationSeconds: 3,
  // Time to wait before showing it once the regex is seen. Can be a number or a function(data, matches).
  delaySeconds: 0,
  // Icon to show, a key into gAurasIcons in auras-icons.js, or a literal url.
  icon: 'iconName or data:image/png;base64,iVBORw0KGgoAAAANSUhE',
  // Color of icon border.
  iconBorderColor: '#000',
  // Text to show below the icon. May be a function(data, matches) that returns a string.
  iconText: 'DO STUFF',
  // Color of the text.
  iconTextColor: '#000',
  // Text to show with info importance. May be a function(data, matches) that returns a string.
  infoText = 'Info',
  // Text to show with alert importance. May be a function(data, matches) that returns a string.
  alertText = 'Info',
  // Text to show with alarm importance. May be a function(data, matches) that returns a string.
  alarmText = 'Info',
  // Sound file to play, a key into gAurasSounds in auras-sounds.js, or a literal url.
  sound: '',
  // Volume between 0 and 1 to play |sound|.
  soundVolume: 1,
  // A function(data, matches) to test if the trigger should fire or not. If it does not return
  // true, nothing is shown/sounded/run. This is the first thing that is run on the trigger.
  condition: function(data, matches) { return true if it should run }
  // A function(data, matches) to run. This runs as the last step when the trigger fires.
  run: function(data, matches) { do stuff.. },
  // If this is true, the trigger is completely disabled and ignored.
  disabled: true,
},
*/

// Global zone
kAurasTriggers['.'] = [
  { // Inner Flood (move out).
    regex: /:test:trigger:/,
    infoText: 'This in info',
    alertText: 'Alert is like this',
    alarmText: 'Alarm is here',
    run: function(data) { console.log('me: ' + data.me + ' / job: ' + data.job + ' / role :' + data.role); }
  },
];

// O1S - Deltascape 1.0 Savage
kAurasTriggers['Unknown Zone \\(2B7\\)'] = [
  {
    regex: /:1EDD:Alte Roite starts using/,
    infoText: 'Blaze: Stack up',
  },
  {
    regex: /:1ED6:Alte Roite starts using/,
    infoText: 'Breath Wing: Be beside boss',
  },
  {
    regex: /:1EDE:Alte Roite starts using/,
    infoText: 'Clamp: Get out of front',
  },
  {
    regex: /:1ED8:Alte Roite starts using/,
    infoText: 'Downburst: Knockback',
  },
  {
    regex: /:1ED4:Alte Roite starts using/,
    infoText: 'Roar: AOE damage',
    condition: function(data) { return data.role == 'healer' },
  },
  {
    regex: /:1ED3:Alte Roite starts using/,
    infoText: 'Charybdis: AOE damage',
    condition: function(data) { return data.role == 'healer' },
  },
];

// O2S - Deltascape 2.0 Savage
kAurasTriggers['Unknown Zone \\(2B8\\)'] = [
 // 2nd Maniacal Probe => South
  {
    regex: /:([A-Za-z ']+) gains the effect of (Unknown_556|Levitation) from/,
    run: function(data) { data.levitating = true; },
    condition: function(data, matches) { return matches[1] == data.me; },
  },
  {
    regex: /:([A-Za-z ']+) loses the effect of (Unknown_556|Levitation)/,
    run: function(data) { data.levitating = false; },
  },
  {
    regex: /:235E:Catastrophe starts using/,
    infoText: '-100 Gs: Go north/south and look away',
  },
  {
    regex: /:236F:Catastrophe starts using/,
    alarmText: 'Death\'s Gaze: Look away',
  },
  {
    regex: /:2374:Catastrophe starts using/,
    infoText: function(data) { if (data.levitating) return 'Earthquake'; },
    alertText: function(data) { if (!data.levitating) return 'Earthquake: Levitate'; },
  },
  {
    regex: /:235A:Catastrophe starts using/,
    infoText: function(data) {
      var dpsProbe = data.probeCount == 1 || data.probeCount == 3;
      if (dpsProbe != data.role.startsWith('dps')) {
        if (!dpsProbe) return 'Maniacal Probe: Tanks & Healers';
        else return 'Maniacal Probe: DPS';
      }
    },
    alertText: function(data) {
      var dpsProbe = data.probeCount == 1 || data.probeCount == 3;
      if (dpsProbe == data.role.startsWith('dps')) {
        if (!dpsProbe) return 'Maniacal Probe: Tanks & Healers';
        else return 'Maniacal Probe: DPS';
      }
    },
    run: function(data) { data.probeCount = (data.probeCount || 0) + 1; },
  },
  {
    regex: /:([A-Za-z ']+) gains the effect of 6 Fulms Under from/,
    delaySeconds: 5,
    infoText: function(data) { if (data.levitating) return '6 Fulms Under'; },
    alertText: function(data) { if (!data.levitating) return '6 Fulms Under: Levitate'; },
    condition: function(data, matches) { return matches[1] == data.me; },
  },
  {
    regex: /:([A-Za-z ']+) gains the effect of (Unknown_54E|Elevated) from/,
    alertText: 'Elevated: DPS up, Tanks & Healers down',
  },
  {
    condition: function() { return false; },
    regex: /:2372:Catastrophe starts usinge/,
    infoText: 'Gravitational Wave: AOE damage',
  },
  {
    regex: /:([A-Za-z ']+) gains the effect of Unstable Gravity from/,
    infoText: 'Unstable Gravity',
    condition: function(data, matches) { return matches[1] == data.me; },
  },
  {
    regex: /:([A-Za-z ']+) gains the effect of Unstable Gravity from/,
    delaySeconds: 9,
    alertText: 'Elevate and outside stack',
  },
];

// O3S - Deltascape 3.0 Savage
kAurasTriggers['Unknown Zone \\(2B9\\)'] = [
  {
    regex: /([A-Za-z ']+) gains the effect of (Unknown_510|Right Face) from/,
    infoText: 'Mindjack: Right',
    condition: function(data, matches) { return matches[1] == data.me; },
  },
  {
    regex: /([A-Za-z ']+) gains the effect of (Unknown_50D|Forward March) from/,
    infoText: 'Mindjack: Forward',
    condition: function(data, matches) { return matches[1] == data.me; },
  },
  {
    regex: /([A-Za-z ']+) gains the effect of (Unknown_50F|Left Face) from/,
    infoText: 'Mindjack: Left',
    condition: function(data, matches) { return matches[1] == data.me; },
  },
  {
    regex: /([A-Za-z ']+) gains the effect of (Unknown_50E|About Face) from/,
    infoText: 'Mindjack: Back',
    condition: function(data, matches) { return matches[1] == data.me; },
  },
  {
    regex: /:22F7:Halicarnassus starts using/,
    alertText: 'Ribbit: Get behind',
  },
  {
    regex: /:22F9:Halicarnassus starts using/,
    infoText: 'Oink: Stack',
  },
  {
    regex: /:22F8:Halicarnassus starts using/,
    alarmText: 'Squelch: Look away',
  },
  {
    regex: /:230E:Halicarnassus starts using/,
    alertText: 'The Queen\'s Waltz: Books',
  },
  {
    regex: /:2306:Halicarnassus starts using/,
    infoText: 'The Queen\'s Waltz: Clock',
  },
  {
    regex: /:230A:Halicarnassus starts using/,
    infoText: 'The Queen\'s Waltz: Crystal Square',
  },
  {
    regex: /:2308:Halicarnassus starts using/,
    infoText: 'The Queen\'s Waltz: Tethers',
  },
];

// O4S - Deltascape 4.0 Savage
kAurasTriggers['Unknown Zone \\(2Ba\\)'] = [
  // Part 1
  { // Fire III not after Decisive Battle.
    regex: /:23F5:Exdeath starts using/,
    infoText: 'Fire III',
  },
  { // Blizzard III not after Decisive Battle.
    regex: /:23F7:Exdeath starts using/,
    infoText: 'Blizzard III' ,
  },
  { // Thunder III not after Decisive Battle.
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
      if (data.thunderCount == 1) return 'Thunder III: Addle during';
      if (data.thunderCount == 2) return 'Thunder III: Addle after';
    },
    run: function(data) { data.thunderCount = (data.thunderCount || 0) + 1; },
  },
  { // Fire III after Decisive Battle.
    regex: /:23FB:Exdeath starts using/,
    alarmText: 'Fire III: Stop',
  },
  { // Blizzard III after Decisive Battle.
    regex: /:23FC:Exdeath starts using/,
    alertText: 'Blizzard III: Keep moving',
  },
  { // Thunder III after Decisive Battle.
    regex: /:23FD:Exdeath starts using/,
    alertText: 'Thunder III: Get out',
  },
  { // Flare
    regex: /2401:Exdeath starts using (Unknown_2401|Flare) on ([A-Za-z ']+)/,
    infoText: function(data) {
      //return "Flare on " + data.flareTargets[0] + ", " + data.flareTargets[1] + ", " + data.flareTargets[2]
    },
    alarmText: function(data) {
      if (data.flareTargets.indexOf(data.me) >= 0)
        return "Flare on you";
    },
    condition: function(data, matches) {
      data.flareTargets = data.flareTargets || [];
      data.flareTargets.push(matches[2]);
      return data.flareTargets.length == 3;
    },
    run: function(data) {
      delete data.flareTargets;
    }
  },

  // Part 2
  { // Inner Flood (move out).
    regex: /:240E:Neo Exdeath starts using/,
    alertText: 'Flood of Naught: Go Outside',
  },
  { // Outer Flood (move in).
    regex: /:240F:Neo Exdeath starts using/,
    alertText: 'Flood of Naught: Go Inside',
  },
  { // Purple/Blue Flood.
    regex: /:2411:Neo Exdeath starts using/,
    alertText: 'Flood of Naught: Color sides',
  },
  { // Blue/Purple Flood.
    regex: /:2412:Neo Exdeath starts using/,
    alertText: 'Flood of Naught: Color sides',
  },
  { // Charge Flood.
    regex: /:2416:Neo Exdeath starts using/,
    infoText: 'Flood of Naught: Charge',
  },
  {  // Double attack.
    regex: /:241C:Neo Exdeath starts using/,
    alertText: 'Double Attack: Get out',
  },
  { // Grand Cross Alpha.
    regex: /:242B:Neo Exdeath starts using/,
    infoText: 'Grand Cross Alpha: Go to middle',
    run: function(data) { data.alphaCount = (data.alphaCount || 0) + 1; },
  },
  { // Grand Cross Alpha finished cast - Use Apoc on tank except before Omega.
    regex: /:242B:Neo Exdeath starts using/,
    delaySeconds: 5,
    alertText: 'Apocatastasis on tank',
    condition: function(data, matches) { return data.role == 'dps-caster' && (data.alphaCount == 1 || data.alphaCount == 3); },
  },
  { // Grand Cross Delta.
    regex: /:242C:Neo Exdeath starts using/,
    infoText: 'Grand Cross Delta: Inside boss',
  },
  { // Grand Cross Omega.
    regex: /:242D:Neo Exdeath starts using/,
    infoText: 'Grand Cross Omega: Go to middle',
  },
  { // Grand Cross Omega finished cast - Use Apoc on healer.
    regex: /:242D:Neo Exdeath starts using/,
    delaySeconds: 8,
    alertText: 'Apocatastasis on healer',
    condition: function(data, matches) { return data.role == 'dps-caster'; },
  },
  { // Forked Lightning - Get out.
    regex: /:([A-Za-z ']+) gains the effect of Forked Lightning from/,
    delaySeconds: 1,
    alertText: 'Forked Lightning: Get out',
    condition: function(data, matches) { return matches[1] == data.me; },
  },
  { // Acceleration Bomb
    regex: /:([A-Za-z ']+) gains the effect of (Unknown_568|Acceleration Bomb) from .*? for ([0-9.]+) Seconds/,
    alarmText: 'Stop',
    delaySeconds: function(data, matches) { return parseFloat(matches[3]) - 4; },  // 4 second warning.
    condition: function(data, matches) { return matches[1] == data.me; },
  },
  { // Beyond Death
    regex: /:([A-Za-z ']+) gains the effect of (Unknown_568|Beyond Death) from .*? for ([0-9.]+) Seconds/,
    alarmText: 'Beyond Death: Die',
    sound: '../sounds/Overwatch/Reaper_-_Die_die_die.ogg',
    delaySeconds: function(data, matches) { return parseFloat(matches[3]) - 9; },  // 9 second warning.
    condition: function(data, matches) { return matches[1] == data.me; },
  },
  { // Almagest
    regex: /:2417:Neo Exdeath starts using/,
    alertText: 'Almagest',
    run: function(data) { data.almagestCount = (data.almagestCount || 0) + 1; },
  },
  { // Delta Attack
    regex: /:241E:Neo Exdeath starts using/,
    infoText: 'Delta Attack: Stack',
  },
  { // Vacuum Wave warning after Almagest
    regex: /:2417:Neo Exdeath starts using/,
    delaySeconds: 25,
    infoText: 'Vacuum Wave soon',
    condition: function(data) { return data.almagestCount == 2 || data.almagestCount == 5; },
  },
  { // Vacuum Wave warning after Almagest
    regex: /:2417:Neo Exdeath starts using/,
    delaySeconds: 5,
    infoText: 'Vacuum Wave soon',
    condition: function(data) { return data.almagestCount == 3 || data.almagestCount == 6; },
  },
  { // Final phase Addle warning when Reprisal is ending.
    regex: /gains the effect of Reprisal from .*? for ([0-9.]+) Seconds/,
    durationSeconds: function(data, matches) { return parseFloat(matches[1]); },
    infoText: 'Reprisal active',
    condition: function(data) { return data.alphaCount == 3 && !data.reprisal; },
    run: function(data) { data.reprisal = true; },
  },
  { // Final phase Addle warning when Reprisal is ending.
    regex: /loses the effect of Reprisal from/,
    alertText: 'Reprisal ended',
    condition: function(data) { return data.alphaCount == 3 && data.reprisal; },
    run: function(data) { data.reprisal = false; },
  },
  { // Flare
    regex: /2401:Neo Exdeath starts using (Unknown_2401|Flare) on ([A-Za-z ']+)/,
    infoText: function(data) {
      if (data.flareTargets.indexOf(data.me) < 0) {
        //return "Flare on " + data.flareTargets[0] + ", " + data.flareTargets[1] + ", " + data.flareTargets[2]
        return "Light and Darkness: Stack"
      }
    },
    alarmText: function(data) {
      if (data.flareTargets.indexOf(data.me) >= 0)
        return "Flare on you";
    },
    condition: function(data, matches) {
      data.flareTargets = data.flareTargets || [];
      data.flareTargets.push(matches[2]);
      return data.flareTargets.length == 3;
    },
    run: function(data) {
      delete data.flareTargets;
    }
  },
];
