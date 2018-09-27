'use strict';

// TODO: fix tail end (seemed to not work??)
// TODO: add phase tracking (so death from above/below can tell you to swap or not)
// TODO: add swap callout after exaflares
// TODO: debuff tracking for when you lose the barrier to remind you to run?
// TODO: ice head markers
// TODO: stack head markers

// O10S - Alphascape 2.0 Savage
[{
  zoneRegex: /^Alphascape V2.0 \(Savage\)$/,
  timelineFile: 'o10s.txt',
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
        if (matches[1] == data.me) {
          return {
            en: 'buster',
            de: 'basta',
            fr: 'tankbuster',
          };
        }
      },
    },
    {
      id: 'O10S Fire Marker',
      regex: / 1B:........:(\y{Name}):....:....:0017:0000:0000:0000:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alarmText: {
        en: 'Fire Marker on YOU',
      },
      infoText: function(data, matches) {
        if (data.me != matches[1])
          return 'Fire on ' + data.ShortName(matches[1]);
      },
    },
    {
      id: 'O10S Death From Below',
      regex: / 1B:........:(\y{Name}):....:....:008F:0000:0000:0000:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Death From Below',
      },
    },
    {
      id: 'O10S Death From Above',
      regex: / 1B:........:(\y{Name}):....:....:008E:0000:0000:0000:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Death From Above',
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
        en: 'Next Spin: In/Out',
      },
      run: function(data) {
        data.lastSpinWasHorizontal = true;
      },
    },
    {
      id: 'O10N Vertical Spin 1',
      regex: /15:\y{ObjectId}:Midgardsormr:31AD:/,
      infoText: {
        en: 'Next Spin: Cardinals/Corners',
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
          en: 'Go To Cardinals',
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
          en: 'Go To Corners',
        };
      },
    },
  ],
}];