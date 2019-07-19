'use strict';

[{
  zoneRegex: /^Eden's Gate: Descent$/,
  timelineFile: 'e2n.txt',
  timelineTriggers: [
    {
      id: 'E2N Punishing Ray',
      regex: /Punishing Ray/,
      beforeSeconds: 6,
      infoText: {
        en: 'Get Puddles',
        fr: 'Prenez les flaques',
      },
    },
  ],
  triggers: [
    {
      id: 'E2N Shadowflame YOU',
      regex: / 14:3E4D:Voidwalker starts using Shadowflame on (\y{Name})/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
      },
    },
    {
      id: 'E2N Shadowflame Healer',
      regex: / 14:3E4D:Voidwalker starts using Shadowflame on \y{Name}/,
      suppressSeconds: 1,
      condition: function(data, matches) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'tank busters',
        fr: 'Tank busters',
      },
    },
    {
      id: 'E2N Entropy',
      regex: / 14:3E6D:Voidwalker starts using Entropy/,
      condition: function(data, matches) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        fr: 'Dégâts de raid',
      },
    },
    {
      id: 'E2N Doomvoid Slicer',
      regex: / 14:3E3C:Voidwalker starts using Doomvoid Slicer/,
      infoText: {
        en: 'Get Under',
        fr: 'Intérieur',
      },
    },
    {
      id: 'E2N Empty Hate',
      regex: / 14:3E46:The Hand Of Erebos starts using Empty Hate/,
      infoText: {
        en: 'Knockback',
        fr: 'Repoussement',
      },
    },
    {
      id: 'E2N Darkfire Counter',
      regex: / 14:3E42:Voidwalker starts using Dark Fire III/,
      run: function(data) {
        data.fireCount = data.fireCount || 0;
        data.fireCount++;
      },
    },
    {
      id: 'E2N Dark Fire No Waiting',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:004C:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Spread',
        fr: 'Disperser',
      },
    },
    {
      id: 'E2N Unholy Darkness No Waiting',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:003E:/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Stack on YOU',
            fr: 'Partage sur VOUS',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches[1]),
          fr: 'Partage sur '+ data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'E2N Shadoweye No Waiting',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00B3:/,
      alertText: function(data, matches) {
        return {
          en: 'Look Away from ' + data.ShortName(matches[1]),
          fr: 'Ne regarder pas '+ data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'E2N Dark Fire Collect',
      regex: / 1B:\y{ObjectId}:(\y{Name}):0000:0000:00B5:/,
      run: function(data, matches) {
        data.spell = data.spell || {};
        data.spell[matches[1]] = 'fire';
      },
    },
    {
      id: 'E2N Dark Fire Waiting',
      regex: / 1B:\y{ObjectId}:(\y{Name}):0000:0000:00B5:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Delayed Fire',
        fr: 'Feu retardé',
      },
    },
    {
      id: 'E2N Countdown Marker Fire',
      regex: / 1B:\y{ObjectId}:(\y{Name}):0000:0000:00B8:/,
      condition: function(data, matches) {
        return data.me == matches[1] && data.spell[data.me] == 'fire';
      },
      alertText: {
        en: 'Spread',
        fr: 'Disperser',
      },
    },
    {
      id: 'E2N Unholy Darkness Collect',
      regex: / 1B:\y{ObjectId}:(\y{Name}):0000:0000:00B4:/,
      run: function(data, matches) {
        data.spell = data.spell || {};
        data.spell[matches[1]] = 'stack';
      },
    },
    {
      id: 'E2N Unholy Darkness Waiting',
      regex: / 1B:\y{ObjectId}:(\y{Name}):0000:0000:00B4:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Delayed Stack',
        fr: 'Partage retardé',
      },
    },
    {
      id: 'E2N Countdown Marker Unholy Darkness',
      regex: / 1B:\y{ObjectId}:(\y{Name}):0000:0000:00B8:/,
      condition: function(data, matches) {
        // The third fire coincides with stack.
        // These people should avoid.
        if (data.spell[data.me] == 'fire' && data.fireCount == 3)
          return false;
        return data.spell[data.matches[1]] == 'stack';
      },
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Stack on YOU',
            fr: 'Partage sur VOUS',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches[1]),
          fr: 'Partage sur ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'E2N Shadoweye Collect',
      regex: / 1B:\y{ObjectId}:(\y{Name}):0000:0000:00B7:/,
      run: function(data, matches) {
        data.spell = data.spell || {};
        data.spell[matches[1]] = 'eye';
      },
    },
    {
      id: 'E2N Shadoweye Waiting',
      regex: / 1B:\y{ObjectId}:(\y{Name}):0000:0000:00B7:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Delayed Shadoweye',
        fr: 'Oeil de l ombre retardé',
      },
    },
    {
      id: 'E2N Countdown Marker Shadoweye',
      regex: / 1B:\y{ObjectId}:(\y{Name}):0000:0000:00B8:/,
      condition: function(data, matches) {
        return data.me != matches[1] && data.spell[matches[1]] == 'eye';
      },
      delaySeconds: 2,
      alarmText: function(data, matches) {
        return {
          en: 'Look Away from ' + data.ShortName(matches[1]),
          fr: 'Ne regarder pas ' + data.ShortName(matches[1]),
        };
      },
    },
  ],
}];
