'use strict';

[{
  zoneRegex: /^Mt\. Gulg$/,
  timelineFile: 'mt_gulg.txt',
  triggers: [
    {
      id: 'Gulg Punitive Light',
      regex: / 14:41AF:Forgiven Prejudice starts using Punitive Light/,
      regexDe: / 14:41AF:Geläuterte Voreingenommenheit starts using Strafendes Licht/,
      condition: function(data) {
        return data.CanStun() || data.CanSilence();
      },
      infoText: {
        en: 'Interrupt Prejudice',
        de: 'Unterbreche Voreingenommenheit',
      },
    },
    {
      id: 'Gulg Tail Smash',
      regex: / 14:41AB:Forgiven Ambition starts using Tail Smash/,
      regexDe: / 14:41AB:Geläuterte Begierde starts using Schweifschlag/,
      infoText: {
        en: 'Ambition Tail Smash',
        de: 'Begierde Schweifschlag',
      },
    },
    {
      id: 'Gulg Rake',
      regex: / 14:3CFB:Forgiven Cruelty starts using Rake on (\y{Name})/,
      regexDe: / 14:3CFB:Geläuterte Grausamkeit starts using Prankenhieb on (\y{Name})/,
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
      regexDe: /14:41B2:Geläuterte Grausamkeit starts using Lumen Infinitem/,
      alertText: {
        en: 'Frontal Laser',
        de: 'Frontaler Laser',
      },
    },
    {
      id: 'Gulg Cyclone Wing',
      regex: /14:3CFC:Forgiven Cruelty starts using Cyclone Wing/,
      regexDe: /14:3CFC:Geläuterte Grausamkeit starts using Zyklonschwinge/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'Gulg Typhoon Wing 1',
      regex: /14:3D00:Forgiven Cruelty starts using Typhoon Wing/,
      regexDe: /14:3D00:Geläuterte Grausamkeit starts using Taifunschwinge/,
      supressSeconds: 5,
      infoText: {
        en: 'dodge wind cones',
        de: 'Wind-Fächerflächen ausweichen',
      },
    },
    {
      id: 'Gulg Typhoon Wing 2',
      regex: /14:3D0[12]:Forgiven Cruelty starts using Typhoon Wing/,
      regexDe: /14:3D0[12]:Geläuterte Grausamkeit starts using Taifunschwinge/,
      supressSeconds: 5,
      infoText: {
        en: 'out of melee, dodge cones',
        de: 'Nahkämpfer raus, Wind-Fächerflächen ausweichen',
      },
    },
    {
      id: 'Gulg Sacrament of Penance',
      regex: /14:3D0B:Forgiven Whimsy starts using Sacrament Of Penance/,
      regexDe: /14:3D0B:Geläuterte Gereiztheit starts using Sakrament Der Vergebung/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'Gulg Catechism',
      // no target name
      regex: /14:3D09:Forgiven Whimsy starts using Catechism/,
      regexDe: /14:3D09:Geläuterte Gereiztheit starts using Heiliger Vers/,
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
      regexDe: /14:3D0F:Geläuterte Gereiztheit starts using Gnädiges Urteil/,
      infoText: {
        en: 'Get Towers',
        de: 'Türme nehmen',
      },
    },
    {
      id: 'Gulg Left Palm',
      regex: /14:3F7A:Forgiven Revelry starts using Left Palm/,
      regexDe: /14:3F7A:Geläuterte Prasserei starts using Linke Handfläche/,
      infoText: {
        en: 'Left',
        de: 'Links',
        fr: 'Gauche',
      },
    },
    {
      id: 'Gulg Right Palm',
      regex: /14:3F78:Forgiven Revelry starts using Right Palm/,
      regexDe: /14:3F78:Geläuterte Prasserei starts using Rechte Handfläche/,
      infoText: {
        en: 'Right',
        de: 'Rechts',
        fr: 'Droite',
      },
    },
    {
      id: 'Gulg Orison Fortissimo',
      regex: /14:3D14:Forgiven Obscenity starts using Orison Fortissimo/,
      regexDe: /14:3D14:Geläuterte Unzucht starts using Fürbitte Fortissimo/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'Gulg Sforzando',
      // no target name
      regex: /14:3D12:Forgiven Obscenity starts using Sacrament Sforzando/,
      regexDe: /14:3D12:Geläuterte Unzucht starts using Sakrament Sforzato/,
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
      regexDe: /14:3D18:Geläuterte Unzucht starts using Dogma Diminuendo/,
      infoText: {
        en: 'Near Boss',
        de: 'Nah an den Boss',
      },
    },
    {
      id: 'Gulg Conviction Marcato',
      regex: /14:3D1A:Forgiven Obscenity starts using Conviction Marcato/,
      regexDe: /14:3D1A:Geläuterte Unzucht starts using Mette Marcato/,
      infoText: {
        en: 'Behind Boss',
        de: 'Hinter den Boss',
      },
    },
  ],
}];
