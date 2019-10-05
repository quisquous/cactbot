'use strict';

// Triggers for all occasions and zones.
[{
  zoneRegex: /.*/,
  triggers: [
    {
      id: 'General Provoke',
      regex: /:(\y{Name}):1D6D:Provoke:/,
      regexDe: /:(\y{Name}):1D6D:Herausforderung:/,
      regexFr: /:(\y{Name}):1D6D:Provocation:/,
      condition: function(data) {
        return data.role == 'tank';
      },
      infoText: function(data, matches) {
        return {
          en: 'Provoke: ' + data.ShortName(matches[1]),
          de: 'Herausforderung: ' + data.ShortName(matches[1]),
          fr: 'Provocation: ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'General Shirk',
      regex: /:(\y{Name}):1D71:Shirk:/,
      regexDe: /:(\y{Name}):1D71:Geteiltes Leid:/,
      regexFr: /:(\y{Name}):1D71:Dérobade:/,
      regexJa: /:(\y{Name}):1D71:シャーク:/,
      condition: function(data) {
        return data.role == 'tank';
      },
      infoText: function(data, matches) {
        return {
          en: 'Shirk: ' + data.ShortName(matches[1]),
          de: 'Geteiltes Leid: ' + data.ShortName(matches[1]),
          fr: 'Dérobade: ' + data.ShortName(matches[1]),
          ja: 'シャーク: ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'General Holmgang',
      regex: /:(\y{Name}):2B:Holmgang:/,
      regexDe: /:(\y{Name}):2B:Holmgang:/,
      regexFr: /:(\y{Name}):2B:Holmgang:/,
      regexJa: /:(\y{Name}):2B:ホルムギャング:/,
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      infoText: function(data, matches) {
        return 'Holmgang: ' + data.ShortName(matches[1]);
      },
    },
    {
      id: 'General Hallowed',
      regex: /:(\y{Name}):1E:Hallowed Ground:/,
      regexDe: /:(\y{Name}):1E:Heiliger Boden:/,
      regexFr: /:(\y{Name}):1E:Invincible:/,
      regexJa: /:(\y{Name}):1E:インビンシブル:/,
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      infoText: function(data, matches) {
        return {
          en: 'Hallowed: ' + data.ShortName(matches[1]),
          de: 'Heiliger Boden: ' + data.ShortName(matches[1]),
          fr: 'Invincible: ' + data.ShortName(matches[1]),
          ja: 'インビンシブル: ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'General Superbolide',
      regex: /:(\y{Name}):3F18:Superbolide:/,
      regexDe: /:(\y{Name}):3F18:Meteoritenfall:/,
      regexFr: /:(\y{Name}):3F18:Bolide:/,
      regexJa: /:(\y{Name}):3F18:ボーライド:/,
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      infoText: function(data, matches) {
        return {
          en: 'Bolide: ' + data.ShortName(matches[1]),
          de: 'Meteoritenfall: ' + data.ShortName(matches[1]),
          fr: 'Bolide: ' + data.ShortName(matches[1]),
          ja: 'ボーライド: ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'General Living',
      regex: /:(\y{Name}):E36:Living Dead:/,
      regexDe: /:(\y{Name}):E36:Totenerweckung:/,
      regexFr: /:(\y{Name}):E36:Mort-Vivant:/,
      regexJa: /:(\y{Name}):E36:リビングデッド:/,
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      infoText: function(data, matches) {
        return {
          en: 'Living: ' + data.ShortName(matches[1]),
          de: 'Totenerweckung: ' + data.ShortName(matches[1]),
          fr: 'Mort-vivant: ' + data.ShortName(matches[1]),
          ja: 'リビングデッド: ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'General Walking',
      regex: /1A:\y{ObjectId}:(\y{Name}) gains the effect of Walking Dead/,
      regexDe: /1A:\y{ObjectId}:(\y{Name}) gains the effect of Erweckter/,
      regexFr: /1A:\y{ObjectId}:(\y{Name}) gains the effect of Marcheur Des Limbes/,
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      infoText: function(data, matches) {
        return {
          en: 'Walking: ' + data.ShortName(matches[1]),
          de: 'Erweckter: ' + data.ShortName(matches[1]),
          fr: 'Marcheur Des Limbes: ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'General Ready check',
      regex: /:(?:(\y{Name}) has initiated|You have commenced) a ready check\./,
      regexDe: /:(?:(\y{Name}) hat|Du hast) eine Bereitschaftsanfrage gestellt\./,
      regexFr: /:Un appel de préparation a été lancé par (\y{Name})\./,
      sound: '../../resources/sounds/Overwatch/D.Va_-_Game_on.ogg',
      soundVolume: 0.6,
    },
  ],
}];
