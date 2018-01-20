// Triggers for all occasions and zones.
[{
  zoneRegex: /.*/,
  triggers: [
    {
      id: 'General Provoke',
      regex: /:(\y{Name}):1D6D:Provoke:/,
      condition: function(data) { return data.role == 'tank' },
      infoText: function(data, matches) {
        return 'Provoke: ' + matches[1];
      },
    },
    {
      id: 'General Ultimatum',
      regex: /:(\y{Name}):1D73:Ultimatum:/,
      condition: function(data) { return data.role == 'tank' },
      infoText: function(data, matches) {
        return 'Ultimatum: ' + matches[1];
      },
    },
    {
      id: 'General Shirk',
      regex: /:(\y{Name}):1D71:Shirk:/,
      condition: function(data) { return data.role == 'tank' },
      infoText: function(data, matches) {
        return 'Shirk: ' + matches[1];
      },
    },
    {
      id: 'General Holmgang',
      regex: /:(\y{Name}):2B:Holmgang:/,
      condition: function(data) { return data.role == 'tank' },
      infoText: function(data, matches) {
        return 'Holmgang: ' + matches[1];
      },
    },
    {
      id: 'General Hallowed',
      regex: /:(\y{Name}):1E:Hallowed Ground:/,
      condition: function(data) { return data.role == 'tank' },
      infoText: function(data, matches) {
        return 'Hallowed: ' + matches[1];
      },
    },
    {
      id: 'General Living',
      regex: /:(\y{Name}):E36:Living Dead:/,
      condition: function(data) { return data.role == 'tank' },
      infoText: function(data, matches) {
        return 'Living: ' + matches[1];
      },
    },
    {
      id: 'General Walking',
      regex: /:(\y{Name}) gains the effect of Walking Dead/,
      condition: function(data) { return data.role == 'tank' },
      infoText: function(data, matches) {
        return 'Walking: ' + matches[1];
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
