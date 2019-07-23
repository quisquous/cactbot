'use strict';

[{
  zoneRegex: /^Mt\. Gulg$/,
  timelineFile: 'mt_gulg.txt',
  triggers: [
    {
      id: 'Gulg Punitive Light',
      regex: / 14:41AF:Forgiven Prejudice starts using Punitive Light/,
      condition: function(data) {
        return data.CanStun() || data.CanSilence();
      },
      infoText: {
        en: 'Interrupt Prejudice',
      },
    },
    {
      id: 'Gulg Tail Smash',
      regex: / 14:41AB:Forgiven Ambition starts using Tail Smash/,
      infoText: {
        en: 'Ambition Tail Smash',
      },
    },
    {
      id: 'Gulg Rake',
      regex: / 14:3CFB:Forgiven Cruelty starts using Rake on (\y{Name})/,
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
      id: 'Gulg Lumen Infinitum',
      regex: /14:41B2:Forgiven Cruelty starts using Lumen Infinitum/,
      alertText: {
        en: 'Frontal Laser',
      },
    },
    {
      id: 'Gulg Cyclone Wing',
      regex: /14:3CFC:Forgiven Cruelty starts using Cyclone Wing/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'Gulg Typhoon Wing 1',
      regex: /14:3D00:Forgiven Cruelty starts using Typhoon Wing/,
      supressSeconds: 5,
      infoText: {
        en: 'dodge wind cones',
      },
    },
    {
      id: 'Gulg Typhoon Wing 2',
      regex: /14:3D0[12]:Forgiven Cruelty starts using Typhoon Wing/,
      supressSeconds: 5,
      infoText: {
        en: 'out of melee, dodge cones',
      },
    },
    {
      id: 'Gulg Sacrament of Penance',
      regex: /14:3D0B:Forgiven Whimsy starts using Sacrament Of Penance/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'Gulg Catechism',
      // no target name
      regex: /14:3D09:Forgiven Whimsy starts using Catechism/,
      alertText: function(data) {
        if (data.role == 'tank') {
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
      id: 'Gulg Judgment Day',
      regex: /14:3D0F:Forgiven Whimsy starts using Judgment Day/,
      infoText: {
        en: 'Get Towers',
      },
    },
    {
      id: 'Gulg Left Palm',
      regex: /14:3F7A:Forgiven Revelry starts using Left Palm/,
      infoText: {
        en: 'Left',
        fr: 'Gauche',
      },
    },
    {
      id: 'Gulg Right Palm',
      regex: /14:3F78:Forgiven Revelry starts using Right Palm/,
      infoText: {
        en: 'Right',
        fr: 'Droite',
      },
    },
    {
      id: 'Gulg Orison Fortissimo',
      regex: /14:3D14:Forgiven Obscenity starts using Orison Fortissimo/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'Gulg Sforzando',
      // no target name
      regex: /14:3D12:Forgiven Obscenity starts using Sacrament Sforzando/,
      alertText: function(data) {
        if (data.role == 'tank') {
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
      id: 'Gulg Divine Diminuendo',
      regex: /14:3D18:Forgiven Obscenity starts using Divine Diminuendo/,
      infoText: {
        en: 'Near Boss',
      },
    },
    {
      id: 'Gulg Conviction Marcato',
      regex: /14:3D1A:Forgiven Obscenity starts using Conviction Marcato/,
      infoText: {
        en: 'Behind Boss',
      },
    },
  ],
}];
