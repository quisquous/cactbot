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
            de: 'Meteor im Westen ablegen',
          };
        } else if (data.meteor == 2) {
          return {
            en: 'Drop Meteor East',
            de: 'Meteor im Osten ablegen',
          };
        }
        return {
          en: 'Meteor',
          de: 'Meteor',
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
          de: 'Verteilen',
        };
      },
    },
    {
      id: 'Amaurot Final Sky',
      regex: / 14:3CCB:The First Beast starts using The Final Sky/,
      regexDe: / 14:3CCB:Das erste Unheil starts using Letzter Himmel/,
      alertText: {
        en: 'Hide Behind Boulder',
        de: 'Hinter einem Felsen verstecken',
      },
    },
    {
      id: 'Amaurot Shadow Wreck',
      regex: / 14:3CE3:Therion starts using Shadow Wreck/,
      regexDe: / 14:3CE3:Therion starts using Schatten Des Unheils/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        en: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'Amaurot Apokalypsis',
      regex: / 14:3CD7:Therion starts using Apokalypsis/,
      regexDe: / 14:3CD7:Therion starts using Apokalypse/,
      alertText: {
        en: 'Get Off',
        de: 'Runter gehen',
      },
    },
  ],
}];
