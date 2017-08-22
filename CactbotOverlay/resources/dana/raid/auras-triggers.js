var kAurasTriggersMe = 'Test Name';
document.addEventListener("onPlayerChangedEvent", function(e) { kAurasTriggersMe = e.detail.name });

var kAurasTriggers = {};

/* 
{ // Example trigger.
  // Regular expression to match against.
  regex: /trigger-regex-(with-position-1)-here/,
  // Either seconds or position can be specified. Seconds is fixed. Position is parsed as a float from the regex.
  durationSeconds: 3,
  durationPosition: 2,
  // Time to wait before showing it once the regex is seen.
  delaySeconds: 0,
  // Icon to show, a key into gAurasIcons in auras-icons.js, or a literal url.
  icon: 'iconName or data:image/png;base64,iVBORw0KGgoAAAANSUhE',
  // Color of icon border.
  iconBorderColor: '#000',
  // Text to show below the icon. May be a function like run() that returns a string.
  iconText: 'DO STUFF',
  // Color of the text.
  iconTextColor: '#000',
  // Text to show with info importance. May be a function like run() that returns a string.
  infoText = 'Info',
  // Text to show with alert importance. May be a function like run() that returns a string.
  alertText = 'Info',
  // Text to show with alarm importance. May be a function like run() that returns a string.
  alarmText = 'Info',
  // Sound file to play, a key into gAurasSounds in auras-sounds.js, or a literal url.
  sound: '',
  // Volume between 0 and 1 to play |sound|.
  soundVolume: 1,
  // A function to test if the trigger should fire or not. Passed the same data object as |run|. If it
  // does not return true, nothing is shown/sounded/run.
  condition: function(data, matches) { return true if it should run }
  // Function to run. Passed an object that data can be stored/read, which is reset when the fight ends.
  // This runs after any text functions.
  run: function(data, matches) { do stuff.. },
},
*/

// Global zone
kAurasTriggers['.'] = [
  { // Inner Flood (move out).
    regex: /:test:trigger:/,
    infoText: 'This in info',
    alertText: 'Alert is like this',
    alarmText: 'Alarm is here',
  },
];

// O1S - Deltascape 1.0 Savage
kAurasTriggers['Unknown Zone \\(2B7\\)'] = [
  {
    regex: /Alte Roite readies Blaze/,
    infoText: 'Blaze: Stack up',
  },
  {
    regex: /Alte Roite readies Breath Wing/,
    infoText: 'Breath Wing: Be beside boss',
  },
  {
    regex: /Alte Roite readies Clamp/,
    infoText: 'Clamp: Get out of front',
  },
  {
    regex: /Alte Roite readies Downburst/,
    infoText: 'Downburst: Knockback',
  },
  {
    condition: function() { return false },
    regex: /Alte Roite readies Roar/,
    infoText: 'Roar: AOE damage',
  },
  {
    condition: function() { return false },
    regex: /Alte Roite readies Charybdis/,
    infoText: 'Charybdis: AOE damage',
  },
];

// O2S - Deltascape 2.0 Savage
kAurasTriggers['Unknown Zone \\(2B8\\)'] = [
 // 2nd Maniacal Probe => South
  {
    regex: /You gain the effect of .{0,4}Levitation/,
    run: function(data) { data.levitating = true; },
  },
  {
    regex: /You lose the effect of .{0,4}Levitation/,
    run: function(data) { data.levitating = false; },
  },
  {
    regex: /Catastrophe readies -100 Gs/,
    infoText: '-100Gs: Go north/south and look away',
  },
  {
    regex: /Catastrophe readies Death's Gaze/,
    alarmText: 'Death\'s Gaze: Look away',
  },
  {
    regex: /Catastrophe readies Earthquake/,
    alertText: 'Earthquake: Levitate',
  },
  {
    regex: /Catastrophe readies Maniacal Probe/,
    infoText: function(data) {
      if (data.probeCount == 0 || data.probeCount == 2)
        return 'Maniacal Probe: Healers';
    },
    alertText: function(data) {
      if (data.probeCount == 1 || data.probeCount == 3)
        return 'Maniacal Probe: DPS';
    },
    run: function(data) { data.probeCount = (data.probeCount || 0) + 1; },
  },
  {
    regex: /Catastrophe readies Maniacal Probe/,
    condition: function(data) { data.probeCount == 1 || data.probeCount == 2; }
  },
  /*
  {
    regex: /Catastrophe readies Earthquake/,
    delaySeconds: 2,
    alertText: 'Levitate',
    //condition: function(data) { return !data.levitating; },
  },
  */
  {
    regex: /You suffer the effect of 6 Fulms Under/,
    alertText: '6 Fulms Under: Levitate',
  },
  /*
  {
    regex: /You suffer the effect of 6 Fulms Under/,
    delaySeconds: 2,
    alertText: 'Levitate',
    //condition: function(data) { return !data.levitating; },
  },
  */
  {
    regex: /suffers? the effect of Elevated/,
    alertText: 'Elevated: DPS up, Tanks/Healers down',
  },
  {
    condition: function() { return false; },
    regex: /Catastrophe readies Gravitational Wave/,
    infoText: 'Gravitational Wave: AOE damage',
  },
  {
    regex: /You suffer the effect of Unstable Gravity/,
    infoText: 'Unstable Gravity',
  },
  {
    regex: /You suffer the effect of Unstable Gravity/,
    delaySeconds: 9,
    alertText: 'Elevate and outside stack',
  },
];

