'use strict';

[{
  zoneRegex: /The Second Coil Of Bahamut - Turn \(1\)/,
  triggers: [
    {
      id: 'T6 Thorn Whip',
      regex: / 15:\y{ObjectId}:Rafflesia:879:Thorn Whip:\y{ObjectId}:(\y{Name}):/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Thorns on YOU',
      },
    },
    {
      id: 'T6 Honey On',
      regex: / 1A:(\y{Name}) gains the effect of Honey-Glazed/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      run: function(data) {
        data.honey = true;
      },
    },
    {
      id: 'T6 Honey Off',
      regex: / 1E:(\y{Name}) loses the effect of Honey-Glazed/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      run: function(data) {
        delete data.honey;
      },
    },
    {
      id: 'T6 Flower',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:000D:/,
      alarmText: function(data, matches) {
        if (data.honey) {
          return {
            en: 'Devour: Get Eaten',
          };
        }
      },
      alertText: function(data, matches) {
        if (data.honey)
          return;

        if (data.me == matches[1]) {
          return {
            en: 'Devour: Jump In New Thorns',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.honey || data.me == matches[1])
          return;

        return {
          en: 'Avoid Devour',
        };
      },
    },
    {
      id: 'T6 Phase 2',
      regex: / 0D:Rafflesia HP at 70%/,
      sound: 'Long',
    },
    {
      id: 'T6 Blighted',
      regex: / 14:79D:Rafflesia starts using Blighted Bouquet/,
      alertText: {
        en: 'STOP',
      },
    },
    {
      id: 'T6 Phase 3',
      regex: / 14:79E:Rafflesia starts using Leafstorm/,
      sound: 'Long',
    },
    {
      id: 'T6 Swarm',
      regex: / 14:86C:Rafflesia starts using Acid Rain/,
      infoText: {
        en: 'Stack for Acid',
      },
    },
    {
      id: 'T6 Swarm',
      regex: / 15:\y{ObjectId}:Rafflesia:7A0:Swarm:\y{ObjectId}:(\y{Name}):/,
      condition: function(data, matches) {
        return data.me == matches[1] || data.role == 'healer' || data.job == 'BLU';
      },
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Swarm on YOU',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches[1] != data.me) {
          return {
            en: 'Swarm on ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'T6 Rotten Stench',
      regex: / 1B:\y{ObjectId}:\y{Name}:....:....:000E:/,
      alertText: {
        en: 'Share Laser',
      },
    },
  ],
}];
