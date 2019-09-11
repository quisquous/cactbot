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
        de: 'Weg von Vorne',
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
        de: 'Fläche auf DIR',
      },
    },
    {
      id: 'Anyder Puncture',
      regex: / 14:3E04:(?:Cladoselache|Doliodus) starts using Protolithic Puncture on (\y{Name})/,
      regexDe: / 14:3E04:(?:Cladoselache|Doliodus) starts using Paläolithische Punktion on (\y{Name})/,
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
      regexDe: / 14:3E0A:Cladoselache starts using Gezeitenguillotine/,
      infoText: {
        en: 'Away From Swimming Shark',
        de: 'Weg vom schwimmenden Hai',
      },
    },
    {
      id: 'Anyder Pelagic Cleaver',
      regex: / 14:3E0B:Doliodus starts using Pelagic Cleaver/,
      regexDe: / 14:3E0B:Doliodus starts using Pelagische Pein/,
      infoText: {
        en: 'Sides of Swimming Shark',
        de: 'Zu den Seiten vom schwimmenden Hai',
      },
    },
    {
      id: 'Anyder Marine Mayhem',
      regex: / 14:3E06:(?:Cladoselache|Doliodus) starts using Marine Mayhem/,
      regexDe: / 14:3E06:(?:Cladoselache|Doliodus) starts using Meereschaos/,
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank' || data.CanAddle();
      },
      infoText: {
        en: 'aoe',
        en: 'AoE',
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
        de: 'Verteilen',
      },
    },
    {
      id: 'Anyder Arbor Storm',
      regex: / 14:3E17:Marquis Morbol starts using Arbor Storm/,
      regexDe: / 14:3E17:Marquis-Morbol starts using Dornensturm/,
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank' || data.CanAddle();
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'Anyder Noahionto',
      regex: / 14:430C:Evil Armor starts using Noahionto/,
      regexDe: / 14:430C:Böse Kampfmaschine starts using Noahionto/,
      condition: function(data) {
        return data.CanStun() || data.CanSilence();
      },
      alertText: {
        en: 'Interrupt Evil Armor',
        de: 'Unterbreche Böse Kampfmaschine',
      },
    },
    {
      id: 'Anyder Shockbolt',
      regex: / 14:3E23:Quetzalcoatl starts using Shockbolt on (\y{Name})/,
      regexDe: / 14:3E23:Quetzalcoatl starts using Blitzbogen on (\y{Name})/,
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
      regexDe: / 14:3E24:Quetzalcoatl starts using Donnerkeil/,
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank' || data.CanAddle();
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'Anyder Thunderstorm',
      regex: / 14:3E1A:Quetzalcoatl starts using Thunderstorm/,
      regexDe: / 14:3E1A:Quetzalcoatl starts using Gewitter/,
      delaySeconds: 4.7,
      infoText: {
        en: 'grab orbs',
        de: 'Orbs nehmen',
      },
    },
  ],
}];
