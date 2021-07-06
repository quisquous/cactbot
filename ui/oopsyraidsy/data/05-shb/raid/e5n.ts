import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';
import { playerDamageFields } from '../../../oopsy_common';

export interface Data extends OopsyData {
  hasOrb?: { [name: string]: boolean };
  cloudMarkers?: string[];
}

const triggerSet: OopsyTriggerSet<Data> = {
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
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '8B5' }),
      mistake: (_data, matches) => {
        return { type: 'warn', blame: matches.target, text: matches.effect };
      },
    },
    {
      // Helper for orb pickup failures
      id: 'E5N Orb Gain',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '8B4' }),
      run: (data, matches) => {
        data.hasOrb ??= {};
        data.hasOrb[matches.target] = true;
      },
    },
    {
      id: 'E5N Orb Lose',
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ effectId: '8B4' }),
      run: (data, matches) => {
        data.hasOrb ??= {};
        data.hasOrb[matches.target] = false;
      },
    },
    {
      id: 'E5N Divine Judgement Volts',
      type: 'Ability',
      netRegex: NetRegexes.abilityFull({ id: '4B9A', ...playerDamageFields }),
      condition: (data, matches) => !data.hasOrb || !data.hasOrb[matches.target],
      mistake: (_data, matches) => {
        return {
          type: 'fail',
          blame: matches.target,
          text: {
            en: `${matches.ability} (no orb)`,
            de: `${matches.ability} (kein Orb)`,
            fr: `${matches.ability} (pas d'orbe)`,
            ja: `${matches.ability} (雷玉無し)`,
            cn: `${matches.ability} (没吃球)`,
          },
        };
      },
    },
    {
      id: 'E5N Stormcloud Target Tracking',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '006E' }),
      run: (data, matches) => {
        data.cloudMarkers ??= [];
        data.cloudMarkers.push(matches.target);
      },
    },
    {
      // This ability is seen only if players stacked the clouds instead of spreading them.
      id: 'E5N The Parting Clouds',
      type: 'Ability',
      netRegex: NetRegexes.abilityFull({ id: '4B9D', ...playerDamageFields }),
      suppressSeconds: 30,
      mistake: (data, matches) => {
        for (const name of data.cloudMarkers ?? []) {
          return {
            type: 'fail',
            blame: name,
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
      id: 'E5N Stormcloud cleanup',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '006E' }),
      delaySeconds: 30, // Stormclouds resolve well before this.
      run: (data) => {
        delete data.cloudMarkers;
      },
    },
  ],
};

export default triggerSet;
