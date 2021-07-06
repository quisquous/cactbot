import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';
import { playerDamageFields } from '../../../oopsy_common';

export type Data = OopsyData;

// TODO: shadoweye failure
// TODO: Empty Hate (3E59/3E5A) hits everybody, so hard to tell about knockback
// TODO: maybe mark hell wind people who got clipped by stack?
// TODO: missing puddles?
// TODO: missing light/dark circle stack

const triggerSet: OopsyTriggerSet<Data> = {
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
      type: 'GainsEffect',
      // Stone Curse
      netRegex: NetRegexes.gainsEffect({ effectId: '589' }),
      mistake: (_data, matches) => {
        return { type: 'fail', blame: matches.target, text: matches.effect };
      },
    },
    {
      id: 'E2S Nyx',
      type: 'Ability',
      netRegex: NetRegexes.abilityFull({ id: '3E51', ...playerDamageFields }),
      mistake: (_data, matches) => {
        return {
          type: 'warn',
          blame: matches.target,
          text: {
            en: 'Booped',
            de: matches.ability, // FIXME
            fr: 'Malus de dégâts',
            ja: matches.ability, // FIXME
            cn: matches.ability, // FIXME
            ko: '닉스',
          },
        };
      },
    },
  ],
};

export default triggerSet;
