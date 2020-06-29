'use strict';

[{
  zoneRegex: {
    en: /^Eden's Verse: Fulmination$/,
    ko: /^희망의 낙원 에덴: 공명편 \(1\)$/,
  },
  zoneId: ZoneId.EdensVerseFulmination,
  damageWarn: {
    'Impact': '4E3A', // Stratospear landing AoE
    'Lightning Bolt': '4B9C', // Stormcloud standard attack
    'Gallop': '4B97', // Sideways add charge
    'Shock Strike': '4BA1', // Small AoE circles during Thunderstorm
    'Volt Strike': '4CF2', // Large AoE circles during Thunderstorm
  },
  damageFail: {
    'Judgment Jolt': '4B8F', // Stratospear explosions
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
        return !data.hasOrb[e.targetName];
      },
      mistake: function(e) {
        return { type: 'fail', blame: e.targetName, text: e.abilityName + ' (no orb)' };
      },
    },
    {
      id: 'E5N Stormcloud Target Tracking',
      regex: Regexes.headMarker({ id: '006E' }),
      run: function(e, data, matches) {
        data.cloudMarkers = data.cloudMarkers || [];
        data.cloudMarkers.push(matches.target);
      },
    },
    {
      // This ability is seen only if players stacked the clouds instead of spreading them.
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
