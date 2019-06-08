'use strict';

[{
  zoneRegex: /The Second Coil Of Bahamut - Turn \(2\)/,
  timelineFile: 't7.txt',
  triggers: [
    {
      id: 'T7 Ram',
      regex: / 14:860:Proto-Chimera starts using The Ram's Voice/,
      infoText: {
        en: 'Silence Ram\'s Voice',
      },
    },
    {
      id: 'T7 Dragon',
      regex: / 14:861:Proto-Chimera starts using The Dragon's Voice/,
      infoText: {
        en: 'Silence Dragon\'s Voice',
      },
    },
    {
      id: 'T7 Tail Slap',
      regex: / 1[56]:\y{ObjectId}:Melusine:7A8:Tail Slap:\y{ObjectId}:(\y{Name}):/,
      condition: function(data, matches) {
        return data.me == matches[1] && data.job == 'BLU';
      },
      delaySeconds: 6,
      suppressSeconds: 5,
      infoText: {
        en: 'Tail Slap in 10',
      },
    },
    {
      id: 'T7 Renaud',
      regex: / 03:Added new combatant Renaud\./,
      infoText: {
        en: 'Renaud Add',
      },
    },
    {
      id: 'T7 Voice',
      regex: / 1A:(\y{Name}) gains the effect of Cursed Voice from .*for (\y{Float}) Seconds/,
      delaySeconds: function(data, matches) {
        return matches[2] - 3;
      },
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Voice Soon',
      },
    },
    {
      id: 'T7 Shriek',
      regex: / 1A:(\y{Name}) gains the effect of Cursed Shriek/,
      durationSeconds: 3,
      alarmText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Shriek on YOU',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me != matches[1]) {
          return {
            en: 'Shriek on ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'T7 Shriek Reminder',
      regex: / 1A:(\y{Name}) gains the effect of Cursed Shriek/,
      delaySeconds: 7,
      durationSeconds: 3,
      infoText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Shriek Soon',
          };
        }
        return {
          en: 'Dodge Shriek',
        };
      },
    },
    {
      id: 'T7 Phase 2',
      regex: /:Melusine HP at 79%/,
      sound: 'Long',
    },
    {
      id: 'T7 Phase 3',
      regex: /:Melusine HP at 59%/,
      sound: 'Long',
    },
    {
      id: 'T7 Phase 4',
      regex: /:Melusine HP at 34%/,
      sound: 'Long',
    },
    {
      id: 'T7 Petrifaction 1',
      regex: / 14:7BB:Lamia Prosector starts using Petrifaction/,
      alertText: {
        en: 'Look Away!',
      },
    },
    {
      id: 'T7 Petrifaction 2',
      regex: / 14:7B1:Melusine starts using Petrifaction/,
      alertText: {
        en: 'Look Away!',
      },
    },
    {
      id: 'T7 Tail',
      regex: /14:7B2:Melusine starts using Venomous Tail/,
      alertText: {
        en: 'Venomous Tail',
      },
    },
  ],
}];
