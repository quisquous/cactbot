// Triggers for all occasions and zones.
[{
  zoneRegex: /.*/,
  triggers: [
    {
      id: 'General Provoke',
      regex: /:(\y{Name}):1D6D:Provoke:/,
      condition: function(data) { return data.role == 'tank' },
      infoText: function(data, matches) {
        return 'Provoke: ' + data.ShortName(matches[1]);
      },
      tts: function(data, matches) {
        return 'provoke ' + data.ShortName(matches[1]);
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
      condition: function(data) { return data.role == 'tank' },
      infoText: function(data, matches) {
        return 'Shirk: ' + data.ShortName(matches[1]);
      },
      tts: function(data, matches) {
        return 'shirk ' + data.ShortName(matches[1]);
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
      condition: function(data) { return data.role == 'tank' },
      infoText: function(data, matches) {
        return 'Hallowed: ' + data.ShortName(matches[1]);
      },
      tts: function(data, matches) {
        return 'hallowed ' + data.ShortName(matches[1]);
      },
    },
    {
      id: 'General Living',
      regex: /:(\y{Name}):E36:Living Dead:/,
      condition: function(data) { return data.role == 'tank' },
      infoText: function(data, matches) {
        return 'Living: ' + data.ShortName(matches[1]);
      },
      tts: function(data, matches) {
        return 'living ' + data.ShortName(matches[1]);
      },
    },
    {
      id: 'General Walking',
      regex: /:(\y{Name}) gains the effect of Walking Dead/,
      condition: function(data) { return data.role == 'tank' },
      infoText: function(data, matches) {
        return 'Walking: ' + data.ShortName(matches[1]);
      },
      tts: function(data, matches) {
        return 'walking ' + data.ShortName(matches[1]);
      },
    },
    {
      id: 'General Ready check',
      regex: /:(?:(\y{Name}) has initiated|You have commenced) a ready check\./,
      sound: '../../resources/sounds/Overwatch/D.Va_-_Game_on.ogg',
      soundVolume: 0.6,
    },
  ],
}];
