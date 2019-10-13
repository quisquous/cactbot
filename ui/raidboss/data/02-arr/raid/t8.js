'use strict';

[{
  zoneRegex: /^The Second Coil Of Bahamut - Turn \(3\)$/,
  timelineFile: 't8.txt',
  triggers: [
    {
      id: 'T8 Stack',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0011:/,
      infoText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Laser Stack on YOU',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'T8 Landmine Start',
      regex: / 00:0839:Landmines have been scattered/,
      alertText: {
        en: 'Explode Landmines',
      },
      run: function(data) {
        data.landmines = {};
      },
    },
    {
      id: 'T8 Landmine Explosion',
      regex: / 1[56]:(\y{ObjectId}):Allagan Mine:7D1:Triggered Landmine:/,
      regexDe: / 1[56]:(\y{ObjectId}):Allagische Mine:7D1:Landmine:/,
      regexFr: / 1[56]:(\y{ObjectId}):Mine Allagoise:7D1:Explosion de mine:/,
      regexJa: / 1[56]:(\y{ObjectId}):アラガンマイン:7D1:地雷爆発:/,
      infoText: function(data, matches) {
        if (matches[1] in data.landmines)
          return;
        return (Object.keys(data.landmines).length + 1) + ' / 3';
      },
      tts: function(data, matches) {
        if (matches[1] in data.landmines)
          return;
        return (Object.keys(data.landmines).length + 1);
      },
      run: function(data, matches) {
        data.landmines[matches[1]] = true;
      },
    },
    {
      id: 'T8 Homing Missile Warning',
      regex: / 23:\y{ObjectId}:(\y{Name}):\y{ObjectId}:The Avatar:....:....:0005:/,
      regexDe: / 23:\y{ObjectId}:(\y{Name}):\y{ObjectId}:Avatar:....:....:0005:/,
      regexFr: / 23:\y{ObjectId}:(\y{Name}):\y{ObjectId}:Bio-Tréant:....:....:0005:/,
      regexJa: / 23:\y{ObjectId}:(\y{Name}):\y{ObjectId}:アバター:....:....:0005:/,
      suppressSeconds: 6,
      infoText: function(data, matches) {
        return {
          en: 'Missile Tether (on ' + data.ShortName(matches[1]) + ')',
        };
      },
    },
    {
      id: 'T8 Brainjack',
      regex: / 14:7C3:The Avatar starts using Brainjack on (\y{Name})\./,
      regexDe: / 14:7C3:Avatar starts using Gehirnwäsche on (\y{Name})\./,
      regexFr: / 14:7C3:Bio-Tréant starts using Détournement Cérébral on (\y{Name})\./,
      regexJa: / 14:7C3:アバター starts using ブレインジャック on (\y{Name})\./,
      alertText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Brainjack on YOU',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me != matches[1]) {
          return {
            en: 'Brainjack on ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'T8 Allagan Field',
      regex: / 14:7C4:The Avatar starts using Allagan Field on (\y{Name})\./,
      regexDe: / 14:7C4:Avatar starts using Allagisches Feld on (\y{Name})\./,
      regexFr: / 14:7C4:Bio-Tréant starts using Champ Allagois on (\y{Name})\./,
      regexJa: / 14:7C4:アバター starts using アラガンフィールド on (\y{Name})\./,
      alertText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Allagan Field on YOU',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me != matches[1]) {
          return {
            en: 'Allagan Field on ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'T8 Dreadnaught',
      regex: / 03:\y{ObjectId}:Added new combatant Clockwork Dreadnaught\./,
      regexDe: / 03:\y{ObjectId}:Added new combatant Brummonaut\./,
      regexFr: / 03:\y{ObjectId}:Added new combatant Cuirassé Dreadnaught\./,
      regexJa: / 03:\y{ObjectId}:Added new combatant ドレッドノート\./,
      infoText: {
        en: 'Dreadnaught Add',
      },
    },
  ],
}];
