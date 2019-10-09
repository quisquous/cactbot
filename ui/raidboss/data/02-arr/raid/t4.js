'use strict';

[{
  zoneRegex: /^The Binding Coil Of Bahamut - Turn \(4\)$/,
  timelineFile: 't4.txt',
  triggers: [
    {
      id: 'T4 Gravity Thrust',
      regex: / 14:4D4:Spinner-Rook starts using Gravity Thrust on (\y{Name})\./,
      regexDe: / 14:4D4:Drehturm starts using Gravitationsschlag on (\y{Name})\./,
      regexFr: / 14:4D4:Drone-Drille starts using Percée Gravitationnelle on (\y{Name})\./,
      regexJa: / 14:4D4:ルークスピナー starts using グラビデカノン on (\y{Name})\./,
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
      regexDe: / 14:4D5:Drehturm starts using Pocken on (\y{Name})\./,
      regexFr: / 14:4D5:Drone-Drille starts using Vérole on (\y{Name})\./,
      regexJa: / 14:4D5:ルークスピナー starts using ポックス on (\y{Name})\./,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alarmText: {
        en: 'LOS Pox',
      },
    },
    {
      id: 'T4 Reminder',
      regex: / 03:\y{ObjectId}:Added new combatant Clockwork Knight\./,
      regexDe: / 03:\y{ObjectId}:Added new combatant Uhrwerk-Ritter\./,
      regexFr: / 03:\y{ObjectId}:Added new combatant Chevalier Mécanique\./,
      regexJa: / 03:\y{ObjectId}:Added new combatant アラガンワーク・ナイト\./,
      suppressSeconds: 100000,
      infoText: {
        en: 'Magic on Soldier, Physical on Knights',
      },
    },
  ],
}];
