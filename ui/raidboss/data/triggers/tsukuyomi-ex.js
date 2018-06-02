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
        de: 'Pistole: Stack',
      },
    },
    {
      id: 'Tsukuyomi Nightfall Spear',
      regex: / 14:2BBD:Tsukuyomi starts using Nightfall/,
      alertText: {
        en: 'Spear: Spread',
        de: 'Speer: Verteilen',
      },
    },
    {
      id: 'Tsukuyomi Torment',
      regex: / 14:2BBB:Tsukuyomi starts using Torment Unto Death on (\y{Name})/,
      alarmText: function(data, matches) {
        if (matches[1] == data.me || data.role != 'tank') {
          return;
        }
        return {
          en: 'Tank Swap!',
          de: 'Tankwechsel!',
        };
      },
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tankbuster auf ' + data.ShortName(matches[1]),
          };
        }
      },
      infoText: function(data, matches) {
        if (matches[1] == data.me || data.role == 'tank' || data.role == 'healer') {
          return;
        }
        return {
          en: 'Get out of front',
          de: 'Weg von vorn',
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
          de: 'Raus',
        };
        data.moonInOut = moonInOut[data.lang] || moonInOut['en'];
      },
    },
    {
      regex: /:Tsukuyomi gains the effect of New Moon/,
      run: function(data) {
        var moonInOut = {
          en: 'In',
          de: 'Rein',
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
        de: 'Meteor auf DIR',
      },
      tts: {
        en: 'Meteor on YOU',
        de: 'Meteor auf DIR',
      },
    },
    {
      id: 'Tsukuyomi Supreme Selenomancy',
      regex: /:Tsukuyomi:2EB0:/,
      run: function(data) {
        delete data.moonlitCount;
        delete data.moonshadowedCount;
      },
      suppressSeconds: 5,
    },
    {
      id: 'Tsukuyomi Moonlit Debuff Logic',
      regex: / 1A:(\y{Name}) gains the effect of Moonlit/,
      condition: function(data, matches) { return matches[1] == data.me },
      preRun: function(data) {
        // init at 3 so we can start at 4 stacks to give the initial instruction to move
        if (typeof data.moonlitCount === 'undefined') {
          data.moonlitCount = 3;
        }
        data.moonlitCount += 1;
        data.moonshadowedCount = 0;
        // dead/reset?
        if (data.moonlitCount > 4)
          data.moonlitCount = 0;
      },
    },
    {
      id: 'Tsukuyomi Moonlit Debuff',
      regex: / 1A:(\y{Name}) gains the effect of Moonlit/,
      condition: function(data, matches) { return matches[1] == data.me && data.moonlitCount >= 4; },
      infoText: {
        en: 'Move to Black!',
        de: "In's schwarze laufen!"
      },
    },
    {
      id: 'Tsukuyomi Moonshadowed Debuff Logic',
      regex: / 1A:(\y{Name}) gains the effect of Moonshadowed/,
      condition: function(data, matches) { return matches[1] == data.me },
      preRun: function(data) {
        // init at 3 so we can start at 4 stacks to give the initial instruction to move
        if (typeof data.moonshadowedCount === 'undefined') {
          data.moonshadowedCount = 3;
        }
        data.moonshadowedCount += 1;
        data.moonlitCount = 0;
        // dead/reset?
        if (data.moonshadowedCount > 4)
          data.moonshadowedCount = 0;
      },
    },
    {
      id: 'Tsukuyomi Moonshadowed Debuff',
      regex: / 1A:(\y{Name}) gains the effect of Moonshadowed/,
      condition: function(data, matches) { return matches[1] == data.me && data.moonshadowedCount >= 4; },
      infoText: {
        en: 'Move to White!',
        de: "In's weiße laufen!"
      },
    },
  ],
}]
