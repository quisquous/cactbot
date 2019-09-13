'use strict';

// TODO: Missing Growing tethers on boss 2.
// (Maybe gather party member names on the previous TIIIIMBEEEEEER cast for comparison?)
// TODO: Failing to interrupt Dohnfaust Fuath on Watering Wheel casts?
// (15:........:Dohnfast Fuath:3DAA:Watering Wheel:........:(\y{Name}):)

[{
  zoneRegex: /^Dohn Mheg$/,
  damageWarn: {
    'Dohn Mheg Geyser': '2260', // Water eruptions, boss 1
    'Dohn Mheg Hydrofall': '22BD', // Ground AoE marker, boss 1
    'Dohn Mheg Laughing Leap': '2294', // Ground AoE marker, boss 1
    'Dohn Mheg Swinge': '22CA', // Frontal cone, boss 2
    'Dohn Mheg Canopy': '3DB0', // Frontal cone, Dohnfaust Rowans throughout instance
    'Dohn Mheg Pinecone Bomb': '3DB1', // Circular ground AoE marker, Dohnfaust Rowans throughout instance
    'Dohn Mheg Bile Bombardment': '34EE', // Ground AoE marker, boss 3
    'Dohn Mheg Corrosive Bile': '34EC', // Frontal cone, boss 3
    'Dohn Mheg Flailing Tentacles': '3681',

  },
  triggers: [
    {
      id: 'Dohn Mheg Imp Choir',
      regex: / 1A:........:(\y{Name}) gains the effect of Imp/,
      mistake: function(e, data, matches) {
        return { type: 'warn', blame: matches[1], text: 'Shouldn\'t have looked!' };
      },
    },
    {
      id: 'Dohn Mheg Toad Choir',
      regex: / 1A:........:(\y{Name}) gains the effect of Toad/,
      mistake: function(e, data, matches) {
        return { type: 'warn', blame: matches[1], text: 'Ribbit!' };
      },
    },
    {
      id: 'Dohn Mheg Fool\'s Tumble',
      regex: / 1A:........:(\y{Name}) gains the effect of Fool's Tumble/,
      mistake: function(e, data, matches) {
        return { type: 'warn', blame: matches[1], text: 'Fell down' };
      },
    },
  ],
}];
