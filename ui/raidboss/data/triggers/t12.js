'use strict';

[{
  zoneRegex: /The Final Coil Of Bahamut - Turn \(3\)/,
  timelineFile: 't12.txt',
  triggers: [
    {
      id: 'T12 Phase 3',
      regex: / 15:\y{ObjectId}:Phoenix:B96:/,
      sound: 'Long',
      run: function(data) {
        data.phase = 3;
      },
    },
    {
      id: 'T12 Bennu',
      regex: / 03:Added new combatant Bennu/,
      delaySeconds: 55,
      durationSeconds: 4.5,
      infoText: function(data) {
        if (data.phase >= 3)
          return;
        return {
          en: 'Bennu Soon',
        };
      },
    },
    {
      id: 'T12 Revelation',
      regex: / 14:B87:Phoenix starts using Revelation on (\y{Name})\./,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Revelation on YOU',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches[1] != data.me) {
          return {
            en: 'Away from ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'T12 Blackfire',
      regex: / 14:B8C:Phoenix starts using Blackfire/,
      infoText: {
        en: 'Blackfire Spread',
      },
    },
    {
      id: 'T12 Whitefire',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0020:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Whitefire on YOU',
      },
    },
    {
      id: 'T12 Bluefire',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0021:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Bluefire Away',
      },
    },
    {
      id: 'T12 Chain',
      regex: / 1A:(\y{Name}) gains the effect of Chain Of Purgatory/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Chain on YOU',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches[1] != data.me) {
          return {
            en: 'Chain on ' + data.ShortName(matches[1]),
          };
        }
      },
    },
  ],
}];
