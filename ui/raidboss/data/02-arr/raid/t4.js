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
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Clockwork Bug': 'Uhrwerk-Wanze',
        'Clockwork Dreadnaught': 'Brummonaut',
        'Clockwork Knight': 'Uhrwerk-Ritter',
        'Drive Cylinder': 'Antriebszylinder',
        'Spinner-rook': 'Drehturm',
      },
      'replaceText': {
        'Bug': 'Wanze',
        'Dreadnaught': 'Brummonaut',
        'Emergency Override': 'Not-Übersteuerung',
        'Knight': 'Ritter',
        'Rook': 'Drehturm',
        'Soldier': 'Soldat',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Clockwork Bug': 'insecte mécanique',
        'Clockwork Dreadnaught': 'cuirassé Dreadnaught',
        'Clockwork Knight': 'chevalier mécanique',
        'Drive Cylinder': 'cylindre propulseur',
        'Spinner-rook': 'drone-drille',
      },
      'replaceText': {
        'Bug': 'Bug', // FIXME
        'Dreadnaught': 'Dreadnaught', // FIXME
        'Emergency Override': 'Annulation d\'urgence',
        'Knight': 'Knight', // FIXME
        'Rook': 'Rook', // FIXME
        'Soldier': 'Soldier', // FIXME
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Clockwork Bug': 'アラガンワーク・バグ',
        'Clockwork Dreadnaught': 'ドレッドノート',
        'Clockwork Knight': 'アラガンワーク・ナイト',
        'Drive Cylinder': '稼働隔壁',
        'Spinner-rook': 'ルークスピナー',
      },
      'replaceText': {
        'Bug': 'Bug', // FIXME
        'Dreadnaught': 'Dreadnaught', // FIXME
        'Emergency Override': 'エマージェンシー・オーバーライド',
        'Knight': 'Knight', // FIXME
        'Rook': 'Rook', // FIXME
        'Soldier': 'Soldier', // FIXME
      },
    },
  ],
}];
