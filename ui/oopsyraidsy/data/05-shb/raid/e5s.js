import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';

import { playerDamageFields } from '../../../oopsy_common';

// TODO: is there a different ability if the shield duty action isn't used properly?
// TODO: is there an ability from Raiden (the bird) if you get eaten?
// TODO: maybe chain lightning warning if you get hit while you have system shock (8B8)

const noOrb = (str) => {
  return {
    en: str + ' (no orb)',
    de: str + ' (kein Orb)',
    fr: str + ' (pas d\'orbe)',
    ja: str + ' (雷玉無し)',
    cn: str + ' (没吃球)',
    ko: str + ' (구슬 없음)',
  };
};

export default {
  zoneId: ZoneId.EdensVerseFulminationSavage,
  damageWarn: {
    'E5S Impact': '4E3B', // Stratospear landing AoE
    'E5S Gallop': '4BB4', // Sideways add charge
    'E5S Shock Strike': '4BC1', // Small AoE circles during Thunderstorm
    'E5S Stepped Leader Twister': '4BC7', // Twister stepped leader
    'E5S Stepped Leader Donut': '4BC8', // Donut stepped leader
    'E5S Shock': '4E3D', // Hated of Levin Stormcloud-cleansable exploding debuff
  },
  damageFail: {
    'E5S Judgment Jolt': '4BA7', // Stratospear explosions
  },
  shareWarn: {
    'E5S Volt Strike Double': '4BC3', // Large AoE circles during Thunderstorm
    'E5S Crippling Blow': '4BCA',
    'E5S Chain Lightning Double': '4BC5',
  },
  triggers: [
    {
      // Helper for orb pickup failures
      id: 'E5S Orb Gain',
      netRegex: NetRegexes.gainsEffect({ effectId: '8B4' }),
      run: (data, matches) => {
        data.hasOrb = data.hasOrb || {};
        data.hasOrb[matches.target] = true;
      },
    },
    {
      id: 'E5S Orb Lose',
      netRegex: NetRegexes.losesEffect({ effectId: '8B4' }),
      run: (data, matches) => {
        data.hasOrb = data.hasOrb || {};
        data.hasOrb[matches.target] = false;
      },
    },
    {
      id: 'E5S Divine Judgement Volts',
      netRegex: NetRegexes.abilityFull({ id: '4BB7', ...playerDamageFields }),
      condition: (data, matches) => !data.hasOrb || !data.hasOrb[matches.target],
      mistake: (_data, matches) => {
        return { type: 'fail', blame: matches.target, text: noOrb(matches.ability) };
      },
    },
    {
      id: 'E5S Volt Strike Orb',
      netRegex: NetRegexes.abilityFull({ id: '4BC3', ...playerDamageFields }),
      condition: (data, matches) => !data.hasOrb || !data.hasOrb[matches.target],
      mistake: (_data, matches) => {
        return { type: 'fail', blame: matches.target, text: noOrb(matches.ability) };
      },
    },
    {
      id: 'E5S Deadly Discharge Big Knockback',
      netRegex: NetRegexes.abilityFull({ id: '4BB2', ...playerDamageFields }),
      condition: (data, matches) => !data.hasOrb || !data.hasOrb[matches.target],
      mistake: (_data, matches) => {
        return { type: 'fail', blame: matches.target, text: noOrb(matches.ability) };
      },
    },
    {
      id: 'E5S Lightning Bolt',
      netRegex: NetRegexes.abilityFull({ id: '4BB9', ...playerDamageFields }),
      condition: (data, matches) => {
        // Having a non-idempotent condition function is a bit <_<
        // Only consider lightning bolt damage if you have a debuff to clear.
        if (!data.hated || !data.hated[matches.target])
          return true;

        delete data.hated[matches.target];
        return false;
      },
      mistake: (_data, matches) => {
        return { type: 'warn', blame: matches.target, text: matches.ability };
      },
    },
    {
      id: 'E5S Hated of Levin',
      netRegex: NetRegexes.headMarker({ id: '00D2' }),
      run: (data, matches) => {
        data.hated = data.hated || {};
        data.hated[matches.target] = true;
      },
    },
    {
      id: 'E5S Stormcloud Target Tracking',
      netRegex: NetRegexes.headMarker({ id: '006E' }),
      run: (data, matches) => {
        data.cloudMarkers = data.cloudMarkers || [];
        data.cloudMarkers.push(matches.target);
      },
    },
    {
      // This ability is seen only if players stacked the clouds instead of spreading them.
      id: 'E5S The Parting Clouds',
      netRegex: NetRegexes.abilityFull({ id: '4BBA', ...playerDamageFields }),
      suppressSeconds: 30,
      mistake: (data, matches) => {
        for (const m of data.cloudMarkers) {
          return {
            type: 'fail',
            blame: data.cloudMarkers[m],
            text: {
              en: `${matches.ability} (clouds too close)`,
              de: `${matches.ability} (Wolken zu nahe)`,
              fr: `${matches.ability} (nuages trop proches)`,
              ja: `${matches.ability} (雲近すぎ)`,
              cn: `${matches.ability} (雷云重叠)`,
            },
          };
        }
      },
    },
    {
      id: 'E5S Stormcloud cleanup',
      netRegex: NetRegexes.headMarker({ id: '006E' }),
      // Stormclouds resolve well before this.
      delaySeconds: 30,
      run: (data) => {
        delete data.cloudMarkers;
        delete data.hated;
      },
    },
  ],
};
