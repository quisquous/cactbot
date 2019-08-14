'use strict';

// O4n - Deltascape 4.0 Normal

[{

  zoneRegex: /Deltascape \(V4.0\)/,
  timelineFile: 'o4n.txt',
  triggers: [
    {
      id: 'O4n Doom',
      regex: / 14:24B7:Exdeath starts using Doom/,
      condition: function(data) {
        return data.CanCleanse();
      },
      alertText: {
        en: 'Cleanse Doom soon',
      },
    },
    {
      id: 'O4n Standard Thunder',
      regex: / 14:24BD:Exdeath starts using Thunder III on (\y{Name})/,
      infoText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank buster on YOU',
          };
        }
      },
      alertText: function(data) {
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'O4n Standard Fire',
      regex: /14:24BA:Exdeath starts using Fire III on (\y{Name})/,
      alertText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Spread for Fire',
          };
        }
      },
    },
    {
      id: 'O4n Empowered Blizzard',
      regex: / 14:24C0:Exdeath starts using Blizzard III/,
      infoText: {
        en: 'Move around',
      },
    },
    {
      id: 'O4n Empowered Fire',
      regex: / 14:24BF:Exdeath starts using Fire III/,
      infoText: {
        en: 'Stop everything',
      },
    },
    {
      id: 'O4n Empowered Thunder',
      regex: / 14:24C1:Exdeath starts using Thunder III/,
      alertText: {
        en: 'Get out',
      },
    },
    {
      id: 'O4n Decisive Battle ',
      regex: / 14:2408:Exdeath starts using The Decisive Battle/,
      delaySeconds: 6,
      infoText: {
        en: 'Stand in the gap',
      },
    },
    {
      id: 'O4n Zombie Breath',
      regex: / 14:240A:Exdeath starts using Unknown_240A/,
      delaySeconds: 6,
      infoText: {
        en: 'Behind head--Avoid zombie breath',
      },
    },
    {
      id: 'O4n Black Hole',
      regex: / 14:24C8:Exdeath starts using Black Hole on Exdeath/,
      infoText: {
        en: 'Avoid black holes',
      },
    },
    {
      id: 'O4n Vacuum Wave',
      regex: / 14:24B8:Exdeath starts using Vacuum Wave on Exdeath/,
      alertText: {
        en: 'Knockback',
      },
    },
    {
      id: 'O4n Flare',
      regex: / 1B:........:(\y{Name}):....:....:0057/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Flare on YOU',
      },
    },
    {
      id: 'O4n Holy',
      regex: / 1B:........:(\y{Name}):....:....:003E/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
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
      id: 'O4n Meteor',
      regex: / 14:24C6:Exdeath starts using Meteor/,
      condition: function(data) {
        return data.role == 'healer';
      },
      alertText: {
        en: 'Heavy raid damage',
      },
    },
  ],
},
];
