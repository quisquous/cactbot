'use strict';

[{
  zoneRegex: /^The Final Coil Of Bahamut - Turn \(2\)$/,
  timelineFile: 't11.txt',
  triggers: [
    {
      id: 'T11 Secondary Head',
      regex: / 15:\y{ObjectId}:Kaliya:B73:Secondary Head:\y{ObjectId}:(\y{Name}):/,
      regexDe: / 15:\y{ObjectId}:Kaliya:B73:Nebenkopf:\y{ObjectId}:(\y{Name}):/,
      regexFr: / 15:\y{ObjectId}:Kaliya:B73:Tête secondaire:\y{ObjectId}:(\y{Name}):/,
      regexJa: / 15:\y{ObjectId}:カーリア:B73:サブヘッド:\y{ObjectId}:(\y{Name}):/,
      alertText: function(data, matches) {
        return {
          en: 'Stun on ' + data.ShortName(matches[1]),
          fr: 'Stun sur ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'T11 Seed River First',
      regex: / 15:\y{ObjectId}:Kaliya:B74:/,
      regexDe: / 15:\y{ObjectId}:Kaliya:B74:/,
      regexFr: / 15:\y{ObjectId}:Kaliya:B74:/,
      regexJa: / 15:\y{ObjectId}:カーリア:B74:/,
      alertText: function(data) {
        if (data.firstSeed)
          return;
        return {
          en: 'Spread => Stack',
          fr: 'Ecarté -> Packé',
        };
      },
      run: function(data) {
        if (!data.firstSeed)
          data.firstSeed = 'river';
      },
    },
    {
      id: 'T11 Seed Sea First',
      regex: / 15:\y{ObjectId}:Kaliya:B75:/,
      regexDe: / 15:\y{ObjectId}:Kaliya:B75:/,
      regexFr: / 15:\y{ObjectId}:Kaliya:B75:/,
      regexJa: / 15:\y{ObjectId}:カーリア:B75:/,
      alertText: function(data) {
        if (data.firstSeed)
          return;
        return {
          en: 'Stack => Spread',
          fr: 'Packé -> Ecarté',
        };
      },
      run: function(data) {
        if (!data.firstSeed)
          data.firstSeed = 'sea';
      },
    },
    {
      id: 'T11 Seed River Second',
      regex: / 1[56]:\y{ObjectId}:Kaliya:B76:Seed Of The Rivers:/,
      regexDe: / 1[56]:\y{ObjectId}:Kaliya:B76:Samen der Flüsse:/,
      regexFr: / 1[56]:\y{ObjectId}:Kaliya:B76:Germe de la rivière:/,
      regexJa: / 1[56]:\y{ObjectId}:カーリア:B76:シード・オブ・リバー:/,
      infoText: function(data) {
        if (!data.firstSeed)
          return;
        return {
          en: 'Stack',
          fr: 'Packé',
        };
      },
      run: function(data) {
        delete data.firstSeed;
      },
    },
    {
      id: 'T11 Seed Sea Second',
      regex: / 1[56]:\y{ObjectId}:Kaliya:B77:Seed Of The Sea:/,
      regexDe: / 1[56]:\y{ObjectId}:Kaliya:B77:Samen der See:/,
      regexFr: / 1[56]:\y{ObjectId}:Kaliya:B77:Germe de la mer:/,
      regexJa: / 1[56]:\y{ObjectId}:カーリア:B77:シード・オブ・シー:/,
      infoText: function(data) {
        if (!data.firstSeed)
          return;
        return {
          en: 'Spread',
          fr: 'Ecarté',
        };
      },
      run: function(data) {
        delete data.firstSeed;
      },
    },
    {
      id: 'T11 Phase 2',
      regex: /:Kaliya HP at 60%/,
      sound: 'Long',
      infoText: {
        en: 'Out of Middle',
        fr: 'En dehors du centre',
      },
    },
    {
      id: 'T11 Forked Lightning',
      regex: / 15:\y{ObjectId}:Electric Node:B85:Forked Lightning:\y{ObjectId}:(\y{Name}):/,
      regexDe: / 15:\y{ObjectId}:Elektrisches Modul:B85:Gabelblitz:\y{ObjectId}:(\y{Name}):/,
      regexFr: / 15:\y{ObjectId}:Module D'Électrochoc:B85:Éclair ramifié:\y{ObjectId}:(\y{Name}):/,
      regexJa: / 15:\y{ObjectId}:雷撃システム:B85:フォークライトニング:\y{ObjectId}:(\y{Name}):/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      alarmText: {
        en: 'Lightning on YOU',
        fr: 'Eclair sur VOUS',
      },
    },
    {
      id: 'T11 Phase 3',
      regex: / 15:\y{ObjectId}:Kaliya:B78:Emergency Mode:/,
      regexDe: / 15:\y{ObjectId}:Kaliya:B78:Notprogramm:/,
      regexFr: / 15:\y{ObjectId}:Kaliya:B78:Mode d'urgence:/,
      regexJa: / 15:\y{ObjectId}:カーリア:B78:イマージャンシーモード:/,
      sound: 'Long',
      infoText: {
        en: 'Final Phase',
        fr: 'Phase finale',
      },
    },
    {
      id: 'T11 Tether Accumulate A',
      regex: Regexes.tether({ id: '001C', target: 'Kaliya' }),
      regexDe: Regexes.tether({ id: '001C', target: 'Kaliya' }),
      regexFr: Regexes.tether({ id: '001C', target: 'Kaliya' }),
      regexJa: Regexes.tether({ id: '001C', target: 'カーリア' }),
      regexCn: Regexes.tether({ id: '001C', target: '卡利亚' }),
      regexKo: Regexes.tether({ id: '001C', target: '칼리야' }),
      run: function(data, matches) {
        data.tetherA = data.tetherA || [];
        data.tetherA.push(matches.source);
      },
    },
    {
      id: 'T11 Tether Accumulate B',
      regex: Regexes.tether({ id: '001D', target: 'Kaliya' }),
      regexDe: Regexes.tether({ id: '001D', target: 'Kaliya' }),
      regexFr: Regexes.tether({ id: '001D', target: 'Kaliya' }),
      regexJa: Regexes.tether({ id: '001D', target: 'カーリア' }),
      regexCn: Regexes.tether({ id: '001D', target: '卡利亚' }),
      regexKo: Regexes.tether({ id: '001D', target: '칼리야' }),
      run: function(data, matches) {
        data.tetherB = data.tetherB || [];
        data.tetherB.push(matches.source);
      },
    },
    {
      id: 'T11 Tether A',
      regex: Regexes.tether({ id: '001C', target: 'Kaliya', capture: false }),
      regexDe: Regexes.tether({ id: '001C', target: 'Kaliya', capture: false }),
      regexFr: Regexes.tether({ id: '001C', target: 'Kaliya', capture: false }),
      regexJa: Regexes.tether({ id: '001C', target: 'カーリア', capture: false }),
      regexCn: Regexes.tether({ id: '001C', target: '卡利亚', capture: false }),
      regexKo: Regexes.tether({ id: '001C', target: '칼리야', capture: false }),
      condition: function(data) {
        return data.tetherA.length == 2;
      },
      alarmText: function(data) {
        let partner = undefined;
        if (data.tetherA[0] == data.me)
          partner = data.tetherA[1];
        if (data.tetherA[1] == data.me)
          partner = data.tetherA[0];
        if (!partner)
          return;
        return {
          en: 'Red Tethers With ' + data.ShortName(partner),
          fr: 'Liens rouges avec ' + data.ShortName(partner),
        };
      },
    },
    {
      id: 'T11 Tether B',
      regex: Regexes.tether({ id: '001D', target: 'Kaliya', capture: false }),
      regexDe: Regexes.tether({ id: '001D', target: 'Kaliya', capture: false }),
      regexFr: Regexes.tether({ id: '001D', target: 'Kaliya', capture: false }),
      regexJa: Regexes.tether({ id: '001D', target: 'カーリア', capture: false }),
      regexCn: Regexes.tether({ id: '001D', target: '卡利亚', capture: false }),
      regexKo: Regexes.tether({ id: '001D', target: '칼리야', capture: false }),
      condition: function(data) {
        return data.tetherB.length == 2;
      },
      alarmText: function(data) {
        let partner = undefined;
        if (data.tetherB[0] == data.me)
          partner = data.tetherB[1];
        if (data.tetherB[1] == data.me)
          partner = data.tetherB[0];
        if (!partner)
          return;
        return {
          en: 'Blue Tethers With ' + data.ShortName(partner),
          fr: 'Liens bleus avec ' + data.ShortName(partner),
        };
      },
    },
    {
      id: 'T11 Tether Cleanup',
      regex: / 16:\y{ObjectId}:Kaliya:B7B:Nanospore Jet:/,
      regexDe: / 16:\y{ObjectId}:Kaliya:B7B:Nanosporen-Strahl:/,
      regexFr: / 16:\y{ObjectId}:Kaliya:B7B:Jet de magismoparticules:/,
      regexJa: / 16:\y{ObjectId}:カーリア:B7B:魔科学粒子散布:/,
      run: function(data) {
        delete data.tetherA;
        delete data.tetherB;
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Engage!': 'Start!',
        'Kaliya': 'Kaliya',
        'The Core Override is no longer sealed': 'Der Zugang zur Kern-Steuereinheit öffnet sich wieder',
        'The Core Override will be sealed off': 'bis sich der Zugang zur Kern-Steuereinheit schließt',
      },
      'replaceText': {
        'Barofield': 'Baro-Feld',
        'Emergency Mode': 'Notprogramm',
        'Enrage': 'Finalangriff',
        'Main Head': 'Hauptkopf',
        'Nanospore Jet': 'Nanosporen-Strahl',
        'Nerve Cloud': 'Nervenwolke',
        'Nerve Gas': 'Nervengas',
        'Resonance': 'Resonanz',
        'Secondary Head': 'Nebenkopf',
        'Seed Of The Rivers': 'Samen der Flüsse',
        'Seed Of The Sea': 'Samen der See',
        'Stun': 'Betäubung',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Engage!': 'À l\'attaque !',
        'Kaliya': 'Kaliya',
        'The Core Override is no longer sealed': 'Ouverture de l\'unité de contrôle du Cœur',
        'The Core Override will be sealed off': 'Fermeture de l\'unité de contrôle du Cœur',
      },
      'replaceText': {
        'Barofield': 'Barotraumatisme',
        'Emergency Mode': 'Mode d\'urgence',
        'Enrage': 'Enrage',
        'Main Head': 'Tête principale',
        'Nanospore Jet': 'Jet de magismoparticules',
        'Nerve Cloud': 'Nuage neurotoxique',
        'Nerve Gas': 'Gaz neurotoxique',
        'Resonance': 'Résonance',
        'Secondary Head': 'Tête secondaire',
        'Seed Of The Rivers': 'Germe de la rivière',
        'Seed Of The Sea': 'Germe de la mer',
        'Stun': 'Étourdissement',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Engage!': '戦闘開始！',
        'Kaliya': 'カーリア',
        'The Core Override is no longer sealed': 'The Core Override is no longer sealed', // FIXME
        'The Core Override will be sealed off': 'The Core Override will be sealed off', // FIXME
      },
      'replaceText': {
        'Barofield': 'バロフィールド',
        'Emergency Mode': 'イマージャンシーモード',
        'Enrage': 'Enrage',
        'Main Head': 'メインヘッド',
        'Nanospore Jet': '魔科学粒子散布',
        'Nerve Cloud': 'ナーブクラウド',
        'Nerve Gas': 'ナーブガス',
        'Resonance': 'レゾナンス',
        'Secondary Head': 'サブヘッド',
        'Seed Of The Rivers': 'シード・オブ・リバー',
        'Seed Of The Sea': 'シード・オブ・シー',
        'Stun': 'スタン',
      },
    },
  ],
}];
