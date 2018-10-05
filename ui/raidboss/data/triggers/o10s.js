'use strict';

// TODO: cross/in/out callouts xx
// TODO: fix tail end (seemed to not work??) xx
// TODO: add phase tracking (so death from above/below can tell you to swap or not) xx
// TODO: add swap callout after exaflares
// TODO: debuff tracking for when you lose the barrier to remind you to run?
// TODO: ice head markers
// TODO: stack head markers

// O10S - Alphascape 2.0 Savage
[{
  zoneRegex: /^Alphascape V2.0 \(Savage\)$/,
  timelineFile: 'o10s.txt',
  timelineTriggers: [
    {
      id: 'O10S Ice Positioning',
      regex: /Northern Cross/,
      beforeSeconds: 5,
      alertText: {
        en: 'position for ice',
      },
    },
    {
      id: 'O10S Add Phase',
      regex: /Frost Breath/,
      beforeSeconds: 16,
      suppressSeconds: 50,
      alertText: {
        en: 'add incoming, focus nails',
      },
    },
    {
      id: 'O10S Earth Shakers',
      regex: /Earth Shaker/,
      beforeSeconds: 5,
      alertText: {
        en: 'spread shakers',
      },
    },
    {
      id: 'O10S Ach Morn',
      regex: /Akh Morn/,
      beforeSeconds: 6,
      alertText: {
        en: 'Stack',
      },
    },
    {
      id: 'O10S Ach Morn',
      regex: /Akh Rhai/,
      beforeSeconds: 5,
      alertText: {
        en: 'DPS Move',
      },
    },
    {
      id: 'O10S Dive Bombs',
      regex: /Cauterize/,
      beforeSeconds: 3,
      suppressSeconds: 12,
      alertText: {
        en: 'avoid dive bombs',
      },
    },
  ],
  triggers: [
    {
      id: 'O10S Tail End',
      regex: / 14:31AA:Midgardsormr starts using Tail End on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tenkbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tenkbuster auf ' + data.ShortName(matches[1]),
            fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
          };
        }
      },
      tts: function(data, matches) {
        return {
          en: 'tank buster',
          de: 'basta',
          fr: 'tankbuster',
        };
      },
    },
    {
      id: 'O10S Fire Marker',
      regex: /1B:........:(\y{Name}):....:....:0017:0000:0000:0000:/,
      alarmText: {
        en: 'Fire Up',
      },
      tts: function(data, matches) {
        if (data.me != matches[1])
          return 'Fire on ' + data.ShortName(matches[1]);
      },
    },
    {
      id: '010S Time Immemorial - Tracker',
      regex: /:32EF:/,
      run: function(data, matches) {
      // Boss Locations
      // THIS IS NOT RIGHT, somehow
      // Phase 1 - Flying (first cast)
      // Phase 2 - Adds  (no cast)
      // Phase 3 - Grounded (cast)
      // Phase 4  - Flying (cast, cast)
        data.memorialCounter = (data.memorialCounter || 0) + 1;
      },
    },
    {
      id: 'O10S Death From Below',
      regex: / 1B:........:(\y{Name}):....:....:008F:0000:0000:0000:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      preRun: function(data) {
        data.hasAboveBuff = false;
        data.deathBelowText = 'get flying ';

        // boss is on ground
        // if (data.memorialCounter === 1)
        //   data.deathBelowText = 'get boss ';
      },
      infoText: {
        en: 'Death From Below',
      },
      tts: function(data, matches) {
        return {
          en: data.deathBelowText + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'O10S Death From Above',
      regex: / 1B:........:(\y{Name}):....:....:008E:0000:0000:0000:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      preRun: function(data, matches) {
        data.hasAboveBuff = true;
        data.deathAboveText = 'get grounded ';

        // // boss is flying at this points
      // if (data.memorialCounter === 0 || data.memorialCounter === 2 || data.memorialCounter === 3)
        //   data.deathAboveText = 'get boss ';
      },
      infoText: function(data, matches) {
        return {
          en: 'Death From Above',
        };
      },
      tts: function(data, matches) {
        return {
          en: data.deathAboveText + data.ShortName(matches[1]),
        };
      },
    },
    {
    // Spin Table
    // 31AC + 31AE = 31B2 (horiz + horiz = out)
    // 31AC + 31B0 = 31B4 (horiz + vert = in)
    // 31AD + 31AE = 31B3 (vert + horiz = x)
    // 31AD + 31B0 = 31B5 (vert + vert = +)
      id: 'O10S Spin Cleanup',
      // 16 if it doesn't hit anybody, 15 if it does.
      // Also, some log lines are inconsistent here and don't always list
      // Midgardsormr's name and are sometimes blank.
      regex: /1[56]:\y{ObjectId}:(?:Midgardsormr|):31B[2345]:/,
      run: function(data) {
        delete data.lastSpinWasHorizontal;
      },
    },
    {
      id: 'O10N Horizontal Spin 1',
      regex: /15:\y{ObjectId}:Midgardsormr:31AC:/,
      infoText: {
        en: 'Next Spin: In or Out',
      },
      run: function(data) {
        data.lastSpinWasHorizontal = true;
      },
    },
    {
      id: 'O10N Gains Crumbling',
      regex: /00:112e:(\y{Name}) gains the effect of Crumbling Bulwark/,
      tts: function(data, matches) {
        return {
          en: 'Crumbling on ' + data.ShortName(matches[1]),
        };
      },

    },
    {
      id: 'O10N Gains Arcane',
      regex: /00:112e:(\y{Name}) gains the effect of Arcane Bulwark/,
      tts: function(data, matches) {
        return {
          en: 'Bulwark on ' + data.ShortName(matches[1]),
        };
      },

    },
    {
      id: 'O10N Vertical Spin 1',
      regex: /15:\y{ObjectId}:Midgardsormr:31AD:/,
      infoText: {
        en: 'Next Spin: Cardinals or Corners',
      },
      run: function(data) {
        data.lastSpinWasHorizontal = false;
      },
    },
    {
      id: 'O10N Horizontal Spin 2',
      regex: /15:\y{ObjectId}:Midgardsormr:31AE:/,
      condition: function(data) {
        return data.lastSpinWasHorizontal !== undefined;
      },
      alertText: function(data) {
        if (data.lastSpinWasHorizontal) {
          return {
            en: 'Get Out',
          };
        }
        return {
          en: 'X sign',
        };
      },
    },
    {
      id: 'O10N Vertical Spin 2',
      regex: /15:\y{ObjectId}:Midgardsormr:31B0:/,
      condition: function(data) {
        return data.lastSpinWasHorizontal !== undefined;
      },
      alertText: function(data) {
        if (data.lastSpinWasHorizontal) {
          return {
            en: 'Get In',
          };
        }
        return {
          en: 'Plus Sign',
        };
      },
    },
  ],
}];
