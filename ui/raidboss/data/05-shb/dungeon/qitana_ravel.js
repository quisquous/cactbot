'use strict';

[{
  zoneRegex: /[tT]he Qitana Ravel/,
  timelineFile: 'qitana_ravel.txt',
  triggers: [
    {
      id: 'Qitana Stonefist',
      regex: / 14:3C89:Lozatl starts using Stonefist on (\y{Name})/,
      regexDe: / 14:3C89:Lozatl starts using Steinfaust on (\y{Name})/,
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
      regex: / 14:3C8B:Lozatl starts using Lozatl's Scorn/,
      regexDe: / 14:3C8B:Lozatl starts using Lozatls Hohn/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
      },
    },
    {
      id: 'Qitana Eerie Pillar',
      regex: / 14:3C8B:Lozatl starts using Lozatl's Scorn/,
      regexDe: / 14:3C8B:Lozatl starts using Lozatls Hohn/,
      delaySeconds: 5,
      infoText: {
        en: 'Look for pillar',
        de: 'Auf die Pfeiler schauen',
      },
    },
    {
      id: 'Qitana Heat Up Right',
      regex: / 14:3C8D:Lozatl starts using Heat Up/,
      regexDe: / 14:3C8D:Lozatl starts using Erhitzung/,
      delaySeconds: 6,
      durationSeconds: 6,
      infoText: {
        en: 'Stay on left flank',
        de: 'Auf seiner linken Seite stehen',
      },
    },
    {
      id: 'Qitana Heat Up Right',
      regex: / 14:3C8E:Lozatl starts using Heat Up/,
      regexDe: / 14:3C8E:Lozatl starts using Erhitzung/,
      delaySeconds: 6,
      durationSeconds: 6,
      infoText: {
        en: 'Stay on right flank',
        de: 'Auf seiner rechten Seite stehen',
      },
    },
    {
      id: 'Qitana Ripper Fang',
      regex: / 14:3C91:Batsquatch starts using Ripper Fang on (\y{Name})/,
      regexDe: / 14:3C91:Fledersquatch starts using Fetzzahn on (\y{Name})/,
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
      regexDe: / 14:3C92:Fledersquatch starts using Schallwelle/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
      },
    },
    {
      id: 'Qitana Subsonics',
      regex: / 14:3C93:Batsquatch starts using Subsonics/,
      regexDe: / 14:3C93:Fledersquatch starts using Unterschall/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoes',
        en: 'AoEs',
      },
    },
    {
      id: 'Qitana Rend',
      regex: / 14:3C99:Eros starts using Rend on (\y{Name})/,
      regexDe: / 14:3C99:Eros starts using Zerreißen on (\y{Name})/,
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
      regexDe: / 14:3C9B:Eros starts using Glossolalia/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
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
        de: 'Renn weg vom Boss',
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
        de: 'Gift am Rand ablegen',
      },
    },
    {
      id: 'Qitana Confession of Faith Stack',
      regex: /1B:........:(\y{Name}):....:....:003E:/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Stack Middle on YOU',
            de: 'In der Mitte auf DIR sammeln',
          };
        }
        return {
          en: 'Stack Middle on ' + data.ShortName(matches[1]),
          de: 'In Der Mitte auf ' + data.ShortName(matches[1]) + ' sammeln',
        };
      },
    },
    {
      id: 'Qitana Confession of Faith Spread',
      regex: / 14:3CA1:Eros starts using Confession Of Faith/,
      regexDe: / 14:3CA1:Eros starts using Glaubensbekenntnis/,
      alertText: {
        en: 'Spread to Sides',
        de: 'Auf die Seiten verteilen',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Batsquatch': 'Fledersquatch',
        'Eros': 'Eros',
        'Lozatl': 'Lozatl',
        'The Divine Threshold': 'Götterpforte',
        'Shadowed Hollow': 'Bildnishalle',
        'The Song of Ox\'Gatorl': 'Altar des Ox\'Gatorl',
      },
      'replaceText': {
        'Confession Of Faith': 'Glaubensbekenntnis',
        'Glossolalia': 'Glossolalie',
        'Heat Up': 'Erhitzung',
        'Heaving Breath': 'Wogender Atem',
        'Hound Out Of Heaven': 'Himmelsangriff',
        'Inhale': 'Einsaugen',
        'Jump': 'Sprung',
        'Lozatl\'s Fury': 'Lozatls Wut',
        'Lozatl\'s Scorn': 'Lozatls Hohn',
        'Rend': 'Zerreißen',
        'Ripper Fang': 'Fetzzahn',
        'Ronkan Light': 'Licht Ronkas/Ronkalicht',
        'Soundwave': 'Schallwelle',
        'Stonefist': 'Steinfaust',
        'Subsonics': 'Unterschall',
        'Sun Toss': 'Projektion',
        'Towerfall': 'Turmsturz',
        'Viper Poison': 'Viperngift',
      },
    },
  ],
}];
