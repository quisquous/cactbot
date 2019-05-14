'use strict';

[{
  zoneRegex: /The Binding Coil Of Bahamut - Turn \(4\)/,
  timelineFile: 't4.txt',
  triggers: [
    {
      id: 'T4 Gravity Thrust',
      regex: / 14:4D4:Spinner-Rook starts using Gravity Thrust on (\y{Name})\./,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'LOS Thrust',
      },
    },
    {
      id: 'T4 Pox',
      regex: / 14:4D5:Spinner-Rook starts using Pox on (\y{Name})\./,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alarmText: {
        en: 'LOS Pox',
      },
    },
    {
      id: 'T4 Reminder',
      regex: / 03:Added new combatant Clockwork Knight/,
      suppressSeconds: 100000,
      infoText: {
        en: 'Magic on Soldier, Physical on Knights',
      },
    },
  ],
}];
