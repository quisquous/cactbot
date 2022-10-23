import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';
import { playerDamageFields } from '../../../oopsy_common';

export type Data = OopsyData;

// O2S - Deltascape 2.0 Savage
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.DeltascapeV20Savage,
  damageWarn: {
    'O2S Weighted Wing': '23EF', // Unstable Gravity explosions on players (after Long Drop)
    'O2S Gravitational Explosion 1': '2367', // failing Four Fold Sacrifice 4 person stack
    'O2S Gravitational Explosion 2': '2368', // failing Four Fold Sacrifice 4 person stack
    'O2S Main Quake': '2359', // untelegraphed explosions from epicenter tentacles
  },
  gainsEffectFail: {
    'O2S Stone Curse': '589', // failing Death's Gaze or taking too many tankbuster stacks
  },
  triggers: [
    {
      // ground blue arena circles; (probably?) only do damage if not floating
      // TODO: usually this just doesn't hit anybody at all, due to patterns.
      // Floating over one is untested.
      id: 'O2S Petrosphere Explosion',
      type: 'Ability',
      netRegex: NetRegexes.abilityFull({ id: '245D', ...playerDamageFields }),
      condition: (data, matches) => data.DamageFromMatches(matches) > 0,
      mistake: (_data, matches) => {
        return { type: 'warn', blame: matches.target, reportId: matches.targetId, text: matches.ability };
      },
    },
    {
      // floating yellow arena circles; only do damage if floating
      id: 'O2S Potent Petrosphere Explosion',
      type: 'Ability',
      netRegex: NetRegexes.abilityFull({ id: '2362', ...playerDamageFields }),
      condition: (data, matches) => data.DamageFromMatches(matches) > 0,
      mistake: (_data, matches) => {
        return { type: 'warn', blame: matches.target, reportId: matches.targetId, text: matches.ability };
      },
    },
    {
      // Must be floating to survive; hits everyone but only does damage if not floating.
      id: 'O2S Earthquake',
      type: 'Ability',
      netRegex: NetRegexes.abilityFull({ id: '247A', ...playerDamageFields }),
      condition: (data, matches) => data.DamageFromMatches(matches) > 0,
      mistake: (_data, matches) => {
        return { type: 'warn', blame: matches.target, reportId: matches.targetId, text: matches.ability };
      },
    },
  ],
};

export default triggerSet;
