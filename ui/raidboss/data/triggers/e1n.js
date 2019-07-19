'use strict';

[{
  zoneRegex: /^Eden's Gate: Resurrection$/,
  timelineFile: 'e1n.txt',
  triggers: [
    {
      id: 'E1N Eden\'s Gravity',
      regex: / 14:3D94:Eden Prime starts using Eden's Gravity/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        fr: 'Dégâts de raid',
      },
    },
    {
      id: 'E1N Fragor Maximus',
      regex: / 14:3DA4:Eden Prime starts using Fragor Maximus/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        fr: 'Dégâts de raid',
      },
    },
    {
      id: 'E1N Dimensional Shift',
      regex: / 14:3D9C:Eden Prime starts using Fragor Maximus/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        fr: 'Dégâts de raid',
      },
    },
    {
      id: 'E1N Eden\'s Flare',
      regex: / 14:3D97:Eden Prime starts using Eden's Flare/,
      alertText: {
        en: 'Under',
        fr: 'Intérieur',
      },
    },
    {
      id: 'E1N Vice of Vanity You',
      regex: / 23:\y{ObjectId}:(\y{Name}):\y{ObjectId}:Eden Prime:....:....:0011:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Tank Laser on YOU',
        fr: 'Tank laser sur VOUS',
      },
    },
    {
      id: 'E1N Vice of Vanity Not You Probably',
      regex: / 23:\y{ObjectId}:\y{Name}:\y{ObjectId}:Eden Prime:....:....:0011:/,
      suppressSeconds: 10,
      infoText: {
        en: 'tank cleaves',
        fr: 'Tank cleaves',
      },
    },
    {
      id: 'E1N Vice of Apathy Mark',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:001C:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Drop Puddle, Run Middle',
        fr: 'Placer les flaques, courrer au centre',
      },
    },
    {
      // 10.5 second cast, maybe warn 6 seconds ahead so that folks bait outside.
      id: 'E1N Pure Light',
      regex: / 14:3DA3:Eden Prime starts using Pure Light/,
      delaySeconds: 4.5,
      alertText: {
        en: 'Drop Puddle, Get Out',
        fr: 'Placer flaques, bouger à l extérieur',
      },
    },
  ],
}];
