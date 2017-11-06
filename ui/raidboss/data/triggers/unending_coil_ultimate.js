// UCU - The Unending Coil Of Bahamut (Ultimate)
[{
  // TODO: Zone name is empty string for now lol?
  zoneRegex: /(The Unending Coil Of Bahamut \(Ultimate\)|^$)/,
  triggers: [
    // --- State ---
    {
      regex: /:(\y{Name}) gains the effect of Firescorched/,
      condition: function(data, matches) { return data.me == matches[1]; },
      run: function(data) { data.fireDebuff = true; },
    },
    {
      regex: /:(\y{Name}) loses the effect of Firescorched/,
      condition: function(data, matches) { return data.me == matches[1]; },
      run: function(data) { data.fireDebuff = false; },
    },
    {
      regex: /:(\y{Name}) gains the effect of Icebitten/,
      condition: function(data, matches) { return data.me == matches[1]; },
      run: function(data) { data.iceDebuff = true; },
    },
    {
      regex: /:(\y{Name}) loses the effect of Icebitten/,
      condition: function(data, matches) { return data.me == matches[1]; },
      run: function(data) { data.iceDebuff = false; },
    },

    // --- Twintania ---
    { id: 'UCU Twisters',
      regex: /:26AA:Twintania starts using/,
      alertText: function(data) {
        return 'Twisters';
      },
    },
    { id: 'UCU Death Sentence',
      regex: /:Twintania readies Death Sentence/,
      alertText: function(data, matches) {
        if (data.role == 'tank' || data.role == 'healer')
          return 'Death Sentence';
      },
    },
    { id: 'UCU Hatch Marker',
      regex: /1B:........:(\y{Name}):....:....:0076:0000:0000:0000:/,
      infoText: function(data, matches) {
        if (data.me != matches[1])
          return 'hatch on ' + matches[1];
      },
      alarmText: function(data, matches) {
        if (data.me == matches[1])
          return 'hatch on YOU';
      },
    },
    { id: 'UCU Twintania P2',
      regex: /:Twintania HP at 75%/,
      sound: 'Long',
      infoText: function(data, matches) {
        return "Phase 2 Push";
      },
    },
    { id: 'UCU Twintania P3',
      regex: /:Twintania HP at 45%/,
      sound: 'Long',
      infoText: function(data, matches) {
        return "Phase 3 Push";
      },
    },

    // --- Nael ---
    { id: 'UCU Nael Quote 1',
      regex: /From on high I descend, in blessed light to bask/,
      alertText: function(data) { return "spread => in"; },
    },
    { id: 'UCU Nael Quote 2',
      regex: /From on high I descend, mine enemies to smite/,
      alertText: function(data) { return "spread => out"; },
    },
    { id: 'UCU Nael Quote 3',
      regex: /refulgent moon, shine down your light/,
      alertText: function(data) { return "stack => in"; },
    },
    { id: 'UCU Nael Quote 4',
      regex: /Blazing path, lead me to conquest/,
      alertText: function(data) { return "stack => out"; },
    },
    { id: 'UCU Nael Quote 5',
      regex: /red moon, scorch mine enemies/,
      alertText: function(data) { return "in => stack"; },
    },
    { id: 'UCU Nael Quote 6',
      regex: /red moon, shine the path to conquest/,
      alertText: function(data) { return "in => out"; },
    },
    { id: 'UCU Nael Quote 7',
      regex: /Fleeting light, score the earth with a fiery kiss/,
      alertText: function(data) { return "away from MT => stack"; },
    },
    { id: 'UCU Nael Quote 8',
      regex: /Fleeting light, outshine the starts for the moon/,
      alertText: function(data) { return "spread => away from MT"; },
    },
    { id: 'UCU Nael Thunderstruck',
      // Note: The 0A event happens before "gains the effect" and "starts
      // casting on" only includes one person.
      regex: /:Thunderwing:26C7:.*?:........:(\y{Name}):/,
      condition: function(data, matches) { return data.me == matches[1]; },
      alarmText: function(data) { return "Thunder on YOU"; },
    },
    { id: 'UCU Nael Doom',
      regex: /:(\y{Name}) gains the effect of Doom from .*? for ([0-9.]+) Seconds/,
      condition: function(data, matches) { return data.me == matches[1]; },
      alarmText: function(data) {
        if (parseFloat(matches[2]) < 9)
          return "Doom #1 on YOU";
        if (parseFloat(matches[2]) < 14)
          return "Doom #2 on YOU";
        return "Doom #3 on YOU";
        //return "Doom: " + parseFloat(matches[2]) + " seconds on you";

        // TODO: call out all doom people
        // TODO: reminder to clear at the right time
      },
    },
    { id: 'UCU Nael Fireball 1',
      regex: /:Ragnarok:26B8:/,
      delaySeconds: 35,
      condition: function(data) { return !data.fireball1; },
      run: function(data) { data.fireball1 = true; },
      infoText: function(data) {
        if (data.iceDebuff)
          return "fire in (stack!)";
        return "fire in";
      },
    },
    { id: 'UCU Nael Fireball 2',
      regex: /:Ragnarok:26B8:/,
      delaySeconds: 51,
      condition: function(data) { return !data.fireball2; },
      run: function(data) { data.fireball2 = true; },
      infoText: function(data) {
        data.fireball2 = true;
        if (data.fireDebuff)
          return "fire out; you in";
        if (!data.iceDebuff)
          return "fire out";
      },
      alarmText: function(data) {
        // All players should be neutral by the time fire #2 happens.
        // If you have ice at this point, it means you missed the first
        // stack.  Therefore, make sure you stack.  It's possible you
        // can survive until fire 3 happens, but it's not 100%.
        // See: https://www.reddit.com/r/ffxiv/comments/78mdwd/bahamut_ultimate_mechanics_twin_and_nael_minutia/
        if (data.iceDebuff)
          return "fire out (stack!)";
      },
    },
    { id: 'UCU Nael Fireball 3',
      regex: /:Ragnarok:26B8:/,
      delaySeconds: 77,
      condition: function(data) { return !data.fireball3; },
      run: function(data) { data.fireball3 = true; },
      infoText: function(data) {
        if (data.iceDebuff)
          return "fire in (stack!)";
        if (!data.fireDebuff)
          return "fire in";
      },
      alarmText: function(data) {
        // If you were the person with fire tether #2, then you could
        // have fire debuff here and need to no stack.
        if (data.fireDebuff)
          return "fire in; YOU OUT!";
      },
    },
    { id: 'UCU Nael Fireball 4',
      regex: /:Ragnarok:26B8:/,
      condition: function(data) { return !data.fireball4; },
      run: function(data) { data.fireball4 = true; },
      delaySeconds: 98,
      infoText: function(data) {
        if (data.iceDebuff)
          return "fire in (stack!)";
        if (!data.fireDebuff)
          return "fire in";
      },
      alarmText: function(data) {
        // Not sure this is possible.
        if (data.fireDebuff)
          return "fire in; YOU OUT!";
      },
    },
    { id: 'UCU Nael Dragon Placement',
      regex: /(Iceclaw:26C6|Thunderwing:26C7|Fang of Light:26CA|Tail of Darkness:26C9|Firehorn:26C5):.*:(-?[0-9.]+):(-?[0-9.]+):-?[0-9.]+:$/,
      condition: function(data, matches) { return !(matches[1] in data.seenDragon); },
      run: function(data, matches) {
        data.seenDragon[matches[1]] = true;

        var x = parseFloat(matches[2]);
        var y = parseFloat(matches[3]);
        // Positions are the 8 cardinals + numerical slop on a radius=24 circle.
        // N = (0, -24), E = (24, 0), S = (0, 24), W = (-24, 0)
        // Map N = 0, NE = 1, ..., NW = 7
        var dir = Math.round(4 - 4 * Math.atan2(x, y) / Math.PI);

        // TODO: do more than temp logging
        console.log('Dragon: ' + matches[1] + ": " + matches[2] + ", " + matches[3] + ": " + dir);
      },
    },

    // TODO: fire callouts if you have tether? Is there a 1B marker?
    // TODO: cauterize markers
    // TODO: cauterize placement from dragons
  ]
}]
