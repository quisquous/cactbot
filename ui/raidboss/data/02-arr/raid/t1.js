'use strict';

[{
  zoneRegex: /The Binding Coil Of Bahamut - Turn \(1\)/,
  triggers: [
    {
      id: 'T1 Silence',
      regex: / 14:5A7:Ads starts using High Voltage/,
      regexDe: / 14:5A7:Abwehrsystem starts using Hochstrom/,
      regexFr: / 14:5A7:Sphère De Contrôle starts using Haute Tension/,
      regexJa: / 14:5A7:制御システム starts using 高圧電流/,
      condition: function(data) {
        return data.CanSilence();
      },
      alertText: {
        en: 'Silence',
      },
    },
    {
      id: 'T1 Initiated',
      regex: / 15:\y{ObjectId}:Caduceus:4B8:Hood Swing:/,
      regexDe: / 15:\y{ObjectId}:Caduceus:4B8:Kapuzenschwung:/,
      regexFr: / 15:\y{ObjectId}:Caducée:4B8:Coup de capot:/,
      regexJa: / 15:\y{ObjectId}:カドゥケウス:4B8:フードスイング:/,
      run: function(data) {
        data.started = true;
      },
    },
    {
      regex: / 1[56]:\y{ObjectId}:Caduceus:4BA:Regorge:\y{ObjectId}:(\y{Name}):/,
      regexDe: / 1[56]:\y{ObjectId}:Caduceus:4BA:Auswürgen:\y{ObjectId}:(\y{Name}):/,
      regexFr: / 1[56]:\y{ObjectId}:Caducée:4BA:Vomissure:\y{ObjectId}:(\y{Name}):/,
      regexJa: / 1[56]:\y{ObjectId}:カドゥケウス:4BA:リゴージ:\y{ObjectId}:(\y{Name}):/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Spit on YOU',
      },
    },
    {
      id: 'T1 Split',
      regex: / 03:\y{ObjectId}:Added new combatant Caduceus\./,
      regexDe: / 03:\y{ObjectId}:Added new combatant Caduceus\./,
      regexFr: / 03:\y{ObjectId}:Added new combatant Caducée\./,
      regexJa: / 03:\y{ObjectId}:Added new combatant カドゥケウス\./,
      suppressSeconds: 5,
      condition: function(data) {
        return data.started;
      },
      alertText: {
        en: 'Split',
      },
    },
    {
      id: 'T1 Hood Swing',
      regex: / 1[56]:\y{ObjectId}:Caduceus:4B8:Hood Swing:\y{ObjectId}:(\y{Name}):/,
      regexDe: / 1[56]:\y{ObjectId}:Caduceus:4B8:Kapuzenschwung:\y{ObjectId}:(\y{Name}):/,
      regexFr: / 1[56]:\y{ObjectId}:Caducée:4B8:Coup de capot:\y{ObjectId}:(\y{Name}):/,
      regexJa: / 1[56]:\y{ObjectId}:カドゥケウス:4B8:フードスイング:\y{ObjectId}:(\y{Name}):/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      delaySeconds: 8,
      suppressSeconds: 5,
      infoText: {
        en: 'Hood Swing in 10',
      },
    },
    {
      id: 'T1 Slime Timer First',
      regex: / 00:0839:The Allagan megastructure will be sealed off/,
      delaySeconds: 35,
      suppressSeconds: 5,
      infoText: {
        en: 'Slime Soon',
      },
    },
    {
      id: 'T1 Slime Timer',
      regex: / 03:\y{ObjectId}:Added new combatant Dark Matter Slime\./,
      regexDe: / 03:\y{ObjectId}:Added new combatant Dunkelmaterien-Schleim\./,
      regexFr: / 03:\y{ObjectId}:Added new combatant Gluant De Matière Sombre\./,
      regexJa: / 03:\y{ObjectId}:Added new combatant ダークマター・スライム\./,
      delaySeconds: 35,
      suppressSeconds: 5,
      infoText: {
        en: 'Slime Soon',
      },
    },
  ],
}];
