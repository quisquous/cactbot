// Triggers for all occasions and zones.
[{
  zoneRegex: /.*/,
  triggers: [
    {
      id: 'General Provoke',
      regex: /:(\y{Name}):1D6D:Provoke:/,
      regexDe: /:(\y{Name}):1D6D:Herausforderung:/,
      condition: function(data) { return data.role == 'tank' },
      infoText: function(data, matches) {
        return {
          en: 'Provoke: ' + data.ShortName(matches[1]),
          de: 'Herausforderung: ' + data.ShortName(matches[1]),
        };
      },
      tts: function(data, matches) {
        return {
          en: 'provoke ' + data.ShortName(matches[1]),
          de: 'herausforderung ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'General Ultimatum',
      regex: /:(\y{Name}):1D73:Ultimatum:/,
      condition: function(data) { return data.role == 'tank' },
      infoText: function(data, matches) {
        return 'Ultimatum: ' + data.ShortName(matches[1]);
      },
      tts: function(data, matches) {
        return 'ultimatum ' + data.ShortName(matches[1]);
      },
    },
    {
      id: 'General Shirk',
      regex: /:(\y{Name}):1D71:Shirk:/,
      regexDe: /:(\y{Name}):1D71:Geteiltes Leid:/,
      condition: function(data) { return data.role == 'tank' },
      infoText: function(data, matches) {
        return {
          en: 'Shirk: ' + data.ShortName(matches[1]),
          de: 'Geteiltes Leid: ' + data.ShortName(matches[1]),
        };
      },
      tts: function(data, matches) {
        return {
          en: 'Shirk ' + data.ShortName(matches[1]),
          de: 'Geteiltes Leid ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'General Holmgang',
      regex: /:(\y{Name}):2B:Holmgang:/,
      condition: function(data) { return data.role == 'tank' },
      infoText: function(data, matches) {
        return 'Holmgang: ' + data.ShortName(matches[1]);
      },
      tts: function(data, matches) {
        return 'holmgang ' + data.ShortName(matches[1]);
      },
    },
    {
      id: 'General Hallowed',
      regex: /:(\y{Name}):1E:Hallowed Ground:/,
      regexDe: /:(\y{Name}):1E:Heiliger Boden:/,
      condition: function(data) { return data.role == 'tank' },
      infoText: function(data, matches) {
        return {
          en: 'Hallowed: ' + data.ShortName(matches[1]),
          de: 'Heiliger Boden: ' + data.ShortName(matches[1]),
        };
      },
      tts: function(data, matches) {
        return {
          en: 'hallowed ' + data.ShortName(matches[1]),
          de: 'Heiliger Boden ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'General Living',
      regex: /:(\y{Name}):E36:Living Dead:/,
      regexDe: /:(\y{Name}):E36:Totenerweckung:/,
      condition: function(data) { return data.role == 'tank' },
      infoText: function(data, matches) {
        return {
          en: 'Living: ' + data.ShortName(matches[1]),
          de: 'Totenerweckung: ' + data.ShortName(matches[1]),
        };
      },
      tts: function(data, matches) {
        return {
          en: 'living ' + data.ShortName(matches[1]),
          de: 'totenerweckung ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'General Walking',
      regex: /:(\y{Name}) gains the effect of Walking Dead/,
      regexDe: /:(\y{Name}) gains the effect of Erweckter/,
      condition: function(data) { return data.role == 'tank' },
      infoText: function(data, matches) {
        return {
          en: 'Walking: ' + data.ShortName(matches[1]),
          de: 'Erweckter: ' + data.ShortName(matches[1]),
        };
      },
      tts: function(data, matches) {
        return {
          en: 'walking ' + data.ShortName(matches[1]),
          de: 'erweckter ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'General Ready check',
      regex: /:(?:(\y{Name}) has initiated|You have commenced) a ready check\./,
      regexDe: /:(?:(\y{Name}) hat|hast) eine Bereitschaftsanfrage gestartet\./,
      sound: '../../resources/sounds/Overwatch/D.Va_-_Game_on.ogg',
      soundVolume: 0.6,
    },
  ],
}];
