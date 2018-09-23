'use strict';

// O10S - Alphascape 2.0 Savage
[{
  zoneRegex: /^Alphascape V2.0 \(Savage\)$/,
  timelineFile: 'o10s.txt',
  timelineTriggers: [
    {
      id: 'O10S Ice Positioning',
      regex: /Northern Cross/,
      beforeSeconds: 1,
      alertText: {
        en: 'position for ice',
      },
    },
    {
      id: 'O10S Add Phase',
      regex: /Frost Breath ready/,
      beforeSeconds: 12,
      alertText: {
        en: 'add incoming',
      },
    },
    {
      id: 'O10S Dive Bombs',
      regex: /Cauterize/,
      beforeSeconds: 1,
      alertText: {
        en: 'avoid dive bomb',
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
        en: 'Fire Marker',
      },
    },
    {
      id: 'O10S Earthshakers',
      regex: /:31B6:Midgardsormr casts Earth Shaker/,
      alarmText: {
        en: 'Spread shakers',
      },
    },
    {
      id: '010S Flip Count',
      regex: /: Flip/,
      infoText: {
        en: 'Flip',
      },
      preRun: function(data) {
        data.firstMove = (data.firstMove || 'flip');
        data.totalCoilFlip = (data.totalCoilFlip || 0) + 1;
        // Coil Flip
        if (data.firstMove === 'coil') {
          data.coilFlipText = 'get in, donut';
        } else { // Flip Flip
          data.coilFlipText = 'plus sign';
        }
      },
      tts: function(data) {
        return (data.totalCoilFlip === 2) ? data.coilFlipText : null;
      },
    },
    {
      id: '010S Coil Count',
      regex: /: Flip/,
      infoText: {
        en: 'Flip',
      },
      preRun: function(data) {
        data.firstMove = (data.firstMove || 'coil');
        data.totalCoilFlip = (data.totalCoilFlip || 0) + 1;

        // Coil Coil
        if (data.firstMove === 'coil') {
          data.coilFlipText = 'get out, max melee';
        } else { // Flip Coil
          data.coilFlipText = 'X sign';
        }
      },
      tts: function(data) {
        return (data.totalCoilFlip === 2) ? data.coilFlipText : null;
      },
    },
    {
      id: 'O10S In/Out',
      regex: ':31B(2|4):(Midgardsormr)',
      run: function(data) {
        // resolves coilFlip
        delete data.totalCoilFlip;
        delete data.firstMove;
      },
    },
    {
      id: 'O10S Death from Above',
      regex: 'Death from Above',
      run: function(data, matches) {
        data.hasAboveBuff = matches[1];
      },
      tts: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: data.ShortName(matches[1]) + ' get ground ',
          };
        }
      },
    },
    {
      id: 'O10S Death from Below',
      regex: 'Death from Below',
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      tts: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: data.ShortName(matches[1]) + ' tank flying',
          };
        }
      },
    },
    {
      id: 'O10S Puddle',
      regex: ':XXXX:Add removed from battlefield',
      tts: function(data) {
        return {
          en: data.ShortName(data.hasAboveBuff) + 'get puddle.',
        };
      },
    },
    {
      id: 'O10S Crumbling Bulwark',
      regex: ':XXXX:Crumbling Bulwark',
      tts: function(data) {
        return {
          en: 'Bulwark Crumbling',
        };
      },
    },
    {
      id: 'O10S Pass Bulwark',
      regex: ':31BC: Crimson Breath',
      tts: function(data, matches) {
        return {
          en: 'Pass to ' + data.ShortName(matches[1]),
        };
      },
    },
  ],
}];