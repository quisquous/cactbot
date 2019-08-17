'use strict';

[{
  zoneRegex: /[tT]he Qitana Ravel/,
  timelineFile: 'qitana_ravel.txt',
  triggers: [
    {
      id: 'Qitana Stonefist',
      regex: / 14:3C89:Lozatl starts using Stonefist on (\y{Name})/,
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
      id: 'Qitana Scorn',
      regex: / 14:3C89:Lozatl starts using Lozatl's Scorn/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
      },
    },
    {
      id: 'Qitana Eerie Pillar',
      regex: / 14:3C8B:Lozatl starts using Lozatl's Scorn/,
      delaySeconds: 5,
      infoText: {
        en: 'Look for pillar',
      },
    },
    {
      id: 'Qitana Heat Up Right',
      regex: / 14:3C8D:Lozatl starts using Heat Up/,
      delaySeconds: 6,
      durationSeconds: 6,
      infoText: {
        en: 'Stay on left flank',
      },
    },
    {
      id: 'Qitana Heat Up Right',
      regex: / 14:3C8E:Lozatl starts using Heat Up/,
      delaySeconds: 6,
      durationSeconds: 6,
      infoText: {
        en: 'Stay on right flank',
      },
    },
    {
      id: 'Qitana Ripper Fang',
      regex: / 14:3C91:Batsquatch starts using Ripper Fang on (\y{Name})/,
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
      id: 'Qitana Soundwave',
      regex: / 14:3C92:Batsquatch starts using Soundwave/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
      },
    },
    {
      id: 'Qitana Subsonics',
      regex: / 14:3C93:Batsquatch starts using Subsonics/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoes',
      },
    },
    {
      id: 'Qitana Rend',
      regex: / 14:3C99:Eros starts using Rend on (\y{Name})/,
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
      id: 'Qitana Glossolalia',
      regex: / 14:3C9B:Eros starts using Glossolalia/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
      },
    },
    {
      id: 'Qitana Hound Tether',
      regex: / 23:\y{ObjectId}:Eros:\y{ObjectId}:(\y{Name}):....:....:0039:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Run Away From Boss',
      },
    },
    {
      id: 'Qitana Viper Poison',
      regex: /1B:........:(\y{Name}):....:....:00AB:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Drop Poison Outside',
      },
    },
    {
      id: 'Qitana Confession of Faith Stack',
      regex: /1B:........:(\y{Name}):....:....:003E:/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Stack Middle on YOU',
          };
        }
        return {
          en: 'Stack Middle on ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'Qitana Confession of Faith Spread',
      regex: / 14:3CA1:Eros starts using Confession Of Faith/,
      alertText: {
        en: 'Spread to Sides',
      },
    },
  ],
}];
