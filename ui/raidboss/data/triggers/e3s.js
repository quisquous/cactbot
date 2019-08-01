'use strict';

[{
  zoneRegex: /^Eden's Gate: Inundation \(Savage\)$/,
  timelineFile: 'e3s.txt',
  timelineTriggers: [
    {
      id: 'E3S Plunging Wave',
      regex: /Plunging Wave/,
      beforeSeconds: 2,
      infoText: {
        en: 'Line Stack',
      },
    },
    {
      id: 'E3S Spilling Wave',
      regex: /Spilling Wave/,
      beforeSeconds: 3,
      condition: function(data) {
        return data.role == 'tank';
      },
      alertText: {
        en: 'Tank Cleaves, Move Front',
      },
    },
  ],
  triggers: [
    {
      id: 'E3S Tidal Roar',
      regex: / 14:3FDC:Leviathan starts using Tidal Roar/,
      condition: function(data, matches) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'E3S Tidal Rage',
      regex: / 14:3FDE:Leviathan starts using Tidal Rage/,
      condition: function(data, matches) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'E3S Tidal Wave Look',
      regex: / 14:3FF1:Leviathan starts using Tidal Wave/,
      regexFr: / 14:3FF1:Léviathan starts using Raz-De-Marée/,
      regexJa: / 14:3FF1:リヴァイアサン starts using タイダルウェーブ/,
      delaySeconds: 3,
      infoText: {
        en: 'Look for Wave',
        fr: 'Repérez la vague',
        ja: 'タイダルウェーブ見て',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'ja',
      'replaceSync': {
        'Engage!': '戦闘開始！',
        'Leviathan': 'リヴァイアサン',
      },
    },
    {
      id: 'E3S Tidal Wave Knockback',
      regex: / 14:3FF1:Leviathan starts using Tidal Wave/,
      regexFr: / 14:3FF1:Léviathan starts using Raz-De-Marée/,
      // 3 seconds of cast, 10 seconds of delay.
      // This gives a warning within 5 seconds, so you can hit arm's length.
      delaySeconds: 8,
      alertText: {
        en: 'Knockback',
        fr: 'Poussée',
      },
    },
    {
      id: 'E3S Rip Current',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0017:/,
      suppressSeconds: 10,
      alarmText: function(data, matches) {
        if (matches[1] != data.me && data.role == 'tank') {
          return {
            en: 'Tank Swap!',
            de: 'Tankwechsel!',
            fr: 'Tank swap !',
          };
        }
      },
      alertText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Tank Busters',
          };
        }
      },
    },
    {
      id: 'E3S Undersea Quake Outside',
      regex: / 14:3FEF:Leviathan starts using Undersea Quake/,
      regexFr: / 14:3FEF:Léviathan starts using Séisme Sous-Marin/,
      alertText: {
        en: 'Get Middle',
        fr: 'Allez au centre',
      },
    },
    {
      id: 'E3S Undersea Quake Outside',
      regex: / 14:3FEE:Leviathan starts using Undersea Quake/,
      regexFr: / 14:3FEE:Léviathan starts using Séisme Sous-Marin/,
      alarmText: {
        en: 'Go Outside',
        fr: 'Allez sur les côtés',
      },
    },
    {
      id: 'E3S Flare',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0057:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alarmText: {
        en: 'Flare on YOU',
      },
    },
    {
      id: 'E3S Drenching Pulse',
      regex: / 14:3FE2:Leviathan starts using Drenching Pulse/,
      infoText: {
        en: 'Stack, Bait Puddles',
      },
    },
    {
      id: 'E3S Drenching Pulse Puddles',
      regex: / 14:3FE2:Leviathan starts using Drenching Pulse/,
      delaySeconds: 2.9,
      infoText: {
        en: 'Drop Puddles Outside',
      },
    },
    {
      id: 'E3S Roiling Pulse',
      regex: / 14:3FE4:Leviathan starts using Roiling Pulse/,
      infoText: {
        en: 'Stack, Bait Puddles',
      },
    },
    {
      id: 'E3S Roiling Pulse Abilities',
      regex: / 14:3FE4:Leviathan starts using Roiling Pulse/,
      delaySeconds: 2.9,
      infoText: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'Flare To Outside Corner',
          };
        }
        return {
          en: 'Stack Outside, Avoid Flares',
        };
      },
    },
    {
      id: 'E3S Stormy Horizon',
      regex: / 14:3FE9:Leviathan starts using Stormy Horizon/,
      infoText: {
        en: 'Panto Puddles x5',
      },
    },
    {
      id: 'E3S Hydrothermal Vent Tether',
      regex: / 23:\y{ObjectId}:(\y{Name}):\y{ObjectId}:Leviathan:....:....:005A:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Puddle Tether on YOU',
      },
    },
    {
      id: 'E3S Hydrothermal Vent Collect',
      regex: / 23:\y{ObjectId}:(\y{Name}):\y{ObjectId}:Leviathan:....:....:005A:/,
      run: function(data, matches) {
        data.vent = data.vent || [];
        data.vent.push(matches[1]);
      },
    },
    {
      id: 'E3S Hydrothermal Vent Collect',
      regex: / 23:\y{ObjectId}:\y{Name}:\y{ObjectId}:Leviathan:....:....:005A:/,
      condition: function(data) {
        return data.vent.length == 2 && data.vent.indexOf(data.me) == -1 && data.role != 'tank';
      },
      infoText: {
        en: 'Pop alternating bubbles',
      },
    },
    {
      id: 'E3S Surging Waters',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Surging Waters/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Initial knockback on YOU',
      },
    },
    {
      // TODO probably need to call out knockbacks later
      // TODO maybe tell other people about stacking for knockbacks
      id: 'E3S Sundering Waters',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Sundering Waters from (?:.*) for (.*) Seconds/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: function(data, matches) {
        let seconds = matches[2];
        if (seconds <= 8) {
          return {
            en: 'Knockback on YOU',
          };
        }
      },
      infoText: function(data, matches) {
        let seconds = matches[2];
        if (seconds <= 8)
          return;
        if (seconds <= 21) {
          return {
            en: 'Late First Knockback',
          };
        }
        return {
          en: 'Late Second Knockback',
        };
      },
    },
    {
      // 29 seconds
      id: 'E3S Scouring Waters',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Scouring Waters/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Defamation',
      },
    },
    {
      id: 'E3S Scouring Waters',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Scouring Waters/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      delaySeconds: 22,
      infoText: {
        en: 'Avoid Knockback, Move to Back',
      },
    },
    {
      id: 'E3S Scouring Waters',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Scouring Waters/,
      condition: function(data, matches) {
        return data.me != matches[1];
      },
      delaySeconds: 25,
      infoText: {
        en: 'Move In, Avoid Defamation',
      },
    },
    {
      id: 'E3S Sweeping Waters',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Sundering Waters from (?:.*) for (.*) Seconds/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Tank Cone',
      },
    },
    {
      id: 'E3S Sweeping Waters',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Sundering Waters from (?:.*) for (.*) Seconds/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      delaySeconds: 13,
      infoText: {
        en: 'Tank Cone',
      },
    },
    {
      id: 'E3S Front Left Temporary Current',
      regex: / 14:3FEB:Leviathan starts using Temporary Current/,
      infoText: {
        en: 'front left / back right',
      },
    },
    {
      id: 'E3S Front Right Temporary Current',
      regex: / 14:3FEA:Leviathan starts using Temporary Current/,
      infoText: {
        en: 'front right / back left',
      },
    },
    {
      id: 'E3S Front Left Temporary Current 2',
      regex: / 14:3FED:Leviathan starts using Temporary Current/,
      infoText: {
        en: 'front left / back right',
      },
    },
    {
      id: 'E3S Front Right Temporary Current 2',
      regex: / 14:3FEC:Leviathan starts using Temporary Current/,
      infoText: {
        en: 'front right / back left',
      },
    },
  ],
}];
