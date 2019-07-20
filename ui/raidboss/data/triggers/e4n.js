'use strict';

[{
  zoneRegex: /^Eden's Gate: Sepulture$/,
  timelineFile: 'e4n.txt',
  triggers: [
    {
      id: 'E4N Voice of the Land',
      regex: / 14:40F7:Titan starts using Voice Of The Land/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        fr: 'Dégâts de raid',
      },
    },
    {
      id: 'E4N Earthen Fury',
      regex: / 14:40F8:Titan starts using Earthen Fury/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe + dot',
        fr: 'Dégâts de raid + dot',
      },
    },
    {
      id: 'E4N Stonecrusher',
      regex: / 14:40F9:Titan starts using Stonecrusher on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tankbuster auf ' + data.ShortName(matches[1]),
            fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'E4N Massive Landslide',
      regex: / 14:40FA:Titan starts using Massive Landslide/,
      alertText: {
        en: 'Stand In Front',
        fr: 'Se placer devant',
      },
    },
    {
      id: 'E4N Seismic Wave',
      regex: / 14:40F2:Massive Boulder starts using Crumbling Down/,
      delaySeconds: 6,
      infoText: {
        en: 'Hide Behind Boulder',
        fr: 'Se cacher derrière le rocher',
      },
    },
    {
      id: 'E4N Geocrush',
      regex: / 14:40F6:Titan starts using Geocrush/,
      infoText: {
        en: 'Knockback',
        fr: 'Repoussement',
      },
    },
    {
      id: 'E4N Fault Zone',
      regex: /14:4102:Titan starts using Fault Zone/,
      alertText: {
        en: 'Stand On Flank',
        fr: 'Se placer sur le flanc',
      },
    },
  ],
}];
