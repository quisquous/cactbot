'use strict';

// TODO: no orb on deadly discharge (4BB1 vs 4BAF, which is the one you need an orb?)
// TODO: is there a different ability if the shield duty action isn't used properly?
// TODO: is there an ability from Raiden (the bird) if you get eaten?
// TODO: maybe chain lightning warning if you get hit while you have system shock (8B8)

[{
  zoneRegex: {
    en: /^Eden's Verse: Fulmination \(Savage\)$/,
    ko: /^희망의 낙원 에덴: 공명편\(영웅\) \(1\)$/,
  },
  damageWarn: {
    'Impact': '4E3B', // Stratospear landing AoE
    'Lightning Bolt': '4BB9', // Stormcloud standard attack
    'Gallop': '4BB4', // Sideways add charge
    'Shock Strike': '4BC1', // Small AoE circles during Thunderstorm
    'Stepped Leader Twister': '4BC7', // Twister stepped leader
    'Stepped Leader Donut': '4BC8', // Donut stepped leader
    'Shock': '4E3D', // Hated of Levin Stormcloud-cleansable exploding debuff
  },
  damageFail: {
    'Judgment Jolt': '4BA7', // Stratospear explosions
  },
  triggers: [
    {
      // Helper for orb pickup failures
      id: 'E5S Orb Tracking',
      gainsEffectRegex: gLang.kEffect.SurgeProtection,
      losesEffectRegex: gLang.kEffect.SurgeProtection,
      run: function(e, data) {
        data.hasOrb = data.hasOrb || {};
        data.hasOrb[e.targetName] = e.gains;
      },
    },
    {
      id: 'E5S Divine Judgement Volts',
      damageRegex: '4BB7',
      condition: function(e, data) {
        return !data.hasOrb[e.targetName];
      },
      mistake: function(e) {
        return { type: 'fail', blame: e.targetName, text: e.abilityName + ' (no orb)' };
      },
    },
    {
      // Large AoE circles during Thunderstorm
      id: 'E5S Volt Strike Double',
      damageRegex: '4BC3',
      condition: function(e, data) {
        // Double taps only.
        return e.type != '15';
      },
      mistake: function(e, data) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'E5S Volt Strike Orb',
      damageRegex: '4BC3',
      condition: function(e, data) {
        return !data.hasOrb[e.targetName];
      },
      mistake: function(e) {
        return { type: 'fail', blame: e.targetName, text: e.abilityName + ' (no orb)' };
      },
    },
    {
      id: 'E5S Crippling Blow',
      damageRegex: '4BCA',
      condition: function(e, data) {
        // Double taps only.
        return e.type != '15';
      },
      mistake: function(e, data) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'E5S Stormcloud Target Tracking',
      regex: Regexes.headMarker({ id: '006E' }),
      run: function(e, data) {
        data.cloudMarkers = data.cloudMarkers || [];
        data.cloudMarkers.push(e.targetName);
      },
    },
    {
      // This ability is seen only if players stacked the clouds instead of spreading them.
      id: 'E5S The Parting Clouds',
      damageRegex: '4BBA',
      suppressSeconds: 30,
      mistake: function(e, data) {
        for (let m of data.cloudMarkers) {
          return {
            type: 'fail',
            blame: data.cloudMarkers[m],
            text: e.abilityName + '(clouds too close)',
          };
        }
      },
    },
    {
      id: 'E5S Stormcloud cleanup',
      regex: Regexes.headMarker({ id: '006E' }),
      delaySeconds: 30, // Stormclouds resolve well before this.
      run: function(e, data) {
        delete data.cloudMarkers;
      },
    },
    {
      id: 'E5S Chain Lightning Double',
      damageRegex: '4BC5',
      condition: function(e, data) {
        // Double taps only.
        return e.type != '15';
      },
      mistake: function(e, data) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
  ],
}];
