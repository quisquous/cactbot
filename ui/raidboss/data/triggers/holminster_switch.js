'use strict';

[{
  zoneRegex: /^Holminster Switch$/,
  timelineFile: 'holminster_switch.txt',
  triggers: [
    {
      id: 'Holminster Path of Light',
      regex: / 14:3DC5:Forgiven Dissonance starts using Path Of Light/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
      },
    },
    {
      id: 'Holminster Pillory',
      regex: / 14:3DC4:Forgiven Dissonance starts using Pillory on (\y{Name})/,
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
      id: 'Holminster Tickler',
      regex: / 14:3DCF:Tesleen, [tT]he Forgiven starts using The Tickler on (\y{Name})/,
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
      id: 'Holminster Bridle',
      regex: / 14:3DD0:Tesleen, [tT]he Forgiven starts using Scold's Bridle/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
      },
    },
    {
      id: 'Holminster Flagellation',
      regex: / 14:3DD5:Tesleen, [tT]he Forgiven starts using Flagellation/,
      infoText: {
        en: 'spread',
      },
    },
    {
      id: 'Holminster Exorcise Stack',
      regex: /1B:........:(\y{Name}):....:....:003E:/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Stack on YOU',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'Holminster Scavenger',
      regex: / 14:3DD8:Philia starts using Scavenger's Daughter/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
      },
    },
    {
      id: 'Holminster Head Crusher',
      regex: / 14:3DD7:Philia starts using Head Crusher on (\y{Name})/,
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
      id: 'Holminster Chain Down',
      regex: /1B:........:(\y{Name}):....:....:005C:/,
      condition: function(data, matches) {
        return data.me != matches[1];
      },
      infoText: function(data, matches) {
        return {
          en: 'Break chain on ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'Holminster Taphephobia',
      regex: /1B:........:(\y{Name}):....:....:008B:/,
      infoText: {
        en: 'Spread',
      },
    },
    {
      id: 'Holminster Into The Light',
      regex: / 14:4350:Philia starts using Into The Light/,
      infoText: {
        en: 'Line Stack',
      },
    },
    {
      id: 'Holminster Left Knout',
      regex: / 14:3DE7:Philia starts using Left Knout/,
      alertText: {
        en: 'Right',
      },
    },
    {
      id: 'Holminster Right Knout',
      regex: / 14:3DE6:Philia starts using Right Knout/,
      alertText: {
        en: 'Left',
      },
    },
  ],
}];
