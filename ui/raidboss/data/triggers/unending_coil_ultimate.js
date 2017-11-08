// UCU - The Unending Coil Of Bahamut (Ultimate)
[{
  // TODO: Zone name is empty string for now lol?
  zoneRegex: /The Unending Coil Of Bahamut \(Ultimate\)/,
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
      tts: 'twisters',
    },
    { id: 'UCU Death Sentence',
      regex: /:Twintania readies Death Sentence/,
      alertText: function(data, matches) {
        if (data.role == 'tank' || data.role == 'healer')
          return 'Death Sentence';
      },
      tts: function(data, matches) {
        if (data.role == 'tank' || data.role == 'healer')
          return 'buster';
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
      tts: function(data, matches) {
        if (data.me == matches[1])
          return 'hatch';
      },
    },
    { id: 'UCU Twintania P2',
      regex: /:Twintania HP at 75%/,
      sound: 'Long',
      infoText: function(data, matches) {
        return 'Phase 2 Push';
      },
    },
    { id: 'UCU Twintania P3',
      regex: /:Twintania HP at 45%/,
      sound: 'Long',
      infoText: function(data, matches) {
        return 'Phase 3 Push';
      },
    },

    // --- Nael ---
    { id: 'UCU Nael Quote 1',
      regex: /From on high I descend, in blessed light to bask/,
      infoText: function(data) { return 'spread => in'; },
      tts: 'spread then in',
    },
    { id: 'UCU Nael Quote 2',
      regex: /From on high I descend, mine enemies to smite/,
      infoText: function(data) { return 'spread => out'; },
      tts: 'spread then out',
    },
    { id: 'UCU Nael Quote 3',
      regex: /O refulgent moon, shine down your light/,
      infoText: function(data) { return 'stack => in'; },
      tts: 'stack then in',
    },
    { id: 'UCU Nael Quote 4',
      regex: /Blazing path, lead me to conquest/,
      infoText: function(data) { return 'stack => out'; },
      tts: 'stack then out',
    },
    { id: 'UCU Nael Quote 5',
      regex: /O red moon, scorch mine enemies/,
      infoText: function(data) { return 'in => stack'; },
      tts: 'in then stack',
    },
    { id: 'UCU Nael Quote 6',
      regex: /O red moon, shine the path to conquest/,
      infoText: function(data) { return 'in => out'; },
      tts: 'in then out',
    },
    { id: 'UCU Nael Quote 7',
      regex: /Fleeting light, score the earth with a fiery kiss/,
      infoText: function(data) { return 'away from MT => stack'; },
      tts: 'away from tank then stack',
    },
    { id: 'UCU Nael Quote 8',
      regex: /Fleeting light, outshine the starts for the moon/,
      infoText: function(data) { return 'spread => away from MT'; },
      tts: 'spread then away from tank',
    },
    { id: 'UCU Nael Quote 9',
      regex: /From on high I descend, a hail of stars to bring/,
      infoText: function(data) { return 'spread => in => spread'; },
      tts: 'spread then in then spread',
    },
    { id: 'UCU Nael Quote 10',
      regex: /From red moon I descend, a hail of stars to bring/,
      infoText: function(data) { return 'in => spread => spread'; },
      tts: 'in then spread then spread',
    },
    { id: 'UCU Nael Quote 11',
      regex: /From red moon I draw steel, in my descent to bare/,
      infoText: function(data) { return 'in => out => stack'; },
      tts: 'in then out then stack',
    },
    { id: 'UCU Nael Quote 12',
      regex: /From red moon I descend, upon burning earth to tread/,
      infoText: function(data) { return 'in => spread => stack'; },
      tts: 'in then spread then stack',
    },
    { id: 'UCU Nael Quote 13',
      regex: /Gleaming steel, take fire and descend/,
      infoText: function(data) { return 'out => stack => spread'; },
      tts: 'out then stack then spread',
    },
    { id: 'UCU Nael Quote 14',
      regex: /Gleaming steel, plunge and take fiery edge/,
      infoText: function(data) { return 'out => spread => stack'; },
      tts: 'out then spread then stack',
    },
    { id: 'UCU Nael Thunderstruck',
      // Note: The 0A event happens before 'gains the effect' and 'starts
      // casting on' only includes one person.
      regex: /:Thunderwing:26C7:.*?:........:(\y{Name}):/,
      condition: function(data, matches) { return data.me == matches[1]; },
      alarmText: function(data) { return 'Thunder on YOU'; },
      tts: 'thunder',
    },
    { id: 'UCU Nael Doom',
      regex: /:(\y{Name}) gains the effect of Doom from .*? for ([0-9.]+) Seconds/,
      condition: function(data, matches) { return data.me == matches[1]; },
      alarmText: function(data, matches) {
        if (parseFloat(matches[2]) < 9)
          return 'Doom #1 on YOU';
        if (parseFloat(matches[2]) < 14)
          return 'Doom #2 on YOU';
        return 'Doom #3 on YOU';

        // TODO: call out all doom people
        // TODO: reminder to clear at the right time
      },
      tts: function(data, matches) {
        if (parseFloat(matches[2]) < 9)
          return '1';
        if (parseFloat(matches[2]) < 14)
          return '2';
        return '3';
      },
    },
    { id: 'UCU Nael Fireball 1',
      regex: /:Ragnarok:26B8:/,
      delaySeconds: 35,
      infoText: function(data) {
        if (data.fireball1)
          return;
        return 'fire in';
      },
      tts: function(data) {
        if (data.fireball1)
          return;
        return 'fire in';
      },
      run: function(data) { data.fireball1 = true; },
    },
    { id: 'UCU Nael Fireball 2',
      regex: /:Ragnarok:26B8:/,
      delaySeconds: 51,
      infoText: function(data) {
        if (data.fireball2)
          return;
        if (!data.iceDebuff)
          return 'fire out';
      },
      alarmText: function(data) {
        // All players should be neutral by the time fire #2 happens.
        // If you have ice at this point, it means you missed the first
        // stack.  Therefore, make sure you stack.  It's possible you
        // can survive until fire 3 happens, but it's not 100%.
        // See: https://www.reddit.com/r/ffxiv/comments/78mdwd/bahamut_ultimate_mechanics_twin_and_nael_minutia/
        if (data.fireball2)
          return;
        if (data.iceDebuff)
          return 'Fire out: Be in it';
      },
      tts: function(data) {
        if (data.fireball2)
          return;
        if (data.iceDebuff)
          return 'fire out; go with';
        return 'fire out'
      },
      run: function(data) { data.fireball2 = true; },
    },
    { id: 'UCU Nael Fireball 3',
      regex: /:Ragnarok:26B8:/,
      delaySeconds: 77,
      infoText: function(data) {
        if (data.fireball3)
          return;
        if (!data.fireDebuff)
          return 'fire in';
      },
      alarmText: function(data) {
        if (data.fireball3)
          return;
        // If you were the person with fire tether #2, then you could
        // have fire debuff here and need to no stack.
        if (data.fireDebuff)
          return 'Fire in: AVOID!';
      },
      tts: function(data) {
        if (data.fireball3)
          return;
        if (data.fireDebuff)
          return 'avoid fire in';
        return 'fire in'
      },
      run: function(data) { data.fireball3 = true; },
    },
    { id: 'UCU Nael Fireball 4',
      regex: /:Ragnarok:26B8:/,
      delaySeconds: 98,
      infoText: function(data) {
        if (data.fireball4)
          return;
        if (!data.fireDebuff)
          return 'fire in';
      },
      alarmText: function(data) {
        if (data.fireball4)
          return;
        // Not sure this is possible.
        if (data.fireDebuff)
          return 'Fire in: AVOID!';
      },
      tts: function(data) {
        if (data.fireball4)
          return;
        if (data.fireDebuff)
          return 'avoid fire in';
        return 'fire in';
      },
      run: function(data) { data.fireball4 = true; },
    },
    { id: 'UCU Nael Dragon Placement',
      regex: /:(Iceclaw:26C6|Thunderwing:26C7|Fang of Light:26CA|Tail of Darkness:26C9|Firehorn:26C5):.*:([-0-9.E]+):([-0-9.E]+):[-0-9.E]+:$/,
      condition: function(data, matches) { return !data.seenDragon || !(matches[1] in data.seenDragon); },
      run: function(data, matches) {
        data.seenDragon = data.seenDragon || [];
        data.seenDragon[matches[1]] = true;

        var x = parseFloat(matches[2]);
        var y = parseFloat(matches[3]);
        // Positions are the 8 cardinals + numerical slop on a radius=24 circle.
        // N = (0, -24), E = (24, 0), S = (0, 24), W = (-24, 0)
        // Map N = 0, NE = 1, ..., NW = 7
        var dir = Math.round(4 - 4 * Math.atan2(x, y) / Math.PI);

        // TODO: do more than temp logging
        console.log('Dragon: ' + matches[1] + ': ' + matches[2] + ', ' + matches[3] + ': ' + dir);
      },
    },

    // TODO: fire callouts if you have tether? Is there a 1B marker?
    // TODO: cauterize markers
    // TODO: cauterize placement from dragons
  ]
}]
