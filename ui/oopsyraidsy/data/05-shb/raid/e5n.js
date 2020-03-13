'use strict';

[{
  zoneRegex: {
    en: /^Eden's Verse: Fulmination$/,
    ko: /^희망의 낙원 에덴: 공명편 \(1\)$/,
  },
  damageWarn: {
    '4B8F': 'Judgment Jolt', // Stratospear explosions
    '4E3A': 'Impact', // Stratospear landing AoE
    '4B9C': 'Lightning Bolt', // Stormcloud standard attack
    '4B97': 'Gallop', // Sideways add charge
    '4BA1': 'Shock Strike', // Small AoE circles during Thunderstorm
    '4CF2': 'Volt Strike', // Large AoE circles during Thunderstorm

  },
  damageFail: {
  },
  triggers: [
    {
      // This happens when a player gets 4+ stacks of orbs. Don't be greedy!
      id: 'E5N Static Condensation',
      gainsEffectRegex: gLang.kEffect.StaticCondensation,
      mistake: function(e) {
        return { type: 'warn', blame: e.targetName, text: e.effectName };
      },
    },
    {
      // Helper for orb pickup failures
      id: 'E5N Orb Tracking',
      gainsEffectRegex: gLang.kEffect.SurgeProtection,
      losesEffectRegex: gLang.kEffect.SurgeProtection,
      run: function(e, data) {
        data.hasOrb = data.hasOrb || {};
        data.hasOrb[e.targetName] = e.gains;
      },
    },
    {
      id: 'E5N Divine Judgement Volts',
      damageRegex: '4B9A',
      condition: function(e, data) {
        return !data.hasOrb;
      },
      mistake: function(e) {
        return { type: 'fail', blame: e.targetName, text: e.abilityName + ' (no orb)' };
      },
    },
    {
      id: 'E5N Stormcloud Target Tracking',
      regex: Regexes.headMarker({ id: '006E' }),
      run: function(e, data) {
        data.cloudMarkers = data.cloudMarkers || [];
        data.cloudMarkers.push(e.targetName);
      },
    },
    {
      // This ability is seen only if players stacked the clounds instead of spreading them.
      id: 'E5N The Parting Clouds',
      damageRegex: '4B9D',
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
      id: 'E5N Stormcloud cleanup',
      regex: Regexes.headMarker({ id: '006E' }),
      delaySeconds: 30, // Stormclouds resolve well before this.
      run: function(e, data) {
        delete data.cloudMarkers;
      },
    },
  ],
}];
