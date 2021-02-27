import NetRegexes from '../../../../../resources/netregexes.js';
import ZoneId from '../../../../../resources/zone_id.js';

// TODO: shadoweye failure
// TODO: Empty Hate (3E59/3E5A) hits everybody, so hard to tell about knockback
// TODO: maybe mark hell wind people who got clipped by stack?
// TODO: missing puddles?
// TODO: missing light/dark circle stack
export default {
  zoneId: ZoneId.EdensGateDescentSavage,
  damageWarn: {
    'E2S Doomvoid Slicer': '3E50',
    'E3S Empty Rage': '3E6C',
    'E3S Doomvoid Guillotine': '3E4F',
  },
  shareWarn: {
    'E2S Doomvoid Cleaver': '3E64',
  },
  triggers: [
    {
      id: 'E2S Shadoweye',
      // Stone Curse
      netRegex: NetRegexes.gainsEffect({ effectId: '589' }),
      mistake: function(e, data, matches) {
        return { type: 'fail', blame: matches.target, text: matches.effect };
      },
    },
    {
      id: 'E2S Nyx',
      damageRegex: '3E51',
      mistake: function(e, data) {
        return {
          type: 'warn',
          blame: e.targetName,
          text: {
            en: 'Booped',
            de: e.abilityName,
            fr: 'Malus de dégâts',
            ja: e.abilityName,
            cn: '攻击伤害降低',
            ko: '닉스',
          },
        };
      },
    },
  ],
};
