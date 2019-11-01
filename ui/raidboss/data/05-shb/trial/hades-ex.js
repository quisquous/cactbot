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
    // TODO: call out direction for safe spot
    {
      id: 'HadesEx Arcane Control Orbs',
      regex: / 03:\y{ObjectId}:Added new combatant Arcane Globe\./,
      suppressSeconds: 2,
      infoText: {
        en: 'Go to Safe Spot',
      },
    },
    {
      id: 'HadesEx Arcane Control Doors',
      regex: / 03:\y{ObjectId}:Added new combatant Arcane Font\./,
      suppressSeconds: 2,
      infoText: {
        en: 'Hide Behind Door',
      },
    },
    {
      id: 'HadesEx Quake III',
      regex: / 14:47B8:Nabriales's Shade starts using Quake III/,
      delaySeconds: 25,
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
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
      run: function(data) {
        data.waterDarkMarker = true;
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
      run: function(data) {
        data.waterDarkMarker = true;
      },
    },
    {
      id: 'HadesEx Ancient Water Unmarked',
      regex: / 1B:\y{ObjectId}:\y{Name}:....:....:(?:0030|0060):/,
      delaySeconds: 0.5,
      suppressSeconds: 5,
      infoText: function(data) {
        if (data.waterDarkMarker)
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
      id: 'HadesEx Annihilation',
      regex: / 14:47BF:Lahabrea's And Igeyorhm's Shades starts using Annihilation/,
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
      regex: / 1A:\y{ObjectId}:\y{Name} gains the effect of Doom from (?:.*?) for (?:\y{Float}) Seconds\./,
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
      regex: / 1A:\y{ObjectId}:\y{Name} gains the effect of Cursed Shriek from (?:.*?) for (\y{Float}) Seconds\./,
      suppressSeconds: 2,
      delaySeconds: function(data, matches) {
        return parseFloat(matches[1]) - 2;
      },
      alarmText: {
        en: 'Look Away',
      },
    },
    {
      id: 'HadesEx Beyond Death',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Beyond Death from (?:.*?) for (?:\y{Float}) Seconds\./,
      durationSeconds: 8,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Get Killed',
      },
    },
    {
      id: 'HadesEx Ancient Circle',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Ancient Circle from (?:.*?) for (\y{Float}) Seconds\./,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      delaySeconds: function(data, matches) {
        return parseFloat(matches[2]) - 5;
      },
      infoText: {
        en: 'Donut on YOU',
      },
    },
    {
      id: 'HadesEx Forked Lightning',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Forked Lightning from (?:.*?) for (\y{Float}) Seconds\./,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      delaySeconds: function(data, matches) {
        return parseFloat(matches[2]) - 2;
      },
      alertText: {
        en: 'Stay Out',
      },
    },
    {
      id: 'HadesEx Blight',
      regex: / 14:47CC:Ascian Prime's Shade starts using Blight/,
      delaySeconds: 12,
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      infoText: {
        en: 'aoe + bleed',
      },
    },
    {
      id: 'HadesEx Height Of Chaos',
      regex: / 14:47D1:Ascian Prime's Shade starts using Height Of Chaos on (\y{Name})\./,
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
        return {
          en: 'Away from ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'HadesEx Megiddo Flame',
      regex: / 14:47CD:Ascian Prime's Shade starts using Megiddo Flame/,
      suppressSeconds: 1,
      infoText: {
        en: 'Healer Stacks',
      },
    },
    {
      id: 'HadesEx Shadow Flare',
      regex: / 14:47D0:Ascian Prime's Shade starts using Shadow Flare/,
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'HadesEx Captivity',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0078:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alarmText: {
        en: 'Get Out',
      },
    },
    {
      id: 'HadesEx Aetherial Gaol',
      regex: / 03:\y{ObjectId}:Added new combatant Aetherial Gaol\./,
      infoText: {
        en: 'Break Aetherial Gaol',
      },
    },
    {
      id: 'HadesEx Wail Of The Lost',
      regex: / 14:47E1:Hades starts using Wail Of The Lost/,
      infoText: {
        en: 'Knockback',
      },
    },
    {
      id: 'HadesEx Dark Flame',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0064:/,
      suppressSeconds: 1,
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      infoText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Stack on YOU',
          };
        }
        return {
          en: 'Stack With Healer',
        };
      },
    },
    {
      id: 'HadesEx Dark Freeze',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0078:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Ice on YOU',
      },
    },
    {
      id: 'HadesEx Nether Blast',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:008B:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      run: function(data) {
        data.netherBlast = true;
      },
      alertText: {
        en: 'Puddles on YOU',
      },
    },
    {
      id: 'HadesEx Bident',
      regex: / 14:47E3:Hades starts using Bident/,
      condition: function(data) {
        return !data.netherBlast;
      },
      infoText: {
        en: 'Healer Stacks',
      },
    },
    {
      id: 'HadesEx Shadow Stream',
      regex: / 14:47EA:Hades starts using Shadow Stream/,
      alertText: {
        en: 'Go Sides',
      },
    },
    {
      id: 'HadesEx Polydegmon\'s Purgation',
      regex: / 14:47EB:Hades starts using Polydegmon's Purgation/,
      alertText: {
        en: 'Front and Center',
      },
    },
    {
      id: 'HadesEx Dark Current',
      regex: / 14:47F1:Hades starts using Dark Current/,
      durationSeconds: 10,
      suppressSeconds: 10,
      infoText: {
        en: 'Exoflares',
      },
    },
    {
      id: 'HadesEx Gigantomachy',
      regex: / 14:47F3:Hades starts using Gigantomachy/,
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'HadesEx Quadrastrike 1',
      regex: / 14:47F4:Hades starts using Quadrastrike/,
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'HadesEx Quadrastrike 2',
      regex: / 14:47F6:Hades starts using Quadrastrike/,
      condition: function(data) {
        return data.role == 'tank';
      },
      alarmText: {
        en: 'Get Towers',
        de: 'Türme nehmen',
        fr: 'Dans les tours',
      },
    },
    { // After tanks take tower damage
      id: 'HadesEx Quadrastrike 3',
      regex: / 15:\y{ObjectId}:Hades:47F6:Quadrastrike:/,
      delaySeconds: 2,
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      infoText: {
        en: 'aoe + bleed',
      },
    },
    {
      id: 'HadesEx Enrage Gigantomachy',
      regex: / 14:47F9:Hades starts using Gigantomachy/,
      infoText: {
        en: 'Enrage',
        de: 'Finalangriff',
        fr: 'Enrage',
      },
    },
  ],
}];
