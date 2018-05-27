// Tsukuyomi Extreme
[{
  zoneRegex: /^The Minstrel's Ballad: Tsukuyomi's Pain$/,
  timelineFile: 'tsukuyomi-ex.txt',
  triggers: [
    {
      id: 'Tsukuyomi Nightfall Gun',
      regex: / 14:2BBC:Tsukuyomi starts using Nightfall/,
      alertText: {
        en: 'Gun: Stack',
      },
    },
    {
      id: 'Tsukuyomi Nightfall Spear',
      regex: / 14:2BBD:Tsukuyomi starts using Nightfall/,
      alertText: {
        en: 'Spear: Spread',
      },
    },
    {
      id: 'Tsukuyomi Torment',
      regex: / 14:2BBB:Tsukuyomi starts using Torment Unto Death on (\y{Name})/,
      alarmText: function(data, matches) {
        if (matches[1] == data.me || data.role != 'tank')
          return;
        return {
          en: 'Tank Swap!',
        };
      },
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tenkbasta auf DIR',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tenkbasta auf ' + data.ShortName(matches[1]),
          };
        }
      },
      infoText: function(data, matches) {
        if (matches[1] == data.me || data.role == 'tank' || data.role == 'healer')
          return;
        return {
          en: 'Get out of front',
        };
      },
      tts: function(data, matches) {
        if (data.role == 'tank' || data.role == 'healer') {
          return {
            en: 'buster',
            de: 'basta',
          };
        }
      },
    },
    {
      regex: /:Tsukuyomi gains the effect of Full Moon/,
      run: function(data) {
        var moonInOut = {
          en: 'Out',
        };
        data.moonInOut = moonInOut[data.lang] || moonInOut['en'];
      },
    },
    {
      regex: /:Tsukuyomi gains the effect of New Moon/,
      run: function(data) {
        var moonInOut = {
          en: 'In',
        };
        data.moonInOut = moonInOut[data.lang] || moonInOut['en'];
      },
    },
    {
      id: 'Tsukuyomi Dark Blade',
      regex: / 14:2BDA:Tsukuyomi starts using Dark Blade/,
      infoText: function(data) {
        return {
          en: 'Left + ' + data.moonInOut,
          fr: 'Gauche + ' + data.moonInOut,
          de: 'Links + ' + data.moonInOut,
        };
      },
      tts: function(data) {
        return {
          en: 'Left + ' + data.moonInOut,
          fr: 'Gauche + ' + data.moonInOut,
          de: 'Links + ' + data.moonInOut,
        };
      },
    },
    {
      id: 'Tsukuyomi Bright Blade',
      regex: / 14:2BDB:Tsukuyomi starts using Bright Blade/,
      infoText: function(data) {
        return {
          en: 'Right + ' + data.moonInOut,
          fr: 'Droite + ' + data.moonInOut,
          de: 'Rechts + ' + data.moonInOut,
        };
      },
      tts: function(data) {
        return {
          en: 'Right + ' + data.moonInOut,
          fr: 'Droite + ' + data.moonInOut,
          de: 'Rechts + ' + data.moonInOut,
        };
      },
    },
    {
      id: 'Tsukuyomi Meteor Marker',
      regex: / 1B:........:(\y{Name}):....:....:0083:0000:0000:0000:/,
      condition: function(data, matches) { return (matches[1] == data.me); },
      alarmText: {
        en: 'Meteor on YOU',
      },
      tts: {
        en: 'Meteor on YOU',
      },
    },

    // Supreme Selenomancy (used to reset counters)
    {
      regex: /:Tsukuyomi:2EB0:/,
      run: function(data) {
        delete data.moonlitCount;
        delete data.moonshadowedCount;
      },
      suppressSeconds: 5,
    },
    // Moonlit debuff
    {
      regex: / 1A:(\y{Name}) gains the effect of Moonlit/,
      condition: function(data, matches) { return matches[1] == data.me },
      preRun: function(data) {
        // init at 3 so we can start at 4 stacks to give the initial instruction to move
        if (typeof data.moonlitCount === 'undefined') {
          data.moonlitCount = 3;
        }
        data.moonlitCount += 1;
        data.moonshadowedCount = 0;
        if (data.moonlitCount > 4) data.moonlitCount = 0; // dead/reset?
      },
      infoText: function(data) {
        if (data.moonlitCount >= 4) return "Move to Black!!";
      },
    },
    // Moonshadowed debuff
    {
      regex: / 1A:(\y{Name}) gains the effect of Moonshadowed/,
      condition: function(data, matches) { return matches[1] == data.me },
      preRun: function(data) {
        // init at 3 so we can start at 4 stacks to give the initial instruction to move
        if (typeof data.moonshadowedCount === 'undefined') {
          data.moonshadowedCount = 3;
        }
        data.moonshadowedCount += 1;
        data.moonlitCount = 0;
        if (data.moonshadowedCount > 4) data.moonshadowedCount = 0; // dead/reset?
      },
      infoText: function(data) {
        if (data.moonshadowedCount >= 4) return "Move to White!!";
      },
    },

    // TODO: fan callouts
    // TODO: add timeline
    // TODO: mob location callouts for tank (maybe based on timeline)
  ]
}]
