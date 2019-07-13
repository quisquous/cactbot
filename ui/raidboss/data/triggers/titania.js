'use strict';

// say grab mobs, group on west mustardseed?
// test mist failure
// test which phantoms are random
// is divination still a cleave?
// what does puck's rebuke do here?

// Titania Normal Mode
[{
  zoneRegex: /^The Dancing Plague$/,
  timelineFile: 'titania.txt',
  triggers: [
    {
      id: 'Titania Phantom Out',
      regex: /14:3D5D:Titania starts using Phantom Rune/,
      alertText: {
        en: 'Out',
      },
    },
    {
      id: 'Titania Phantom In',
      regex: /14:3D5E:Titania starts using Phantom Rune/,
      alertText: {
        en: 'In',
      },
    },
    {
      id: 'TitaniaEx Mist Failure',
      regex: /03:\y{ObjectId}:Added new combatant Spirit Of Dew\./,
      infoText: {
        en: 'Kill Extra Add',
      },
    },
    {
      id: 'Titania Mist',
      regex: /14:3D45:Titania starts using Mist Rune/,
      infoText: {
        en: 'Water Positions',
      },
    },
    {
      id: 'Titania Flame',
      regex: /14:3D47:Titania starts using Flame Rune/,
      // You have 14 seconds until the first stack damage.
      delaySeconds: 6,
      alertText: {
        en: 'Stack Positions',
      },
    },
    {
      id: 'Titania Divination',
      regex: /14:3D5B:Titania starts using Divination Rune on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Cleave on YOU',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches[1] != data.me) {
          return {
            en: 'Tank Cleave on ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'Titania Frost Rune 1',
      regex: /14:3D2A:Titania starts using Frost Rune/,
      infoText: {
        en: 'Get Middle, Shiva Circles',
      },
    },
    {
      id: 'Titania Frost Rune 2',
      regex: /14:3D2A:Titania starts using Frost Rune/,
      delaySeconds: 6.5,
      infoText: {
        en: 'Run Out',
      },
    },
    {
      id: 'Titania Frost Rune 3',
      regex: /1[56]:\y{ObjectId}:Titania:3D4E:Frost Rune:/,
      suppressSeconds: 60,
      infoText: {
        en: 'Run In',
      },
    },
    {
      id: 'Titania Growth Rune',
      regex: /14:3D2E:Titania starts using Growth Rune/,
      infoText: {
        en: 'Roots',
      },
    },
    {
      id: 'Titania Uplift Markers',
      regex: /1B:\y{ObjectId}:(\y{Name}):....:....:008B:0000:0000:0000:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Spread',
      },
    },
    {
      id: 'Titania Peasebomb Markers',
      regex: /1B:\y{ObjectId}:(\y{Name}):....:....:008D:0000:0000:0000:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Spread',
      },
    },
    {
      id: 'TitaniaEx Pucks Breath Markers',
      regex: /1B:\y{ObjectId}:(\y{Name}):....:....:00A1:0000:0000:0000:/,
      alertText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Stack on YOU',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches[1]),
        };
      },
    },
  ],
}];
