[{
  zoneRegex: /^The Drowned City Of Skalla$/,
  triggers: [
    {
      id: 'Hrodric Tank',
      regex: /:Hrodric Poisontongue starts using Rusting Claw/,
      infoText: function(data) {
        return data.role != 'tank' ? "tank cleave" : "";
      },
      alertText: function(data) {
        return data.role == 'tank' ? "tank cleave" : "";
      },
    },
    {
      id: 'Hrodric Tail',
      regex: /:Hrodric Poisontongue starts using Tail Drive/,
      infoText: function(data) {
        return data.role == 'tank' ? "tail cleave" : "";
      },
      alertText: function(data) {
        return data.role != 'tank' ? "tail cleave" : "";
      },
    },
    {
      id: 'Hrodric Eye',
      regex: /:Hrodric Poisontongue starts using Eye Of The Fire/,
      alertText: function(data) {
        return "look away";
      },
    },
    {
      id: 'Hrodric Words',
      regex: /:Hrodric Poisontongue starts using Words Of Woe/,
      infoText: function(data) {
        return "avoid eye lasers";
      },
    },
  ]
}]
