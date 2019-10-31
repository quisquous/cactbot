'use strict';

// Hades Extreme

// TODO: arcane font doors
// TODO: arcane utterance orbs
// TODO: fire/ice tethers (0060|0061)

[{
  zoneRegex: /^The Minstrel's Ballad: Hades's Elegy$/,
  timelineFile: 'hades-ex.txt',
  timelineTriggers: [
    {
      id: 'HadesEx Comet',
      regex: /Comet 1/,
      beforeSeconds: 5,
      condition: function(data) {
        return data.role == 'tank';
      },
      infoText: {
        en: 'Comet Towers',
      },
    },
  ],
  triggers: [
    {
      id: 'HadesEx Shadow Spread',
      regex: / 14:47A8:Hades starts using Shadow Spread/,
      alertText: {
        en: 'Protean',
        de: 'Himmelsrichtungen',
        fr: 'Position',
        ja: '散開',
      },
    },
    {
      id: 'HadesEx Ravenous Assault',
      regex: / 14:47A6:Hades starts using Ravenous Assault on (\y{Name})\./,
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
      infoText: function(data, matches) {
        if (matches[1] == data.me || data.role != 'tank')
          return;

        return {
          en: 'Buster on ' + data.ShortName(matches[1]),
          de: 'Tankbuster auf ' + data.ShortName(matches[1]),
          fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'HadesEx Bad Faith Left 1',
      regex: / 14:47AB:Hades starts using Bad Faith/,
      infoText: {
        en: 'Left',
        de: 'Links',
        fr: 'Gauche',
        cn: '左',
      },
    },
    {
      id: 'HadesEx Bad Faith Left 2',
      regex: / 14:47AB:Hades starts using Bad Faith/,
      delaySeconds: 5,
      infoText: {
        en: 'Then Right',
        de: 'Links',
        fr: 'Gauche',
        cn: '左',
      },
    },
    {
      id: 'HadesEx Bad Faith Right 1',
      regex: / 14:47AC:Hades starts using Bad Faith/,
      infoText: {
        en: 'Right',
        de: 'Rechts',
        fr: 'Droite',
        cn: '右',
      },
    },
    {
      id: 'HadesEx Bad Faith Right 2',
      regex: / 14:47AC:Hades starts using Bad Faith/,
      delaySeconds: 5,
      infoText: {
        en: 'Then Left',
        de: 'Links',
        fr: 'Gauche',
        cn: '左',
      },
    },
    {
      id: 'HadesEx Quake III',
      regex: / 14:47B8:Nabriales's Shade starts using Quake III/,
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
      },
    },
    {
      id: 'HadesEx Dark II Tether',
      regex: / 23:\y{ObjectId}:Shadow of the Ancients:\y{ObjectId}:(\y{Name}):....:....:0011:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Point Tether Out',
      },
    },
    {
      id: 'HadesEx Ancient Water 3',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:003E:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Healer Stacks',
      },
      run: function(data, matches) {
        data.waterDark = data.waterDark || {};
        data.waterDark[matches[1]] = 'stack';
      },
    },
    {
      id: 'HadesEx Ancient Darkness',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0060:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Tank Spread',
      },
      run: function(data, matches) {
        data.waterDark = data.waterDark || {};
        data.waterDark[matches[1]] = 'spread';
      },
    },
    {
      id: 'HadesEx Ancient Water Unmarked',
      regex: / 1B:\y{ObjectId}:\y{Name}:....:....:(?:0030|0060):/,
      suppressSeconds: 5,
      infoText: function(data) {
        if (data.me in data.waterDark)
          return;
        return {
          en: 'Healer Stacks',
        };
      },
    },
    {
      id: 'HadesEx Shades Too Close',
      regex: / 23:\y{ObjectId}:(?:Igeyorhm's Shade|Lahabrea's Shade):\y{ObjectId}:(?:Igeyorhm's Shade|Lahabrea's Shade):....:....:000E:/,
      suppressSeconds: 10,
      condition: function(data) {
        return data.role == 'tank';
      },
      alarmText: {
        en: 'Move Shades Apart',
      },
    },
    {
      id: 'HadesEx Spheres',
      regex: / 14:47BD:Igeyorhm's Shade starts using Blizzard Sphere/,
      condition: function(data) {
        return data.role == 'tank';
      },
      infoText: function(data) {
        if (!data.sphereCount)
          return;
        return {
          en: 'tank swap soon',
        };
      },
      run: function(data) {
        data.sphereCount = (data.sphereCount || 0) + 1;
      },
    },
    {
      // TODO: maybe this should say "switch" the second time?
      id: 'HadesEx Burning Brand',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Burning Brand/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Attack Igeyorhm',
      },
      run: function(data) {
        data.brand = 'fire';
      },
    },
    {
      id: 'HadesEx Freezing Brand',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Freezing Brand/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Attack Lahabrea',
      },
      run: function(data) {
        data.brand = 'ice';
      },
    },
    {
      id: 'HadesEx Blizzard IV',
      regex: / 14:47C3:Igeyorhm's Shade starts using Blizzard IV on (\y{Name})\./,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Tank Buster on YOU',
        de: 'Tankbuster auf DIR',
        fr: 'Tankbuster sur VOUS',
      },
    },
    {
      id: 'HadesEx Fire IV',
      regex: / 14:47C2:Lahabrea's Shade starts using Fire IV on (\y{Name})\./,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Tank Buster on YOU',
        de: 'Tankbuster auf DIR',
        fr: 'Tankbuster sur VOUS',
      },
    },
    {
      id: 'HadesEx Healers Blizzard/Fire IV',
      regex: / (?:14:47C3:Igeyorhm's Shade|14:47C2:Lahabrea's Shade)/,
      suppressSeconds: 5,
      alertText: {
        en: 'Tank Busters',
      },
    },
    {
      id: 'HadesEx Doom',
      regex: / 1A:\y{ObjectId}:\y{Name} gains the effect of Doom/,
      suppressSeconds: 5,
      condition: function(data) {
        return data.role == 'healer';
      },
      alertText: {
        en: 'Heal T/H to Full',
      },
    },
    {
      id: 'HadesEx Shriek',
      regex: / 1A:\y{ObjectId}:\y{Name} gains the effect of Cursed Shriek from (.*?) for (\y{Float}) Seconds\./,
      delaySeconds: function(data, matches) {
        return parseFloat(matches[1]) - 2;
      },
      alarmText: {
        en: 'Look Away',
      },
    },
    {
      id: 'HadesEx Beyond Death',
      regex: / 1A:\y{ObjectId}:\y{Name} gains the effect of Beyond Death/,
      durationSeconds: 8,
      alertText: {
        en: 'Get Killed',
      },
    },
    {
      id: 'HadesEx Ancient Circle',
      regex: / 1A:\y{ObjectId}:\y{Name} gains the effect of Ancient Circle from (.*?) for (\y{Float}) Seconds\./,
      delaySeconds: function(data, matches) {
        return parseFloat(matches[1]) - 5;
      },
      infoText: {
        en: 'Donut on YOU',
      },
    },
  ],
}];
