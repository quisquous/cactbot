'use strict';

// Ultima Weapon Ultimate
[{
  zoneRegex: /^(The Weapon's Refrain \(Ultimate\)|Unknown Zone \(309\))$/,
  timelineFile: 'ultima_weapon_ultimate.txt',
  timeline: [
    'infotext "Feather Rain" before 3 "Move!"',
  ],
  triggers: [
    {
      id: 'UWU Garuda Slipstream',
      regex: /14:2B53:Garuda starts using (?:Unknown_2B53|Slipstream)/,
      regexDe: /14:2B53:Garuda starts using (?:Unknown_2B53|Wirbelströmung)/,
      condition: function(data) {
        return data.role == 'tank';
      },
      alertText: {
        en: 'Slipstream',
        de: 'Wirbelströmung',
      },
      tts: {
        en: 'Slipstream',
        de: 'Wirbelströmung',
      },
    },
    {
      id: 'UWU Garuda Mistral Song Marker',
      regex: / 1B:........:(\y{Name}):....:....:0010:0000:0000:0000:/,
      suppressSeconds: 5,
      infoText: {
        en: 'Mistral Song',
        de: 'Mistral-Song',
      },
      tts: {
        en: 'Mistral Song',
        de: 'Mistral-Song',
      },
    },
    {
      id: 'UWU Garuda Spiny Plume',
      regex: / 03:Added new combatant Spiny Plume/,
      regexDe: / 03:Added new combatant Dorniger Federsturm/,
      condition: function(data, matches) {
        return data.role == 'tank';
      },
      infoText: {
        en: 'Spiny Plume Add',
        de: 'Dorniger Federsturm',
      },
      tts: {
        en: 'Spiny Plume Add',
        de: 'Dorniger Federsturm',
      },
    },
    {
      id: 'UWU Ifrit Fetters',
      regex: /1A:(\y{Name}) gains the effect of Infernal Fetters from/,
      regexDe: /1A:(\y{Name}) gains the effect of Infernofesseln from/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      suppressSeconds: 45,
      alertText: {
        en: 'Fetters on YOU',
        de: 'Fesseln auf DIR',
      },
      tts: {
        en: 'Fetters',
        de: 'Fesseln',
      },
    },
    {
      id: 'UWU Searing Wind',
      regex: / 14:2B5B:Ifrit starts using Inferno Howl on (\y{Name})/,
      regexDe: / 14:2B5B:Ifrit starts using Brennende Wut on (\y{Name})/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alarmText: {
        en: 'Searing Wind on YOU',
        de: 'Versengen auf DIR',
      },
      tts: {
        en: 'Searing Wind',
        de: 'Versengen',
      },
    },
    {
      id: 'UWU Ifrit Flaming Crush',
      regex: / 1B:........:(\y{Name}):....:....:0075:0000:0000:0000:/,
      alertText: {
        en: 'Stack',
        de: 'Stack',
      },
      tts: {
        en: 'Stack',
        de: 'Stek',
      },
    },
    {
      id: 'UWU Garuda Woken',
      regex: / 1A:Garuda gains the effect of Woken from/,
      regexDe: / 1A:Garuda gains the effect of Ätherüberladung from/,
      sound: 'Long',
    },
    {
      id: 'UWU Ifrit Woken',
      regex: / 1A:Ifrit gains the effect of Woken from/,
      regexDe: / 1A:Ifrit gains the effect of Ätherüberladung from/,
      sound: 'Long',
    },
    {
      id: 'UWU Titan Woken',
      regex: / 1A:Titan gains the effect of Woken from/,
      regexDe: / 1A:Titan gains the effect of Ätherüberladung from/,
      sound: 'Long',
    },
    {
      id: 'UWU Titan Gaols',
      regex: / 15:\y{ObjectId}:(?:Garuda:2B6C|Titan:2B6B):Rock Throw:\y{ObjectId}:(\y{Name}):/,
      regexDe: / 15:\y{ObjectId}:(?:Garuda:2B6C|Titan:2B6B):Granitgefängnis:\y{ObjectId}:(\y{Name}):/,
      preRun: function(data, matches) {
        data.titanGaols = data.titanGaols || [];
        data.titanGaols.push(matches[1]);
        if (data.titanGaols.length == 3)
          data.titanGaols.sort();
      },
      alertText: function(data, matches) {
        if (data.titanGaols.length != 3)
          return;
        let idx = data.titanGaols.indexOf(data.me);
        if (idx < 0)
          return;
        // Just return your number.
        return idx + 1;
      },
      infoText: function(data, matches) {
        if (data.titanGaols.length != 3)
          return;
        // Return all the people in order.
        return data.titanGaols.map(function(n) {
          return data.ShortName(n);
        }).join(', ');
      },
    },
    {
      // If anybody dies to bombs (WHY) and a rock is on them, then glhf.
      id: 'UWU Titan Bomb Failure',
      regex: / 15:\y{ObjectId}:Bomb Boulder:2B6A:Burst:\y{ObjectId}:(\y{Name}):/,
      regexDe: / 15:\y{ObjectId}:Bomber-Brocken:2B6A:Zerschmetterung:\y{ObjectId}:(\y{Name}):/,
      infoText: function(data, matches) {
        if (!data.titanGaols)
          return;
        if (data.titanGaols.indexOf(matches[1]) < 0)
          return;
        return {
          en: data.ShortName(matches[1]) + ' died',
          de: data.ShortName(matches[1]) + ' gestorben',
        };
      },
    },
    {
      // Cleanup
      regex: / 15:\y{ObjectId}:(?:Garuda:2B6C|Titan:2B6B):Rock Throw:\y{ObjectId}:\y{Name}/,
      regexDe: / 15:\y{ObjectId}:(?:Garuda:2B6C|Titan:2B6B):Granitgefängnis:\y{ObjectId}:\y{Name}/,
      delaySeconds: 15,
      run: function(data) {
        delete data.titanGaols;
      },
    },
    {
      id: 'UWU Garuda Finale',
      regex: /:The Ultima Weapon:2CD3:/,
      infoText: {
        en: 'Garuda',
      },
    },
    {
      id: 'UWU Ifrit Finale',
      regex: /:The Ultima Weapon:2CD4:/,
      infoText: {
        en: 'Ifrit',
      },
    },
    {
      id: 'UWU Titan Finale',
      regex: /:The Ultima Weapon:2CD5:/,
      infoText: {
        en: 'Titan',
      },
    },
  ],
}];
