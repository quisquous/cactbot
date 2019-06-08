'use strict';

[{
  zoneRegex: /The Second Coil Of Bahamut - Turn \(1\)/,
  timelineFile: 't6.txt',
  triggers: [
    {
      id: 'T6 Thorn Whip',
      regex: / 23:\y{ObjectId}:(\y{Name}):\y{ObjectId}:(\y{Name}):....:....:0012:/,
      run: function(data, matches) {
        data.thornMap = data.thornMap || {};
        data.thornMap[matches[1]] = data.thornMap[matches[1]] || [];
        data.thornMap[matches[1]].push(matches[2]);
        data.thornMap[matches[2]] = data.thornMap[matches[2]] || [];
        data.thornMap[matches[2]].push(matches[1]);
      },
    },
    {
      id: 'T6 Thorn Whip',
      regex: / 1[56]:\y{ObjectId}:Rafflesia:879:Thorn Whip:\y{ObjectId}:(\y{Name}):/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: function(data) {
        let partners = data.thornMap[data.me];
        if (!partners) {
          return {
            en: 'Thorns on YOU',
          };
        }
        if (partners.length == 1) {
          return {
            en: 'Thorns w/ (' + data.ShortName(partners[0]) + ')',
          };
        }
        if (partners.length == 2) {
          return {
            en: 'Thorns w/ (' + data.ShortName(partners[0]) + ', ' + data.ShortName(partners[1]) + ')',
          };
        }
        return {
          en: 'Thorns (' + partners.length + ' people)',
        };
      },
      run: function(data) {
        delete data.thornMap;
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
      alarmText: {
        en: 'STOP',
      },
    },
    {
      id: 'T6 Phase 3',
      regex: / 14:79E:Rafflesia starts using Leafstorm/,
      condition: function(data) {
        return !data.seenLeafstorm;
      },
      sound: 'Long',
      run: function(data) {
        data.seenLeafstorm = true;
      },
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
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:000E:/,
      alertText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Share Laser (on YOU)',
          };
        }
        return {
          en: 'Share Laser (on ' + data.ShortName(matches[1]) + ')',
        };
      },
    },
  ],
}];
