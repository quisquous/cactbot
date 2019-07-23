'use strict';

// Titania Normal Mode
[{
  zoneRegex: /^The Dancing Plague$/,
  timelineFile: 'titania.txt',
  triggers: [
    {
      id: 'Titania Bright Sabbath',
      regex: /14:3D5C:Titania starts using Bright Sabbath/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
      },
    },
    {
      id: 'Titania Phantom Out',
      regex: /14:3D5D:Titania starts using Phantom Rune/,
      alertText: {
        en: 'Out',
        fr: 'Dehors',
      },
    },
    {
      id: 'Titania Phantom In',
      regex: /14:3D5E:Titania starts using Phantom Rune/,
      alertText: {
        en: 'In',
        fr: 'Dedans',
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
        fr: 'Position pour l\'eau',
      },
    },
    {
      id: 'Titania Flame',
      regex: /14:3D47:Titania starts using Flame Rune/,
      delaySeconds: 6,
      alertText: {
        en: 'Stack In Puddles',
        fr: 'Packez-vous',
      },
    },
    {
      id: 'Titania Divination',
      regex: /14:3D5B:Titania starts using Divination Rune on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Cleave on YOU',
            fr: 'Tank cleave sur vous',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches[1] != data.me) {
          return {
            en: 'Tank Cleave on ' + data.ShortName(matches[1]),
            fr: 'Tank cleave sur ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'Titania Frost Rune 1',
      regex: /14:3D2A:Titania starts using Frost Rune/,
      infoText: {
        en: 'Get Middle, Shiva Circles',
        fr: 'Allez au milieu, comme sur Shiva',
      },
    },
    {
      id: 'Titania Frost Rune 2',
      regex: /14:3D2A:Titania starts using Frost Rune/,
      delaySeconds: 6.5,
      infoText: {
        en: 'Run Out',
        fr: 'Courez dehors',
      },
    },
    {
      id: 'Titania Frost Rune 3',
      regex: /1[56]:\y{ObjectId}:Titania:3D4E:Frost Rune:/,
      suppressSeconds: 60,
      infoText: {
        en: 'Run In',
        fr: 'Courez dedans',
      },
    },
    {
      id: 'Titania Growth Rune',
      regex: /14:3D2E:Titania starts using Growth Rune/,
      infoText: {
        en: 'Avoid Roots',
        fr: 'Racines',
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
        fr: 'Ecartez-vous',
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
        fr: 'Ecartez-vous',
      },
    },
    {
      id: 'TitaniaEx Pucks Breath Markers',
      regex: /1B:\y{ObjectId}:(\y{Name}):....:....:00A1:0000:0000:0000:/,
      alertText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Stack on YOU',
            fr: 'Package sur VOUS',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches[1]),
          fr: 'Packez-vous sur' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'Titania Knockback',
      regex: /15:\y{ObjectId}:Puck:3D42:Puck's Rebuke/,
      alertText: {
        en: 'Diagonal Knockback Soon',
        fr: 'Poussée en diagonale bientôt',
      },
    },
    {
      id: 'Titania Mini Add Phase',
      regex: /1[56]:\y{ObjectId}:Titania:3D31:/,
      infoText: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'Group Adds East (on Mustardseed)',
          };
        }
        return {
          en: 'Kill Mustardseed (East)',
        };
      },
    },
  ],
}];
