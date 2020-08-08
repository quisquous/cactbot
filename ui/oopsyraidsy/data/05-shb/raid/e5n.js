'use strict';

[{
  zoneId: ZoneId.EdensVerseFulmination,
  damageWarn: {
    'E5N Impact': '4E3A', // Stratospear landing AoE
    'E5N Lightning Bolt': '4B9C', // Stormcloud standard attack
    'E5N Gallop': '4B97', // Sideways add charge
    'E5N Shock Strike': '4BA1', // Small AoE circles during Thunderstorm
    'E5N Volt Strike': '4CF2', // Large AoE circles during Thunderstorm
  },
  damageFail: {
    'E5N Judgment Jolt': '4B8F', // Stratospear explosions
  },
  triggers: [
    {
      // This happens when a player gets 4+ stacks of orbs. Don't be greedy!
      id: 'E5N Static Condensation',
      netRegex: NetRegexes.gainsEffect({ effectId: '8B5' }),
      mistake: function(e, data, matches) {
        return { type: 'warn', blame: matches.target, text: matches.effect };
      },
    },
    {
      // Helper for orb pickup failures
      id: 'E5N Orb Gain',
      netRegex: NetRegexes.gainsEffect({ effectId: '8B4' }),
      run: function(e, data, matches) {
        data.hasOrb = data.hasOrb || {};
        data.hasOrb[matches.target] = true;
      },
    },
    {
      id: 'E5N Orb Lose',
      netRegex: NetRegexes.losesEffect({ effectId: '8B4' }),
      run: function(e, data, matches) {
        data.hasOrb = data.hasOrb || {};
        data.hasOrb[matches.target] = false;
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
      netRegex: NetRegexes.headMarker({ id: '006E' }),
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
      netRegex: NetRegexes.headMarker({ id: '006E' }),
      delaySeconds: 30, // Stormclouds resolve well before this.
      run: function(e, data) {
        delete data.cloudMarkers;
      },
    },
  ],
}];
