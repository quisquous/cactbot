import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';

export default {
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
      mistake: (_e, _data, matches) => {
        return { type: 'warn', blame: matches.target, text: matches.effect };
      },
    },
    {
      // Helper for orb pickup failures
      id: 'E5N Orb Gain',
      netRegex: NetRegexes.gainsEffect({ effectId: '8B4' }),
      run: (_e, data, matches) => {
        data.hasOrb = data.hasOrb || {};
        data.hasOrb[matches.target] = true;
      },
    },
    {
      id: 'E5N Orb Lose',
      netRegex: NetRegexes.losesEffect({ effectId: '8B4' }),
      run: (_e, data, matches) => {
        data.hasOrb = data.hasOrb || {};
        data.hasOrb[matches.target] = false;
      },
    },
    {
      id: 'E5N Divine Judgement Volts',
      damageRegex: '4B9A',
      condition: (e, data) => !data.hasOrb[e.targetName],
      mistake: (e) => {
        return {
          type: 'fail',
          blame: e.targetName,
          text: {
            en: e.abilityName + ' (no orb)',
            de: e.abilityName + ' (kein Orb)',
            fr: e.abilityName + '(pas d\'orbe)',
            ja: e.abilityName + '(雷玉無し)',
            cn: e.abilityName + '(没吃球)',
          },
        };
      },
    },
    {
      id: 'E5N Stormcloud Target Tracking',
      netRegex: NetRegexes.headMarker({ id: '006E' }),
      run: (_e, data, matches) => {
        data.cloudMarkers = data.cloudMarkers || [];
        data.cloudMarkers.push(matches.target);
      },
    },
    {
      // This ability is seen only if players stacked the clouds instead of spreading them.
      id: 'E5N The Parting Clouds',
      damageRegex: '4B9D',
      suppressSeconds: 30,
      mistake: (e, data) => {
        for (const m of data.cloudMarkers) {
          return {
            type: 'fail',
            blame: data.cloudMarkers[m],
            text: {
              en: e.abilityName + '(clouds too close)',
              de: e.abilityName + '(Wolken zu nahe)',
              fr: e.abilityName + '(nuages trop proches)',
              ja: e.abilityName + '(雲近すぎ)',
              cn: e.abilityName + '(雷云重叠)',
            },
          };
        }
      },
    },
    {
      id: 'E5N Stormcloud cleanup',
      netRegex: NetRegexes.headMarker({ id: '006E' }),
      delaySeconds: 30, // Stormclouds resolve well before this.
      run: (_e, data) => {
        delete data.cloudMarkers;
      },
    },
  ],
};
