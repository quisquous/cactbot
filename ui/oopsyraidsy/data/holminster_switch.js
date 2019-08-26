'use strict';

[{
  zoneRegex: /^Holminster Switch$/,
  damageWarn: {
    'Thumbscrew':'3DC6',
    'Light Shot':'3DC8',
    'Heretic\'s Fork':'3DCE',
    'Wooden horse':'3DC7',
    'Holy Water':'3DD4',
    'Fierce Beating':[
      '3DDD', '3DDE', '3DDF',
    ],
    'Cat O\' Nine Tails':'3DE1',
    'Right Knout':'3DE6',
    'Left Knout':'3DE7',
  },
  damageFail: {
    'Aethersup': '3DE9',
  },
  triggers: [
    {
      id: 'Holminster Flagellation',
      damageRegex: '3DD6',
      condition: function(e, data) {
        // Double taps only.
        return e.type != '15';
      },
      mistake: function(e, data) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName, };
      },
    },
    {
      id: 'Holminster Taphephobia',
      damageRegex: '4181',
      condition: function(e, data) {
        // Double taps only.
        return e.type != '15';
      },
      mistake: function(e, data) {
        return { type: 'fail', blame: e.targetName, text: e.abilityName, };
      },
    },
  ],
},];
