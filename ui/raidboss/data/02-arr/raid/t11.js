'use strict';

[{
  zoneRegex: /The Final Coil Of Bahamut - Turn \(2\)/,
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
      },
    },
    {
      id: 'T11 Tether Accumulate A',
      regex: / 23:\y{ObjectId}:(\y{Name}):\y{ObjectId}:Kaliya:....:....:001C:/,
      regexDe: / 23:\y{ObjectId}:(\y{Name}):\y{ObjectId}:Kaliya:....:....:001C:/,
      regexFr: / 23:\y{ObjectId}:(\y{Name}):\y{ObjectId}:Kaliya:....:....:001C:/,
      regexJa: / 23:\y{ObjectId}:(\y{Name}):\y{ObjectId}:カーリア:....:....:001C:/,
      run: function(data, matches) {
        data.tetherA = data.tetherA || [];
        data.tetherA.push(matches[1]);
      },
    },
    {
      id: 'T11 Tether Accumulate B',
      regex: / 23:\y{ObjectId}:(\y{Name}):\y{ObjectId}:Kaliya:....:....:001D:/,
      regexDe: / 23:\y{ObjectId}:(\y{Name}):\y{ObjectId}:Kaliya:....:....:001D:/,
      regexFr: / 23:\y{ObjectId}:(\y{Name}):\y{ObjectId}:Kaliya:....:....:001D:/,
      regexJa: / 23:\y{ObjectId}:(\y{Name}):\y{ObjectId}:カーリア:....:....:001D:/,
      run: function(data, matches) {
        data.tetherB = data.tetherB || [];
        data.tetherB.push(matches[1]);
      },
    },
    {
      id: 'T11 Tether A',
      regex: / 23:\y{ObjectId}:\y{Name}:\y{ObjectId}:Kaliya:....:....:001C:/,
      regexDe: / 23:\y{ObjectId}:\y{Name}:\y{ObjectId}:Kaliya:....:....:001C:/,
      regexFr: / 23:\y{ObjectId}:\y{Name}:\y{ObjectId}:Kaliya:....:....:001C:/,
      regexJa: / 23:\y{ObjectId}:\y{Name}:\y{ObjectId}:カーリア:....:....:001C:/,
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
        };
      },
    },
    {
      id: 'T11 Tether B',
      regex: / 23:\y{ObjectId}:\y{Name}:\y{ObjectId}:Kaliya:....:....:001D:/,
      regexDe: / 23:\y{ObjectId}:\y{Name}:\y{ObjectId}:Kaliya:....:....:001D:/,
      regexFr: / 23:\y{ObjectId}:\y{Name}:\y{ObjectId}:Kaliya:....:....:001D:/,
      regexJa: / 23:\y{ObjectId}:\y{Name}:\y{ObjectId}:カーリア:....:....:001D:/,
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
        };
      },
    },
    {
      id: 'T11 Tether Cleanup',
      regex: /16:\y{ObjectId}:Kaliya:B7B:Nanospore Jet:/,
      regexDe: / 16:\y{ObjectId}:Kaliya:B7B:Nanosporen-Strahl:/,
      regexFr: / 16:\y{ObjectId}:Kaliya:B7B:Jet de magismoparticules:/,
      regexJa: / 16:\y{ObjectId}:カーリア:B7B:魔科学粒子散布:/,
      run: function(data) {
        delete data.tetherA;
        delete data.tetherB;
      },
    },
  ],
}];
