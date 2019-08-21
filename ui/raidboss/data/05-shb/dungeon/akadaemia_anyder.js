'use strict';

[{
  zoneRegex: /^Akadaemia Anyder$/,
  timelineFile: 'akadaemia_anyder.txt',
  timelineTriggers: [
    {
      id: 'Anyder Lash',
      regex: /Lash/,
      beforeSeconds: 5,
      suppressSeconds: 10,
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      infoText: {
        en: 'Mini Buster',
      },
    },
    {
      id: 'Anyder Putrid Breath',
      regex: /Putrid Breath/,
      beforeSeconds: 5,
      infoText: {
        en: 'Out of Front',
      },
    },
  ],
  triggers: [
    {
      id: 'Anyder Aquatic Lance',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0087:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'puddle on you',
      },
    },
    {
      id: 'Anyder Puncture',
      regex: / 14:3E04:(?:Cladoselache|Doliodus) starts using Protolithic Puncture on (\y{Name})/,
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
      id: 'Anyder Tidal Guillotine',
      regex: / 14:3E0A:Cladoselache starts using Tidal Guillotine/,
      infoText: {
        en: 'Away From Swimming Shark',
      },
    },
    {
      id: 'Anyder Pelagic Cleaver',
      regex: / 14:3E0B:Doliodus starts using Pelagic Cleaver/,
      infoText: {
        en: 'Sides of Swimming Shark',
      },
    },
    {
      id: 'Anyder Marine Mayhem',
      regex: / 14:3E06:(?:Cladoselache|Doliodus) starts using Marine Mayhem/,
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank' || data.CanAddle();
      },
      infoText: {
        en: 'aoe',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'Anyder Sap Shower',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0078:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Spread',
      },
    },
    {
      id: 'Anyder Arbor Storm',
      regex: / 14:3E17:Marquis Morbol starts using Arbor Storm/,
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank' || data.CanAddle();
      },
      infoText: {
        en: 'aoe',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'Anyder Noahionto',
      regex: / 14:430C:Evil Armor starts using Noahionto/,
      condition: function(data) {
        return data.CanStun() || data.CanSilence();
      },
      alertText: {
        en: 'Interrupt Evil Armor',
      },
    },
    {
      id: 'Anyder Shockbolt',
      regex: / 14:3E23:Quetzalcoatl starts using Shockbolt on (\y{Name})/,
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
      id: 'Anyder Thunderbolt',
      regex: / 14:3E24:Quetzalcoatl starts using Thunderbolt/,
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank' || data.CanAddle();
      },
      infoText: {
        en: 'aoe',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'Anyder Thunderstorm',
      regex: / 14:3E1A:Quetzalcoatl starts using Thunderstorm/,
      delaySeconds: 4.7,
      infoText: {
        en: 'grab orbs',
      },
    },
  ],
}];
