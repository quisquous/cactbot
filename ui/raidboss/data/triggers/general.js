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
      id: 'General Ultimatum',
      regex: /:(\y{Name}):1D73:Ultimatum:/,
      condition: function(data) {
        return data.role == 'tank';
      },
      infoText: function(data, matches) {
        return 'Ultimatum: ' + data.ShortName(matches[1]);
      },
    },
    {
      id: 'General Shirk',
      regex: /:(\y{Name}):1D71:Shirk:/,
      regexDe: /:(\y{Name}):1D71:Geteiltes Leid:/,
      regexFr: /:(\y{Name}):1D71:Dérobade:/,
      condition: function(data) {
        return data.role == 'tank';
      },
      infoText: function(data, matches) {
        return {
          en: 'Shirk: ' + data.ShortName(matches[1]),
          de: 'Geteiltes Leid: ' + data.ShortName(matches[1]),
          fr: 'Dérobade: ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'General Holmgang',
      regex: /:(\y{Name}):2B:Holmgang:/,
      condition: function(data) {
        return data.role == 'tank';
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
      condition: function(data) {
        return data.role == 'tank';
      },
      infoText: function(data, matches) {
        return {
          en: 'Hallowed: ' + data.ShortName(matches[1]),
          de: 'Heiliger Boden: ' + data.ShortName(matches[1]),
          fr: 'Invincible: ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'General Living',
      regex: /:(\y{Name}):E36:Living Dead:/,
      regexDe: /:(\y{Name}):E36:Totenerweckung:/,
      regexFr: /:(\y{Name}):E36:Mort-Vivant:/,
      condition: function(data) {
        return data.role == 'tank';
      },
      infoText: function(data, matches) {
        return {
          en: 'Living: ' + data.ShortName(matches[1]),
          de: 'Totenerweckung: ' + data.ShortName(matches[1]),
          fr: 'Mort-vivant: ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'General Walking',
      regex: /:(\y{Name}) gains the effect of Walking Dead/,
      regexDe: /:(\y{Name}) gains the effect of Erweckter/,
      regexFr: /:(\y{Name}) gains the effect of Marcheur Des Limbes/,
      condition: function(data) {
        return data.role == 'tank';
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
