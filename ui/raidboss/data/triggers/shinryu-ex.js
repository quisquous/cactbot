// Shinryu Extreme
[{
  zoneRegex: /^The Minstrel's Ballad: Shinryu's Domain$/,
  triggers: [
    {
      regex: /starts using Akh Morn/,
      alertText: function(data) {
        return "akh morn";
      },
    },
    {
      regex: /starts using Diamond Dust/,
      alertText: function(data) {
        return "floor ice";
      },
    },
    {
      regex: /starts using Dragonfist/,
      alertText: function(data) {
        return "middle fist";
      },
    },
    {
      regex: /starts using Earth Breath/,
      alertText: function(data) {
        return "shakers";
      },
    },
    {
      regex: /starts using Hellfire/,
      alertText: function(data) {
        return "get in any water";
      },
    },
    {
      regex: /starts using Hypernova/,
      alertText: function(data) {
        return "get in shared water";
      },
    },
    {
      regex: /starts using Judgement Bolt/,
      alertText: function(data) {
        return "get out of water";
      },
    },
    {
      regex: /starts using Levinbolt/,
      alertText: function(data) {
        return "spread out, out of water";
      },
    },
    {
      regex: /starts using Summon Icicle/,
      alertText: function(data) {
        return "look back at icicles";
      },
    },
    {
      regex: /starts using Tail Slap/,
      alertText: function(data) {
        return "kill tail";
      },
    },
    {
      regex: /starts using Tidal Wave/,
      alertText: function(data) {
        return "look for water";
      },
    },
  ]
}]
