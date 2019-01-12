'use strict';

// Seiryu Extreme
[{
  zoneRegex: /^The Wreath Of Snakes \(Extreme\)$/,
  timelineFile: 'seiryu-ex.txt',
  timelineTriggers: [
    {
      id: 'SeiryuEx Split Group',
      regex: /Forbidden Arts 1/,
      beforeSeconds: 4,
      infoText: {
        en: 'stack with your group',
      },
    },
    {
      id: 'SeiryuEx Stack',
      regex: /Forbidden Arts$/,
      beforeSeconds: 1,
      suppressSeconds: 10,
      infoText: {
        en: 'line stack',
      },
    },
    {
      id: 'SeiryuEx Tether',
      regex: /Kanabo/,
      beforeSeconds: 7,
      condition: function(data) {
        return data.role == 'tank';
      },
      alertText: {
        en: 'Grab Tether, Point Away',
      },
    },
  ],
  triggers: [
    {
      id: 'SeiryuEx Aramitama Tracking',
      regex: / 14:37E4:Seiryu starts using Blazing Aramitama/,
      run: function(data) {
        data.blazing = true;
      },
    },
    {
      id: 'SeiryuEx Cursekeeper',
      regex: / 14:37D2:Seiryu starts using Cursekeeper on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Swap',
          };
        }
        if (data.role == 'tank') {
          return {
            en: 'Swap, then Buster',
          };
        }
      },
    },
    {
      id: 'SeiryuEx Infirm Soul',
      regex: / 14:37D2:Seiryu starts using Cursekeeper on (\y{Name})/,
      condition: function(data) {
        // TODO: it'd be nice to figure out who the tanks are so this
        // could also apply to the person Cursekeeper was on.
        return data.role != 'tank';
      },
      delaySeconds: 3,
      alertText: {
        en: 'Away From Tanks',
      },
    },
    {
      id: 'SeiryuEx Ascending Tracking',
      regex: / 14:3C25:Seiryu starts using Serpent Ascending/,
      run: function(data) {
        data.markers = [];
      },
    },
    {
      id: 'SeiryuEx Ascending Stack',
      regex: / 14:3C25:Seiryu starts using Serpent Ascending/,
      delaySeconds: 1,
      infoText: {
        en: 'Stack for Puddle AOEs',
      },
    },
    {
      id: 'SeiryuEx Ascending Marker Tracking',
      regex: / 1B:........:(\y{Name}):....:....:00A9:0000:0000:0000:/,
      condition: function(data) {
        return data.blazing;
      },
      run: function(data, matches) {
        data.markers.push(matches[1]);
      },
    },
    {
      id: 'SeiryuEx Ascending Marker You',
      regex: / 1B:........:(\y{Name}):....:....:00A9:0000:0000:0000:/,
      condition: function(data, matches) {
        return data.blazing && matches[1] == data.me;
      },
      infoText: {
        en: 'Spread (no tower)',
      },
    },
    {
      id: 'SeiryuEx Ascending Tower You',
      regex: / 1B:........:(\y{Name}):....:....:00A9:0000:0000:0000:/,
      condition: function(data, matches) {
        if (!data.blazing || data.markers.length != 4)
          return false;
        return data.markers.indexOf(data.me) == -1;
      },
      alarmText: {
        en: 'Get Tower',
      },
    },
    {
      id: 'SeiryuEx Handprint East',
      regex: / 15:\y{ObjectId}:Yama-no-shiki:37E5:Handprint:/,
      infoText: {
        en: 'East =>',
      },
    },
    {
      id: 'SeiryuEx Handprint West',
      regex: / 15:\y{ObjectId}:Yama-no-shiki:37E6:Handprint:/,
      infoText: {
        en: '<= West',
      },
    },
    {
      id: 'SeiryuEx Find Sneks',
      regex: / 14:37F7:Seiryu starts using Coursing River/,
      alarmText: {
        en: 'Go To Snakes',
      },
    },
    {
      id: 'SeiryuEx Silence',
      regex: / 14:37F4:Numa-No-Shiki starts using Stoneskin/,
      condition: function(data) {
        return data.role == 'tank' || data.role == 'dps-ranged';
      },
      alertText: {
        en: 'Silence',
      },
    },
    {
      id: 'SeiryuEx Stack',
      regex: / 03:Added new combatant Ao-No-Shiki./,
      infoText: function(data) {
        if (data.role == 'tank' || data.role == 'healer') {
          return {
            en: 'Stack South',
          };
        }
        return {
          en: 'Stack if no tether',
        };
      },
    },
    {
      // This comes a good bit after the symbol on screen,
      // but it's still 2.5s of warning if you've fallen asleep.
      id: 'SeiryuEx Sigil Single Out',
      regex: / 14:3A01:Seiryu starts using Onmyo Sigil/,
      infoText: {
        en: 'Out',
      },
    },
    {
      id: 'SeiryuEx Sigil In Out 1',
      regex: / 14:3A05:Seiryu starts using Serpent-Eye Sigil/,
      infoText: {
        en: 'In, then out',
      },
    },
    {
      id: 'SeiryuEx Sigil In Out 2',
      regex: / 14:3A05:Seiryu starts using Serpent-Eye Sigil/,
      delaySeconds: 2.7,
      infoText: {
        en: 'Out',
      },
    },
    {
      id: 'SeiryuEx Sigil Out In 1',
      regex: / 14:3A03:Seiryu starts using Onmyo Sigil/,
      infoText: {
        en: 'Out, then in',
      },
    },
    {
      id: 'SeiryuEx Sigil Out In 2',
      regex: / 14:3A03:Seiryu starts using Onmyo Sigil/,
      delaySeconds: 2.7,
      infoText: {
        en: 'In',
      },
    },
    {
      id: 'SeiryuEx Swim Lessons',
      regex: / 14:37CB:Seiryu starts using Dragon's Wake/,
      delaySeconds: 28,
      alertText: {
        en: 'Pop Sprint',
      },
    },
  ],
}];
