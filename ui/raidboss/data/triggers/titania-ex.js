'use strict';

// Titania Extreme
[{
  zoneRegex: /The Dancing Plague \(Extreme\)/,
  timelineFile: 'titania-ex.txt',
  triggers: [
    {
      id: 'TitaniaEx Phantom Out',
      regex: /14:3D4C:Titania starts using Phantom Rune/,
      alertText: {
        en: 'Out',
      },
    },
    {
      id: 'TitaniaEx Phantom In',
      regex: /14:3D4D:Titania starts using Phantom Rune/,
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
      id: 'TitaniaEx Mist',
      regex: /14:3D45:Titania starts using Mist Rune/,
      infoText: function(data) {
        if (data.seenMistRune) {
          return {
            en: 'In/Out, then Water Positions',
          };
        }
        return {
          en: 'Water Positions',
        };
      },
      run: function(data) {
        data.seenMistRune = true;
      },
    },
    {
      id: 'TitaniaEx Flame',
      regex: /14:3D47:Titania starts using Flame Rune/,
      // You have 16.5 seconds until the first stack damage.
      delaySeconds: 8.5,
      alertText: function(data) {
        if (data.seenFlameRune) {
          return {
            en: 'Stack (maybe rotate?)',
          };
        }
        return {
          en: 'Stack Positions',
        };
      },
      run: function(data) {
        data.seenFlameRune = true;
      },
    },
    {
      id: 'TitaniaEx Divination',
      regex: /14:3D4A:Titania starts using Divination Rune on (\y{Name})/,
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
      id: 'TitaniaEx Bramble 1',
      regex: /14:42D7:Titania starts using Chain Of Brambles/,
      infoText: {
        en: 'Wait For Tethers In Center',
      },
    },
    {
      id: 'TitaniaEx Bramble 2',
      regex: /14:42D7:Titania starts using Chain Of Brambles/,
      delaySeconds: 3,
      alertText: {
        en: 'Run!',
      },
    },
    {
      id: 'TitaniaEx Bramble Knockback',
      regex: /15:\y{ObjectId}:Puck:3D42:Puck's Rebuke/,
      alertText: {
        en: 'Diagonal Knockback Soon',
      },
    },
    {
      id: 'TitaniaEx Fae Light',
      regex: /14:3D2C:Titania starts using Fae Light/,
      alertText: function(data, matches) {
        if (data.role == 'tank' || data.role == 'healer') {
          return {
            en: 'Tank Buster',
            de: 'Tankbuster',
            fr: 'Tankbuster',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.role != 'tank' && data.role != 'healer') {
          return {
            en: 'Tank Cleave',
          };
        }
      },
    },
    {
      id: 'TitaniaEx Frost Rune 1',
      regex: /14:3D2A:Titania starts using Frost Rune/,
      infoText: {
        en: 'Get Middle, Shiva Circles',
      },
    },
    {
      id: 'TitaniaEx Frost Rune 2',
      regex: /14:3D2A:Titania starts using Frost Rune/,
      delaySeconds: 6.5,
      infoText: {
        en: 'Run Out',
      },
    },
    {
      id: 'TitaniaEx Frost Rune 3',
      regex: /1[56]:\y{ObjectId}:Titania:3D2B:Frost Rune:/,
      suppressSeconds: 60,
      infoText: {
        en: 'Run In',
      },
    },
    {
      id: 'TitaniaEx Growth Rune',
      regex: /14:3D2E:Titania starts using Growth Rune/,
      infoText: {
        en: 'Roots',
      },
    },
    {
      id: 'TitaniaEx Uplift Markers',
      regex: /1B:\y{ObjectId}:(\y{Name}):....:....:008A:0000:0000:0000:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Spread',
      },
    },
    {
      id: 'TitaniaEx Hard Swipe',
      regex: /14:3D36:Peaseblossom starts using Hard Swipe on (\y{Name})/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Tank Buster',
        de: 'Tankbuster',
        fr: 'Tankbuster',
      },
    },
    {
      id: 'TitaniaEx Pummel',
      regex: /14:3D37:Puck starts using Pummel on (\y{Name})/,
      condition: function(data) {
        return data.role == 'tank';
      },
      preRun: function(data) {
        data.pummelCount = data.pummelCount || 0;
        data.pummelCount++;
      },
      infoText: function(data) {
        return {
          en: 'Pummel ' + data.pummelCount,
        };
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
    {
      id: 'TitaniaEx Thunder Tether',
      regex: /23:\y{ObjectId}:Titania:\y{ObjectId}:\y{Name}:....:....:0054:/,
      suppressSeconds: 60,
      alertText: {
        en: 'Initial Thunder Tether',
      },
    },
    {
      id: 'TitaniaEx Thunder Rune',
      regex: /(^.*) 1[56]:\y{ObjectId}:Titania:3D29:Thunder Rune:/,
      preRun: function(data, matches) {
        data.thunderCount = data.thunderCount || 1;
      },
      condition: function(data, matches) {
        return data.thunderTime != matches[1];
      },
      infoText: function(data) {
        return {
          en: 'Thunder ' + data.thunderCount,
        };
      },
      run: function(data, matches) {
        data.thunderCount++;
        data.thunderTime = matches[1];
      },
    },
    {
      id: 'TitaniaEx Thunder Cleanup',
      regex: /14:3D32:Titania starts using Being Mortal/,
      run: function(data) {
        delete data.thunderCount;
      },
    },
  ],
}];
