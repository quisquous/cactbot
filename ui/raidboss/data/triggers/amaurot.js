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
      infoText: function(data) {
        return {
          en: 'Meteor (leave room behind)',
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
