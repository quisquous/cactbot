// UCU - The Unending Coil Of Bahamut (Ultimate)
[{
  zoneRegex: /The Unending Coil Of Bahamut \(Ultimate\)/,
  timelineFile: 'unending_coil_ultimate.txt',
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
    {
      regex: /:Bahamut Prime starts using Quickmarch Trio/,
      run: function(data) { data.resetTrio('quickmarch'); },
    },
    {
      regex: /:Bahamut Prime starts using Blackfire Trio/,
      run: function(data) { data.resetTrio('blackfire'); },
    },
    {
      regex: /:Bahamut Prime starts using Fellruin Trio/,
      run: function(data) { data.resetTrio('fellruin'); },
    },
    {
      regex: /:Bahamut Prime starts using Heavensfall Trio/,
      run: function(data) { data.resetTrio('heavensfall'); },
    },
    {
      regex: /:Bahamut Prime starts using Tenstrike Trio/,
      run: function(data) { data.resetTrio('tenstrike'); },
    },
    {
      regex: /:Bahamut Prime starts using Grand Octet/,
      run: function(data) { data.resetTrio('octet'); },
    },

    // --- Twintania ---
    { id: 'UCU Twisters',
      regex: /:26AA:Twintania starts using/,
      alertText: 'Twisters',
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
          return 'Hatch on ' + matches[1];
      },
      alarmText: function(data, matches) {
        if (data.me == matches[1])
          return 'Hatch on YOU';
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
      infoText: function(data) { return 'Spread => In'; },
      durationSeconds: 6,
      tts: 'spread then in',
    },
    { id: 'UCU Nael Quote 2',
      regex: /From on high I descend, mine enemies to smite/,
      infoText: function(data) { return 'Spread => Out'; },
      durationSeconds: 6,
      tts: 'spread then out',
    },
    { id: 'UCU Nael Quote 3',
      regex: /O refulgent moon, shine down your light/,
      infoText: function(data) { return 'Stack => In'; },
      durationSeconds: 6,
      tts: 'stack then in',
    },
    { id: 'UCU Nael Quote 4',
      regex: /Blazing path, lead me to conquest/,
      infoText: function(data) { return 'Stack => Out'; },
      durationSeconds: 6,
      tts: 'stack then out',
    },
    { id: 'UCU Nael Quote 5',
      regex: /O red moon, scorch mine enemies/,
      infoText: function(data) { return 'In => Stack'; },
      durationSeconds: 6,
      tts: 'in then stack',
    },
    { id: 'UCU Nael Quote 6',
      regex: /O red moon, shine the path to conquest/,
      infoText: function(data) { return 'In => Out'; },
      durationSeconds: 6,
      tts: 'in then out',
    },
    { id: 'UCU Nael Quote 7',
      regex: /Fleeting light, score the earth with a fiery kiss/,
      infoText: function(data) { return 'Away from Tank => Stack'; },
      durationSeconds: 6,
      delaySeconds: 4,
      tts: 'away from tank then stack',
    },
    { id: 'UCU Nael Quote 8',
      regex: /Fleeting light, outshine the stars for the moon/,
      infoText: function(data) { return 'Spread => Away from Tank'; },
      durationSeconds: 6,
      delaySeconds: 4,
      tts: 'spread then away from tank',
    },
    { id: 'UCU Nael Quote 9',
      regex: /From on high I descend, a hail of stars to bring/,
      durationSeconds: 9,
      infoText: function(data) { return 'Spread => In => Spread'; },
      tts: 'spread then in then spread',
    },
    { id: 'UCU Nael Quote 10',
      regex: /From red moon I descend, a hail of stars to bring/,
      durationSeconds: 9,
      infoText: function(data) { return 'In => Spread => Spread'; },
      tts: 'in then spread then spread',
    },
    { id: 'UCU Nael Quote 11',
      regex: /From red moon I draw steel, in my descent to bare/,
      durationSeconds: 9,
      infoText: function(data) { return 'In => Out => Stack'; },
      tts: 'in then out then stack',
    },
    { id: 'UCU Nael Quote 12',
      regex: /From red moon I descend, upon burning earth to tread/,
      durationSeconds: 9,
      infoText: function(data) { return 'In => Spread => Stack'; },
      tts: 'in then spread then stack',
    },
    { id: 'UCU Nael Quote 13',
      regex: /Gleaming steel, take fire and descend/,
      durationSeconds: 9,
      infoText: function(data) { return 'Out => Stack => Spread'; },
      tts: 'out then stack then spread',
    },
    { id: 'UCU Nael Quote 14',
      regex: /Gleaming steel, plunge and take fiery edge/,
      durationSeconds: 9,
      infoText: function(data) { return 'Out => Spread => Stack'; },
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
    { id: 'UCU Nael Your Doom',
      regex: /:(\y{Name}) gains the effect of Doom from .*? for (\y{Float}) Seconds/,
      condition: function(data, matches) { return data.me == matches[1]; },
      durationSeconds: function(data, matches) {
        if (data.ParseLocaleFloat(matches[2]) < 9)
          return 3;
        if (data.ParseLocaleFloat(matches[2]) < 14)
          return 6;
        return 9;
      },
      alarmText: function(data, matches) {
        if (data.ParseLocaleFloat(matches[2]) < 9)
          return 'Doom #1 on YOU';
        if (data.ParseLocaleFloat(matches[2]) < 14)
          return 'Doom #2 on YOU';
        return 'Doom #3 on YOU';
      },
      tts: function(data, matches) {
        if (data.ParseLocaleFloat(matches[2]) < 9)
          return '1';
        if (data.ParseLocaleFloat(matches[2]) < 14)
          return '2';
        return '3';
      },
    },
    {
      // Doom tracking init.
      regex: /:(\y{Name}) gains the effect of Doom from .*? for (\y{Float}) Seconds/,
      run: function(data, matches) {
        data.dooms = data.dooms || [null, null, null];
        var order = null;
        if (data.ParseLocaleFloat(matches[2]) < 9)
          order = 0;
        else if (data.ParseLocaleFloat(matches[2]) < 14)
          order = 1;
        else
          order = 2;
        data.dooms[order] = matches[1];
      },
    },
    {
      // Doom tracking cleanup.
      regex: /gains the effect of Doom/,
      delaySeconds: 20,
      run: function(data) {
        delete data.dooms;
        delete data.doomCount;
      },
    },
    {
      id: 'UCU Nael Cleanse Callout',
      regex: /:Fang of Light:26CA:/,
      infoText: function(data) {
        data.doomCount = data.doomCount || 0;
        if (data.dooms)
          var name = data.dooms[data.doomCount];
        data.doomCount++;
        if (name)
          return 'Cleanse #' + data.doomCount + ': ' + name;
      },
    },
    { id: 'UCU Nael Fireball 1',
      regex: /:Ragnarok:26B8:/,
      delaySeconds: 35,
      infoText: function(data) {
        if (data.fireball1)
          return;
        return 'Fire IN';
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
          return 'Fire OUT';
      },
      alertText: function(data) {
        // All players should be neutral by the time fire #2 happens.
        // If you have ice at this point, it means you missed the first
        // stack.  Therefore, make sure you stack.  It's possible you
        // can survive until fire 3 happens, but it's not 100%.
        // See: https://www.reddit.com/r/ffxiv/comments/78mdwd/bahamut_ultimate_mechanics_twin_and_nael_minutia/
        if (data.fireball2)
          return;
        if (data.iceDebuff)
          return 'Fire OUT: Be in it';
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
          return 'Thunder -> Fire IN';
      },
      alertText: function(data) {
        if (data.fireball3)
          return;
        // If you were the person with fire tether #2, then you could
        // have fire debuff here and need to no stack.
        if (data.fireDebuff)
          return 'Thunder -> Fire IN: AVOID!';
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
          return 'Fire IN -> Thunder';
      },
      alertText: function(data) {
        if (data.fireball4)
          return;
        // Not sure this is possible.
        if (data.fireDebuff)
          return 'Fire IN: AVOID! -> Thunder';
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
    {
      regex: /:(Iceclaw:26C6|Thunderwing:26C7|Fang of Light:26CA|Tail of Darkness:26C9|Firehorn:26C5):.*:(\y{Float}):(\y{Float}):\y{Float}:$/,
      condition: function(data, matches) { return !data.seenDragon || !(matches[1] in data.seenDragon); },
      run: function(data, matches) {
        // seenDragon[dragon name] => boolean
        data.seenDragon = data.seenDragon || [];
        data.seenDragon[matches[1]] = true;

        var x = data.ParseLocaleFloat(matches[2]);
        var y = data.ParseLocaleFloat(matches[3]);
        // Positions are the 8 cardinals + numerical slop on a radius=24 circle.
        // N = (0, -24), E = (24, 0), S = (0, 24), W = (-24, 0)
        // Map N = 0, NE = 1, ..., NW = 7
        var dir = Math.round(4 - 4 * Math.atan2(x, y) / Math.PI) % 8;

        // naelDragons[direction 0-7 (N-NW)] => boolean
        data.naelDragons = data.naelDragons || [0,0,0,0,0,0,0,0];
        data.naelDragons[dir] = 1;

        if (Object.keys(data.seenDragon).length != 5)
          return;

        var output = data.findDragonMarks(data.naelDragons);
        data.naelMarks = output.marks;
        data.wideThirdDive = output.wideThirdDive;
        data.unsafeThirdMark = output.unsafeThirdMark;
        delete data.naelDragons;
        // In case you forget, print marks in the log.
        // TODO: Maybe only if Options.Debug?
        console.log(data.naelMarks.join(', ') + (data.wideThirdDive ? ' (WIDE)' : ''));
      },
    },
    { id: 'UCU Nael Dragon Placement',
      regex: /:Iceclaw:26C6/,
      condition: function(data) {
        return data.naelMarks && !data.calledNaelDragons;
      },
      durationSeconds: 12,
      infoText: function(data) {
        data.calledNaelDragons = true;
        return 'Marks: ' + data.naelMarks.join(', ') + (data.wideThirdDive ? ' (WIDE)' : '');
      },
    },
    { id: 'UCU Nael Dragon Dive Marker Me',
      regex: /1B:........:(\y{Name}):....:....:0014:0000:0000:0000:/,
      alarmText: function(data, matches) {
        data.naelDiveMarkerCount = data.naelDiveMarkerCount || 0;
        if (matches[1] != data.me)
          return;
        var marker = ['A', 'B', 'C'][data.naelDiveMarkerCount];
        var dir = data.naelMarks[data.naelDiveMarkerCount];
        return 'Go To ' + marker + ' (in ' + dir + ')';
      },
      tts: function(data, matches) {
        data.naelDiveMarkerCount = data.naelDiveMarkerCount || 0;
        if (matches[1] != data.me)
          return;
        return 'Go To ' + ['A', 'B', 'C'][data.naelDiveMarkerCount];
      },
    },
    { id: 'UCU Nael Dragon Dive Marker Others',
      regex: /1B:........:(\y{Name}):....:....:0014:0000:0000:0000:/,
      infoText: function(data, matches) {
        data.naelDiveMarkerCount = data.naelDiveMarkerCount || 0;
        if (matches[1] == data.me)
          return;
        var num = data.naelDiveMarkerCount + 1;
        return 'Dive #' + num + ': ' + matches[1];
      },
    },
    { id: 'UCU Nael Dragon Dive Marker Counter',
      regex: /1B:........:(\y{Name}):....:....:0014:0000:0000:0000:/,
      run: function(data) {
        data.naelDiveMarkerCount++;
      },
    },
    { id: 'UCU Twister Dives',
      regex: /:Twintania:26B2:Twisting Dive:/,
      alertText: 'Twisters',
      tts: 'twisters',
    },
    {
      id: 'UCU Megaflare Stack Me',
      regex: /1B:........:(\y{Name}):....:....:0027:0000:0000:0000:/,
      condition: function(data, matches) { return data.me == matches[1]; },
      alertText: 'Megaflare Stack',
      tts: 'stack',
    },
    { // Megaflare stack tracking
      regex: /1B:........:(\y{Name}):....:....:0027:0000:0000:0000:/,
      run: function(data, matches) {
        data.megaStack.push(matches[1]);
      },
    },
    {
      id: 'UCU Fellruin Tower',
      regex: /1B:........:(\y{Name}):....:....:0027:0000:0000:0000:/,
      alertText: function(data) {
        if (data.trio == 'fellruin' && data.megaStack.length == 4) {
          if (data.megaStack.indexOf(data.me) == -1) {
            return 'Find Your Tower';
          }
        }
      },
      tts: function(data) {
        if (data.trio == 'fellruin' && data.megaStack.length == 4) {
          if (data.megaStack.indexOf(data.me) == -1) {
            return 'tower';
          }
        }
      },
    },
    {
      id: 'UCU Earthshaker Me',
      regex: /1B:........:(\y{Name}):....:....:0028:0000:0000:0000:/,
      condition: function(data, matches) { return data.me == matches[1]; },
      alarmText: 'Earthshaker on YOU',
      tts: 'shaker',
    },
    { // Earthshaker tracking
      regex: /1B:........:(\y{Name}):....:....:0028:0000:0000:0000:/,
      run: function(data, matches) {
        data.shakers.push(matches[1]);
      },
    },
    {
      id: 'UCU Earthshaker Not Me',
      regex: /1B:........:(\y{Name}):....:....:0028:0000:0000:0000:/,
      alertText: function(data) {
        if (data.trio == 'quickmarch') {
          if (data.shakers.length != 3)
            return;
          if (data.role == 'tank')
            return 'Pick up tether';
        }
      },
      infoText: function(data) {
        if (data.trio == 'quickmarch') {
          if (data.shakers.length != 3)
            return;
          if (data.shakers.indexOf(data.me) == -1 && data.role != 'tank')
            return 'No shaker; stack south.';
        } else if (data.trio == 'tenstrike') {
          if (data.shakers.length == 4) {
            var text;
            if (data.shakers.indexOf(data.me) == -1)
              text = 'Stack on safe spot';
            return text;
          }
        }
      },
      tts: function(data) {
        if (data.trio == 'quickmarch') {
          if (data.shakers.length != 3)
            return;
          if (data.role == 'tank')
            return 'tether';
          if (data.shakers.indexOf(data.me) == -1)
            return 'stack south';
        } else if (data.trio == 'tenstrike') {
          if (data.shakers.length == 4) {
            var text;
            if (!(data.me in data.shakers))
              text = 'safe spot';
            return text;
          }
        }
      },
      run: function(data) {
        if (data.trio == 'tenstrike' && data.shakers.length == 4) {
          data.shakers = [];
        }
      },
    },
    {
      // One time setup.
      regex: /:26AA:Twintania starts using/,
      run: function(data) {
        if (data.oneTimeSetup)
          return;
        data.oneTimeSetup = true;

        data.resetTrio = function(trio) {
          this.trio = trio;
          this.shakers = [];
          this.megaStack = [];
        };

        // Begin copy and paste from dragon_test.js.
        var modDistance = function(mark, dragon) {
          var oneWay = (dragon - mark + 8) % 8;
          var otherWay = (mark - dragon + 8) % 8;
          var distance = Math.min(oneWay, otherWay);
          console.assert(distance >= 0);
          return distance;
        };

        var badSpots = function(mark, dragon) {
          // All spots between mark and dragon are bad.  If distance == 1,
          // then the dragon hits the spot behind the mark too.  e.g. N
          // mark, NE dragon will also hit NW.
          var bad = [];
          var distance = modDistance(mark, dragon);
          console.assert(distance > 0);
          console.assert(distance <= 2);
          if ((mark + distance + 8) % 8 == dragon) {
            // Clockwise.
            for (var i = 0; i <= distance; ++i)
              bad.push((mark + i) % 8);
            if (distance == 1)
              bad.push((mark - 1 + 8) % 8);
          } else {
            // Widdershins.
            for (var i = 0; i <= distance; ++i)
              bad.push((mark - i + 8) % 8);
            if (distance == 1)
              bad.push((mark + 1) % 8);
          }
          return bad;
        };

        var findDragonMarks = function(array) {
          var marks = [-1, -1, -1];
          var ret = {
            // Third drive is on a dragon three squares away and will cover
            // more of the middle than usual, e.g. SE dragon, SW dragon,
            // mark W (because S is unsafe from 2nd dive).
            wideThirdDive:  false,
            // Third mark spot is covered by the first dive so needs to be
            // patient.  Third mark should always be patient, but you never
            // know.
            unsafeThirdMark: false,
            marks: ['error', 'error', 'error'],
          };

          var dragons = [];
          for (var i = 0; i < 8; ++i) {
            if (array[i])
              dragons.push(i);
          }

          if (dragons.length != 5)
            return ret;

          // MARK 1: counterclockwise of #1 if adjacent, clockwise if not.
          if (dragons[0] + 1 == dragons[1]) {
            // If the first two dragons are adjacent, they *must* go CCW.
            // In the scenario of N, NE, SE, S, W dragons, the first marker
            // could be E, but that forces the second mark to be S (instead
            // of E), making SW unsafe for putting the mark between S and W.
            // Arguably, NW could be used here for the third mark, but then
            // the S dragon would cut off more of the middle of the arena
            // than desired.  This still could happen anyway in the
            // "tricksy" edge case below, but should be avoided if possible.
            marks[0] = (dragons[0] - 1 + 8) % 8;
          } else {
            // Split dragons.  Bias towards first dragon.
            marks[0] = Math.floor((dragons[0] + dragons[1]) / 2);
          }

          // MARK 2: go counterclockwise, unless dragon 2 is adjacent to 3.
          if (dragons[1] == dragons[2] - 1) {
            // Go clockwise.
            marks[1] = dragons[2] + 1;
          } else {
            // Go counterclockwise.
            marks[1] = dragons[2] - 1;
          }

          // MARK 3: if split, between 4 & 5.  If adjacent, clockwise of 5.
          if (dragons[3] + 1 == dragons[4]) {
            // Adjacent dragons.
            // Clockwise is always ok.
            marks[2] = (dragons[4] + 1) % 8;

            // Minor optimization:
            // See if counterclockwise is an option to avoid having mark 3
            // in a place that the first pair covers.
            //
            // If dragon 3 is going counterclockwise, then only need one
            // hole between #3 and #4, otherwise need all three holes.
            // e.g. N, NE, E, W, NW dragon pattern should prefer third
            // mark SW instead of N.
            var distance = marks[1] == dragons[2] - 1 ? 2 : 4;
            if (dragons[3] >= dragons[2] + distance) {
              marks[2] = dragons[3] - 1;
            }
          } else {
            // Split dragons.  Common case: bias towards last dragon, in case
            // 2nd charge is going towards this pair.
            marks[2] = Math.ceil((dragons[3] + dragons[4]) / 2);
            if (marks[1] == dragons[3] && marks[2] == marks[1] + 1) {
              // Tricksy edge case, e.g. N, NE, E, SE, SW.  S not safe for
              // third mark because second mark is at SE, and E dragon will
              // clip S.  Send all dragons CW even if this means eating more
              // arena space.
              marks[2] = (dragons[4] + 1) % 8;
              ret.wideThirdDive = true;
            }
          }

          var bad = badSpots(marks[0], dragons[0]);
          bad.concat(badSpots(marks[0], dragons[1]));
          ret.unsafeThirdMark = bad.indexOf(marks[2]) != -1;

          var dir_names = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
          ret.marks = marks.map(function(i) { return dir_names[i]; });
          return ret;
        };
        // End copy and paste.

        data.findDragonMarks = findDragonMarks;
      },
    },
  ]
}]
