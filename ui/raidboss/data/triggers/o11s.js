'use strict';

// O11S - Alphascape 3.0 Savage
[{
  zoneRegex: /^Alphascape V3.0 \(Savage\)$/,
  timelineFile: 'o11s.txt',
  timelineTriggers: [
    {
      id: 'O11S Reset',
      regex: /Reset/,
      beforeSeconds: 6,
      alertText: {
        en: 'get out, center aoe',
      },
    },
    {
      id: 'O11S Reset',
      regex: /Reformat/,
      beforeSeconds: 6,
      alertText: {
        en: 'donut aoe',
      },
    },
    {
      id: 'O11S Delta Attack',
      regex: /:325B:Omega readies Delta Attack./,
      beforeSeconds: 5,
      alertText: function(data) {
        if (data.role == 'tank')
          en: 'TANK LB';
      },
      groupTTS: {
        en: 'Tank LB',
      },
    },
    {
      id: 'O11S Ballistic Puddles',
      regex: /Ballistic Impact/,
      beforeSeconds: 7,
      infoText: {
        en: 'position for puddles',
      },
      groupTTS: {
        en: 'drop puddles',
      },
    },
    {
      id: 'O11S Ballistic Stacks',
      regex: /Engage Ballistic Systems/,
      beforeSeconds: 3,
      infoText: {
        en: 'party stack',
      },
    },
  ],
  triggers: [
    {
      id: 'O11S Mustard Bomb',
      regex: /14:326D:Omega starts using Mustard Bomb on (\y{Name})./,
      alarmText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tenkbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tenkbuster auf ' + data.ShortName(matches[1]),
            fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
          };
        }
      },
      tts: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'buster',
            de: 'basta',
            fr: 'tankbuster',
          };
        }
      },
      groupTTS: function(data, matches) {
        return {
          en: 'tankbuster',
          de: 'basta',
          fr: 'tankbuster',
        };
      },
    },
    {
      id: 'O11S Atomic Ray',
      regex: / 14:326C:Omega readies Atomic Ray,/,
      tts: function(data) {
        if (data.role == 'healer') {
          return {
            en: 'AOE',
          };
        }
      },
      groupTTS: function(data, matches) {
        return {
          en: 'AOE',
        };
      },
    },
    {
      // Ability IDs:
      // Starboard 1: 3262
      // Starboard 2: 3263
      // Larboard 1: 3264
      // Larboard 2: 3265
      // For the cannons, match #1 and #2 for the first one.  This is so
      // that if a log entry for the first is dropped for some reason, it
      // will at least say left/right for the second.
      // Starboard/Larboard Cannon cleanup.
      regex: / 14:326[24]:Omega starts using/,
      delaySeconds: 15,
      run: function(data) {
        delete data.lastWasStarboard;
      },
    },
    {
      id: 'O11S Starboard Cannon 1',
      regex: / 14:326[23]:Omega starts using Starboard/,
      condition: function(data) {
        return data.lastWasStarboard === undefined;
      },
      alertText: {
        en: 'Left',
      },
      run: function(data) {
        data.lastWasStarboard = true;
      },
    },
    {
      id: 'O11S Larboard Cannon 1',
      regex: / 14:326[45]:Omega starts using Larboard/,
      condition: function(data) {
        return data.lastWasStarboard === undefined;
      },
      alertText: {
        en: 'Right',
      },
      run: function(data) {
        data.lastWasStarboard = false;
      },
    },
    {
      id: 'O11S Starboard Cannon 2',
      regex: / 14:3263:Omega starts using Starboard/,
      condition: function(data) {
        return data.lastWasStarboard !== undefined;
      },
      alertText: function(data) {
        if (data.lastWasStarboard) {
          return {
            en: 'Move',
          };
        }
        return {
          en: 'Stay',
        };
      },
    },
    {
      id: 'O11S Larboard Cannon 2',
      regex: / 14:3265:Omega starts using Larboard/,
      condition: function(data) {
        return data.lastWasStarboard !== undefined;
      },
      preRun: function(data) {
        if (data.lastWasStarboard) {
          data.larboardText = {
            en: 'Stay',
          };
          return;
        }
        data.larboardText = {
          en: 'Move',
        };
      },
      alertText: function(data) {
        return data.larboardText;
      },
    },
    {
      id: 'O11S Starboard Surge 1',
      regex: / 14:3266:Omega starts using Starboard/,
      alertText: {
        en: 'Left (then opposite)',
      },
      groupTTS: {
        en: 'left then opposite',
      },
    },
    {
      id: 'O11S Larboard Surge 1',
      regex: / 14:3268:Omega starts using Larboard/,
      alertText: {
        en: 'Right (then opposite)',
      },
      groupTTS: {
        en: 'right then opposite',
      },
    },
    {
      id: 'O11S Starboard Surge 2',
      regex: / 14:3266:Omega starts using Starboard/,
      delaySeconds: 4,
      alertText: {
        en: 'Opposite (Left)',
      },
      groupTTS: {
        en: 'opposite left',
      },
    },
    {
      id: 'O11S Larboard Surge 2',
      regex: / 14:3268:Omega starts using Larboard/,
      delaySeconds: 4,
      alertText: {
        en: 'Opposite (Right)',
      },
      groupTTS: {
        en: 'opposite right',
      },
    },
    // End Starboard / Laboard Stuff
    {
      id: 'O11S Flamethrower',
      regex: /00:282b:Omega readies Flamethrower./,
      infoText: {
        en: 'Flames (rotate)',
      },
      tts: {
        en: 'flames, then rotate',
      },
    },
    {
      id: '011S Electric Slide',
      regex: /Omega readies Electric Slide./,
      alertText: {
        en: 'Stack',
      },
    },
    {
      id: 'O11S Blaster',
      regex: /:3261:/,
      tts: function(data, matches) {
        if (data.role == 'healer') {
          return {
            en: 'Teather on ' + data.ShortName(matches[1]),
            de: ' auf ' + data.ShortName(matches[1]),
            fr: ' sur ' + data.ShortName(matches[1]),
          };
        }
      },
      groupTTS: function(data, matches) {
        return {
          en: 'Teather on ' + data.shortName(matches[0]),
          de: ' auf ' + data.ShortName(matches[1]),
          fr: ' sur ' + data.ShortName(matches[1]),
        };
      },
    },
    {

      id: '011S Ferrofluid',
      regex: / 14:3253:Level Checker starts using Ferrofluid on Level Checker/,
      alertText: {
        en: 'Different (out), Same (in)',
      },
      groupTTS: {
        en: 'different out, same in',
      },
    },
    // [20:26:01.568] 1B:105A629D:Person Name:0000:0000:00A3:0000:0000:0000: -
    // :00A2: Positive // useful at all?
    // Is it possible to see who is matching who?
    {
      id: 'O11S Pantokrator',
      regex: /:3702:Omega readies Pantokrator/,
      alertText: {
        en: 'puddles, then directionals',
      },
    },
    {
      id: 'O11S Peripheral Synthesis',
      regex: /14:324A:Omega starts using Peripheral Synthesis/,
      preRun: function(data) {
        data.synthCount = (data.synthCount || 0) + 1;
      },
      infoText: function(data) {
        return {
          en: 'TEST: Perph Synth Count ' + data.synthCount,
        };
      },
      tts: function(data) {
        if (data.synthCount == 4) {
          return {
            en: 'TANK LB',
          };
        }
      },
      groupTTS: function(data) {
        // Type A - Matching
        if (data.synthCount == 1)
          return { en: 'match yellow blue' };
        // Type B ? Do I need this Half the party is matched
        if (data.synthCount == 2 || data.synthCount == 3)
          return { en: 'rockets on 4' };
        // Type C / ALL 8
        if (data.synthCount == 4)
          return { en: 'TANK LB' };
      },
    },
    {
      id: 'O11S Charybdis',
      regex: /:326E:/,
      alertText: function(data) {
        if (data.role == 'healer') {
          return {
            en: '1 HP ',
          };
        }
      },
      groupTTS: function(data) {
        return {
          en: '1 HP',
        };
      },
    },
  ],
}];
