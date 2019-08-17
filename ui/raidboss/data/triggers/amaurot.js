'use strict';

[{
  zoneRegex: /^Amaurot$/,
  timelineFile: 'amaurot.txt',
  triggers: [
    {
      id: 'Amaurot Meteor',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0039:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      preRun: function(data) {
        data.meteor = (data.meteor || 0) + 1;
      },
      infoText: function(data) {
        if (data.meteor == 1) {
          return {
            en: 'Drop Meteor West',
          };
        } else if (data.meteor == 2) {
          return {
            en: 'Drop Meteor East',
          };
        }
        return {
          en: 'Meteor',
        };
      },
    },
    {
      id: 'Amaurot Spread',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:008B:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: function(data) {
        return {
          en: 'Spread',
        };
      },
    },
    {
      id: 'Amaurot Final Sky',
      regex: / 14:3CCB:The First Beast starts using The Final Sky/,
      alertText: {
        en: 'Hide Behind Boulder',
      },
    },
    {
      id: 'Amaurot Shadow Wreck',
      regex: / 14:3CE3:Therion starts using Shadow Wreck/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'Amaurot Apokalypsis',
      regex: / 14:3CE3:Therion starts using Apokalypsis/,
      alertText: {
        en: 'Get Off',
      },
    },
  ],
}];
