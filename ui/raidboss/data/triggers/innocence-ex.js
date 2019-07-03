'use strict';

// Innocence Extreme
[{
  zoneRegex: /.*/,
  timelineFile: 'innocence-ex.txt',
  triggers: [
    {
      id: 'InnoEx 2',
      regex: /14:40BD:Innocence starts using Winged Reprobation on Innocence/,
      alertText: 'Winged?',
    },
    {
      id: 'InnoEx 3',
      regex: /14:3ECD:Innocence starts using Righteous Bolt on (\y{Name})/,
      alertText: function(data, matches) {
        return {
          en: 'Buster on ' + data.ShortName(matches[1]),
          de: 'Tankbuster auf ' + data.ShortName(matches[1]),
          fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'InnoEx 4',
      regex: /14:3EEA:Innocence starts using Shadowreaver on Innocence/,
      alertText: 'AoE',
    },
    {
      id: 'InnoEx 5',
      regex: /14:3EEE:Innocence starts using Beatific Vision on Innocence/,
      alertText: 'CHARGE!',
    },
    {
      id: 'InnoEx 6',
      regex: /14:3EEF:Innocence starts using Starbirth on Innocence/,
      alertText: 'Star Orbs',
    },
    {
      id: 'InnoEx 7',
      regex: /14:3F3E:Innocence starts using Light Pillar on Innocence/,
      alertText: 'Stackmarker',
    },
    {
      id: 'InnoEx 8',
      regex: /1B:........:(\y{Name}):....:....:00AC:0000:0000:0000:/,
      alertText: function(data, matches) {
        return {
          en: 'Spear on ' + data.ShortName(matches[1]),
          de: 'Tankbuster auf ' + data.ShortName(matches[1]),
          fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
        };
      },
    },
    /* {
      id: 'InnoEx 9',
      regex: /16:(\y{ObjectId}):Innocence:3EDB:Holy Trinity:(\y{ObjectId}):(\y{Name})/,
      alertText: function(data, matches) {
        return {
            en: 'Trinity on ' + data.ShortName(matches[1]),
            de: 'Tankbuster auf ' + data.ShortName(matches[1]),
            fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
        };
      }
    },*/
  ],
  timelineReplace: [
  ],
}];