// O3S - Deltascape 3.0 Savage
kAurasTriggers['Unknown Zone \\(2B9\\)'] = [
  {
    regex: /([A-Za-z ']+) gains the effect of (Unknown_510|Right Face)/,
    infoText: 'Mindjack: Right',
    condition: function(data, matches) { return matches[1] == kAurasTriggersMe; },
  },
  {
    regex: /([A-Za-z ']+) gains the effect of (Unknown_50D|Forward March)/,
    infoText: 'Mindjack: Forward',
    condition: function(data, matches) { return matches[1] == kAurasTriggersMe; },
  },
  {
    regex: /([A-Za-z ']+) gains the effect of (Unknown_50F|Left Face)/,
    infoText: 'Mindjack: Left',
    condition: function(data, matches) { return matches[1] == kAurasTriggersMe; },
  },
  {
    regex: /([A-Za-z ']+) gains the effect of (Unknown_50E|About Face)/,
    infoText: 'Mindjack: Back',
    condition: function(data, matches) { return matches[1] == kAurasTriggersMe; },
  },
  {
    regex: /Halicarnassus readies Ribbit/,
    alertText: 'Ribbit: Get behind',
  },
  {
    regex: /Halicarnassus readies Oink/,
    infoText: 'Oink: Stack',
  },
  {
    regex: /Halicarnassus readies Squelch/,
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
  { // Decisive Battle means next elemental cast is scary.
    regex: /:Exdeath uses The Decisive Battle\./,
    run: function(data) { data.postDecisive = true; },
  },
  { // Fire III after Decisive Battle.
    regex: /:Exdeath begins casting Fire III\./,
    infoText: function(data) { if (!data.postDecisive) return 'Fire' },
    alarmText: function(data) { if (data.postDecisive) return 'Stop' },
    //sound: '../../sounds/PowerAuras/Gasp.ogg',
    run: function(data) { data.postDecisive = false; },
  },
  { // Blizzard III after Decisive Battle.
    regex: /:Exdeath begins casting Blizzard III\./,
    infoText: function(data) { if (!data.postDecisive) return 'Blizzard' },
    alertText: function(data) { if (data.postDecisive) return 'Keep moving' },
    run: function(data) { data.postDecisive = false; },
  },
  { // Thunder III after Decisive Battle.
    regex: /:Exdeath begins casting Thunder III\./,
    infoText: function(data) {
      if (!data.postDecisive && data.thunderCount != 2) return 'Thunder';
    },
    alertText: function(data) {
      if (data.postDecisive) return 'Get Out';
      else if (data.thunderCount == 2) return 'Thunder: Addle';
    },
    //sound: '../../sounds/PowerAuras/ESPARK1.ogg',
    run: function(data) { data.postDecisive = false; data.thunderCount = (data.thunderCount || 0) + 1; },
  },
  /*
  { // Flare.
    regex: /:Exdeath:2401:[A-Za-z0-9_ ']+:[0-9A-Fa-f]+:([A-Za-z0-9_ ']+):/,
    infoText: function(data) {
      //return "Flare on " + data.flareTargets[0] + ", " + data.flareTargets[1] + ", " + data.flareTargets[2]
    },
    alarmText: function(data) {
      if (data.flareTargets.indexOf(kAurasTriggersMe) >= 0)
        return "Flare on you";
    },
    condition: function(data, matches) {
      data.flareTargets = data.flareTargets || [];
      data.flareTargets.push(matches[1]);
      return data.flareTargets.length == 3;
    },
    run: function(data) {
      delete data.flareTargets;
    }
  },
  */

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
    regex: /:Neo Exdeath readies Double Attack\./,
    alertText: 'Double Attack: Get out',
  },
  { // Grand Cross Alpha.
    regex: /:242B:Neo Exdeath starts using/,
    infoText: 'Grand Cross Alpha: Go to middle',
    run: function(data) { data.alpha = true; data.delta = false; data.omega = false; },
  },
  { // Grand Cross Alpha finished cast - Use Apoc.
    regex: ':Neo Exdeath uses Grand Cross Alpha\.',
    alertText: 'Apocatastasis on tank',
    condition: function(data) {
      data.alphaCount = (data.alphaCount || 0) + 1;
      return data.alphaCount == 1 || data.alphaCount == 3;
    },
  },
  { // Grand Cross Omega finished cast - Use Apoc.
    regex: ':Neo Exdeath readies The Final Battle\.',
    alertText: 'Apocatastasis on healer',
  },
  { // Grand Cross Delta.
    regex: /:242C:Neo Exdeath starts using/,
    infoText: 'Grand Cross Delta:  Inside boss',
    run: function(data) { data.alpha = false; data.delta = true; data.omega = false; },
  },
  { // Grand Cross Omega.
    regex: /:242D:Neo Exdeath starts using/,
    infoText: 'Grand Cross Omega: Go to middle',
    run: function(data) { data.alpha = false; data.delta = false; data.omega = true; },
  },
  { // Forked Lightning - Get out.
    regex: /You suffer the effect of Forked Lightning/,
    delaySeconds: 1,
    alertText: 'Forked Lightning: Get out',
  },
  { // Acceleration Bomb (Alpha).
    regex: /You suffer the effect of .*Acceleration Bomb/,
    alarmText: 'Stop',
    delaySeconds: 10,
    condition: function(data) { return data.alpha; },
  },
  { // Acceleration Bomb (Delta).
    regex: /You suffer the effect of .*Acceleration Bomb/,
    delaySeconds: 5,
    alarmText: 'Stop',
    condition: function(data) { return data.delta; },
  },
  { // Acceleration Bomb (Omega).
    regex: /You suffer the effect of .*Acceleration Bomb/,
    delaySeconds: 26,
    alarmText: 'Stop',
    condition: function(data) { return data.omega; },
  },
  { // Beyond Death (Delta)
    regex: /You suffer the effect of .*Beyond Death/,
    delaySeconds: 7,
    alarmText: 'Beyond Death: Die',
    sound: '../sounds/Overwatch/Reaper_-_Die_die_die.ogg',
    condition: function(data) { return data.delta; },
  },
  { // Beyond Death (Omega)
    regex: /You suffer the effect of .*Beyond Death/,
    delaySeconds: 20,
    alarmText: 'Beyond Death: Die',
    sound: '../sounds/Overwatch/Reaper_-_Die_die_die.ogg',
    condition: function(data) { return data.omega; },
  },
  { // Almagest
    regex: /Exdeath readies Almagest/,
    alertText: 'Almagest',
    run: function(data) { data.almagestCount = (data.almagestCount || 0) + 1; },
  },
  { // Delta Attack
    regex: /Exdeath readies Delta Attack/,
    infoText: 'Delta Attack: Stack',
  },
  { // Vacuum Wave warning
    regex: /Exdeath readies Almagest/,
    delaySeconds: 25,
    infoText: 'Vacuum Wave soon',
    condition: function(data) { return data.almagestCount == 2 || data.almagestCount == 5; },
  },
  { // Vacuum Wave warning
    regex: /Exdeath readies Almagest/,
    delaySeconds: 5,
    infoText: 'Vacuum Wave soon',
    condition: function(data) { return data.almagestCount == 3 || data.almagestCount == 6; },
  },
  { // Final phase Addle warning when Reprisal is ending.
    regex: /gains the effect of Reprisal from .*? for ([0-9.]+) Seconds/,
    durationPosition: 1,
    infoText: 'Reprisal active',
    condition: function(data) { return data.alphaCount == 3 && !data.reprisal; },
    run: function(data) { data.reprisal = true; },
  },
  { // Final phase Addle warning when Reprisal is ending.
    regex: /loses the effect of Reprisal from/,
    alertText: 'Reprisal ended',
    //sound: '../../sounds/PowerAuras/throwknife.ogg',
    condition: function(data) { return data.alphaCount == 3 && data.reprisal; },
    run: function(data) { data.reprisal = false; },
  },
  /*
  { // Flare.
    regex: /:Neo Exdeath:2401:[A-Za-z0-9_ ']+:[0-9A-Fa-f]+:([A-Za-z0-9_ ']+):/,
    infoText: function(data) {
      //return "Flare on " + data.flareTargets[0] + ", " + data.flareTargets[1] + ", " + data.flareTargets[2]
    },
    alarmText: function(data) {
      if (data.flareTargets.indexOf(kAurasTriggersMe) >= 0)
        return "Flare on you";
    },
    condition: function(data, matches) {
      data.flareTargets = data.flareTargets || [];
      data.flareTargets.push(matches[1]);
      return data.flareTargets.length == 3;
    },
    run: function(data) {
      delete data.flareTargets;
    }
  },
  */
];
