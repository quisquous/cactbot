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
    infoText: function(data) { if (!data.postDecisive) return 'Thunder' },
    alertText: function(data) { if (data.postDecisive) return 'Get Out' },
    //sound: '../../sounds/PowerAuras/ESPARK1.ogg',
    run: function(data) { data.postDecisive = false; },
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
    alertText: 'Outside',
  },
  { // Outer Flood (move in).
    regex: /:240F:Neo Exdeath starts using/,
    alertText: 'Inside',
  },
  { // Purple/Blue Flood.
    regex: /:2411:Neo Exdeath starts using/,
    alertText: 'Colors',
  },
  { // Blue/Purple Flood.
    regex: /:2412:Neo Exdeath starts using/,
    alertText: 'Colors',
  },
  { // Charge Flood.
    regex: /:2416:Neo Exdeath starts using/,
    infoText: 'Charge',
  },
  {  // Double attack.
    regex: /:Neo Exdeath readies Double Attack\./,
    alertText: 'Double Attack: Get out',
  },
  { // Grand Cross Alpha.
    regex: /:242B:Neo Exdeath starts using/,
    infoText: 'Alpha:  Go to middle',
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
    infoText: 'Delta:  Inside boss',
    run: function(data) { data.alpha = false; data.delta = true; data.omega = false; },
  },
  { // Grand Cross Omega.
    regex: /:242D:Neo Exdeath starts using/,
    infoText: 'Omega:  Go to middle',
    run: function(data) { data.alpha = false; data.delta = false; data.omega = true; },
  },
  { // Forked Lightning - Get out.
    regex: /You suffer the effect of Forked Lightning/,
    delaySeconds: 1,
    alertText: 'Get out',
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
    alarmText: 'Die',
    sound: '../sounds/Overwatch/Reaper_-_Die_die_die.ogg',
    condition: function(data) { return data.delta; },
  },
  { // Beyond Death (Omega)
    regex: /You suffer the effect of .*Beyond Death/,
    delaySeconds: 20,
    alarmText: 'Die',
    sound: '../sounds/Overwatch/Reaper_-_Die_die_die.ogg',
    condition: function(data) { return data.omega; },
  },
  { // Almagest
    regex: /Exdeath readies Almagest/,
    alertText: 'Almagest',
    //sound: '../../sounds/PowerAuras/throwknife.ogg',
    run: function(data) { data.almagestCount = (data.almagestCount || 0) + 1; },
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
    condition: function(data) { return data.almagestCount == 6 && data.reprisal; },
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
