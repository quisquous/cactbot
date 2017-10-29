// UCU - The Unending Coil Of Bahamut (Ultimate)
[{
  // TODO: Zone name is empty string for now lol?
  zoneRegex: /(The Unending Coil Of Bahamut \(Ultimate\)|^$)/,
  triggers: [
    // --- State ---
    {
      regex: /:(y{Name}) gains the effect of Firescorched/,
      condition: function(data, matches) { return data.me == matches[1]; },
      run: function(data) { data.fireDebuff = true; },
    },
    {
      regex: /:(y{Name}) loses the effect of Firescorched/,
      condition: function(data, matches) { return data.me == matches[1]; },
      run: function(data) { data.fireDebuff = false; },
    },
    {
      regex: /:(y{Name}) gains the effect of Icebitten/,
      condition: function(data, matches) { return data.me == matches[1]; },
      run: function(data) { data.iceDebuff = true; },
    },
    {
      regex: /:(y{Name}) loses the effect of Icebitten/,
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
    { id: 'UCU Fireball Marker',
      regex: /1B:........:(\y{Name}):....:....:0075:0000:0000:0000:/,
      infoText: function(data, matches) {
        if (data.me != matches[1])
          return 'fireball on ' + matches[1];
      },
      alertText: function(data, matches) {
        if (data.me == matches[1])
          return 'fireball on YOU';
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
      regex: /:Twintania HP at 74%/,
      sound: 'Long',
      infoText: function(data, matches) {
        return "Phase 2 Push";
      },
    },
    { id: 'UCU Twintania P3',
      regex: /:Twintania HP at 44%/,
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
        if (parseFloat(matches[2]) == 6)
          return "Doom #1 on YOU";
        if (parseFloat(matches[2]) == 11)
          return "Doom #2 on YOU";
        if (parseFloat(matches[2]) == 16)
          return "Doom #3 on YOU";
        // TODO: remove this catchall once times are better known.
        return "Doom: " + parseFloat(matches[2]) + " seconds on you";

        // TODO: call out all doom people
        // TODO: reminder to clear at the right time
      },
    },

    // TODO: fire callouts
    //   (1) if you have tether (is there a 1B mark??)< whether in or out
    //   (2) if you have fire (to stay out), if you have ice (to get in)
    // TODO: cauterize markers
    // TODO: cauterize placement from dragons
  ]
}]
