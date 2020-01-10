'use strict';

[{
  zoneRegex: /^The Binding Coil Of Bahamut - Turn \(4\)$/,
  timelineFile: 't4.txt',
  triggers: [
    {
      id: 'T4 Gravity Thrust',
      regex: Regexes.startsUsing({ source: 'Spinner-Rook', id: '4D4' }),
      regexDe: Regexes.startsUsing({ source: 'Drehturm', id: '4D4' }),
      regexFr: Regexes.startsUsing({ source: 'Drone-Drille', id: '4D4' }),
      regexJa: Regexes.startsUsing({ source: 'ルークスピナー', id: '4D4' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'LOS Thrust',
      },
    },
    {
      id: 'T4 Pox',
      regex: Regexes.startsUsing({ source: 'Spinner-Rook', id: '4D5' }),
      regexDe: Regexes.startsUsing({ source: 'Drehturm', id: '4D5' }),
      regexFr: Regexes.startsUsing({ source: 'Drone-Drille', id: '4D5' }),
      regexJa: Regexes.startsUsing({ source: 'ルークスピナー', id: '4D5' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alarmText: {
        en: 'LOS Pox',
      },
    },
    {
      id: 'T4 Reminder',
      regex: Regexes.addedCombatant({ name: 'Clockwork Knight', capture: false }),
      regexDe: Regexes.addedCombatant({ name: 'Uhrwerk-Ritter', capture: false }),
      regexFr: Regexes.addedCombatant({ name: 'Chevalier Mécanique', capture: false }),
      regexJa: Regexes.addedCombatant({ name: 'アラガンワーク・ナイト', capture: false }),
      regexCn: Regexes.addedCombatant({ name: '亚拉戈发条骑士', capture: false }),
      regexKo: Regexes.addedCombatant({ name: '알라그 태엽기사', capture: false }),
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
        'Clockwork Bug': 'Insecte mécanique',
        'Clockwork Dreadnaught': 'Cuirassé Dreadnaught',
        'Clockwork Knight': 'Chevalier mécanique',
        'Drive Cylinder': 'Cylindre propulseur',
        'Spinner-rook': 'Drone-drille',
      },
      'replaceText': {
        'Bug': 'Insecte',
        'Dreadnaught': 'Cuirassé',
        'Emergency Override': 'Annulation d\'urgence',
        'Knight': 'Chevalier',
        'Rook': 'Drone',
        'Soldier': 'Soldat',
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
