'use strict';

[{
  zoneRegex: /^Eden's Gate: Sepulture \(Savage\)$/,
  timelineFile: 'e4s.txt',
  timelineTriggers: [
    {
      id: 'E4S Earthen Anguish',
      regex: /Earthen Anguish/,
      beforeSeconds: 3,
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank';
      },
      alertText: {
        en: 'tank busters',
      },
    },
  ],
  triggers: [
    {
      id: 'E4S Stonecrusher',
      regex: / 14:4116:Titan starts using Stonecrusher on (\y{Name})/,
      alarmText: function(data, matches) {
        if (matches[1] == data.me || data.role != 'tank')
          return;

        return {
          en: 'Tank Swap!',
          de: 'Tankwechsel!',
          fr: 'Tank swap !',
        };
      },
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
      id: 'E4S Pulse of the Land',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00B9:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Pulse - Spread',
      },
    },
    {
      id: 'E4S Evil Earth',
      regex: / 14:410C:Titan starts using Evil Earth/,
      alertText: {
        en: 'Look for Evil Earth Marker',
      },
    },
    {
      id: 'E4S Force of the Land',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00BA:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Force - Stack',
      },
    },
    {
      id: 'E4S Voice of the Land',
      regex: / 14:4114:Titan starts using Voice of the Land/,
      condition: function(data, matches) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'E4S Geocrush',
      regex: / 14:4113:Titan starts using Geocrush/,
      alertText: {
        en: 'Knockback',
        fr: 'Poussée',
      },
    },
    {
      id: 'E4S Massive Landslide - Front',
      regex: / 15:........:Titan:40E6:Earthen Gauntlets/,
      delaySeconds: 2,
      alertText: {
        en: 'Get in Front',
      },
    },
    {
      id: 'E4S Massive Landslide - Sides',
      regex: / 15:........:Titan:4117:Massive Landslide/,
      alertText: {
        en: 'Get to Sides',
      },
    },
    {
      id: 'E4S Landslide',
      regex: / 14:411A:Titan starts using Landslide/,
      alertText: {
        en: 'Jump - Stay Out',
      },
    },
    {
      id: 'E4S Leftward Landslide 1',
      regex: / 14:411C:Titan starts using Leftward Landslide/,
      alertText: {
        en: 'Go Left',
      },
    },
    {
      id: 'E4S Leftward Landslide 2',
      regex: / 15:........:Titan:411C:Leftward Landslide/,
      alertText: {
        en: 'Go Right',
      },
    },
    {
      id: 'E4S Rightward Landslide 1',
      regex: / 14:411D:Titan starts using Rightward Landslide/,
      alertText: {
        en: 'Go Right',
      },
    },
    {
      id: 'E4S Rightward Landslide 2',
      regex: / 15:........:Titan:411D:Rightward Landslide/,
      alertText: {
        en: 'Go Left',
      },
    },
    {
      id: 'E4S Crumbling Down',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0017:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Bomb Marker on YOU',
      },
    },
    {
      id: 'E4S Seismic Wave',
      regex: / 14:4110:Titan starts using Seismic Wave/,
      alertText: {
        en: 'Hide!',
      },
    },
    {
      id: 'E4S Fault Line - Sides',
      regex: / 15:........:Titan:40E8:Earthen Wheels/,
      delaySeconds: 2,
      alertText: {
        en: 'Get to Sides',
      },
    },
    {
      id: 'E4S Fault Line - Front',
      regex: / 15:........:Titan:411F:Fault Line/,
      alertText: {
        en: 'Get away from tank!',
      },
    },
    {
      id: 'E4S Magnitude 5.0',
      regex: / 14:4121:Titan starts using Magnitude 5.0/,
      infoText: {
        en: 'Get Under',
      },
    },
    {
      id: 'E4S Earthen Fury',
      regex: / 14:4124:Titan Maximum starts using Earthen Fury/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'big aoe',
      },
    },
    {
      id: 'E4S Earthen Fist - Left/Right',
      regex: / 14:412F:Titan Maximum starts using Earthen Fist/,
      infoText: {
        en: 'GO LEFT THEN RIGHT',
      },
    },
    {
      id: 'E4S Earthen Fist - Right/Left',
      regex: / 14:4130:Titan Maximum starts using Earthen Fist/,
      infoText: {
        en: 'GO RIGHT THEN LEFT',
      },
    },
    {
      id: 'E4S Earthen Fist - 2x Left',
      regex: / 14:4131:Titan Maximum starts using Earthen Fist/,
      infoText: {
        en: 'STAY LEFT',
      },
    },
    {
      id: 'E4S Earthen Fist - 2x Right',
      regex: / 14:4132:Titan Maximum starts using Earthen Fist/,
      infoText: {
        en: 'STAY RIGHT',
      },
    },
    {
      id: 'E4S Dual Earthen Fists',
      regex: / 14:4135:Titan Maximum starts using Dual Earthen Fists/,
      infoText: {
        en: 'Knockback',
        fr: 'Poussée',
      },
    },
    {
      id: 'E4S Weight of the World',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00BB:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Weight Marker on YOU - Get Away',
      },
    },
    {
      id: 'E4S Megalith',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:005D:/,
      alertText: function(data, matches) {
        if (data.role != 'tank') {
          return {
            en: 'Get Away from Tanks',
          };
        }
        if (matches[1] == data.me) {
          return {
            en: 'Stack Marker on YOU',
          };
        }
        return {
          en: 'Stack Marker on ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'E4S Granite Gaol',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00BF:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Gaol Marker on YOU',
      },
    },
    {
      id: 'E4S Plate Fracture - Front Right',
      regex: / 14:4125:Titan Maximum starts using Plate Fracture/,
      infoText: {
        en: 'GET OFF FRONT RIGHT',
      },
    },
    {
      id: 'E4S Plate Fracture - Back Right',
      regex: / 14:4126:Titan Maximum starts using Plate Fracture/,
      infoText: {
        en: 'GET OFF BACK RIGHT',
      },
    },
    {
      id: 'E4S Plate Fracture - Back Left',
      regex: / 14:4127:Titan Maximum starts using Plate Fracture/,
      infoText: {
        en: 'GET OFF BACK LEFT',
      },
    },
    {
      id: 'E4S Plate Fracture - Front Left',
      regex: / 14:4128:Titan Maximum starts using Plate Fracture/,
      infoText: {
        en: 'GET OFF FRONT LEFT',
      },
    },
    {
      id: 'E4S Tumult',
      regex: / 14:412A:Titan Maximum starts using Tumult/,
      condition: function(data, matches) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
      },
    },
  ],
}];
