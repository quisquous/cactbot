import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';

import { playerDamageFields } from '../../../oopsy_common';

// O2N - Deltascape 2.0 Normal
export default {
  zoneId: ZoneId.DeltascapeV20,
  damageWarn: {
    'O2N Main Quake': '24A5', // Non-telegraphed circle AoE, Fleshy Member
    'O2N Erosion': '2590', // Small circle AoEs, Fleshy Member
  },
  shareWarn: {
    'O2N Paranormal Wave': '250E', // Instant tank cleave
  },
  triggers: [
    {
      // We could try to separate out the mistake that led to the player being petrified.
      // However, it's Normal mode, why overthink it?
      id: 'O2N Petrification',
      netRegex: NetRegexes.gainsEffect({ effectId: '262' }),
      // The user might get hit by another petrifying ability before the effect ends.
      // There's no point in notifying for that.
      suppressSeconds: 10,
      mistake: (_data, matches) => {
        return { type: 'warn', blame: matches.target, text: matches.effect };
      },
    },
    {
      id: 'O2N Earthquake',
      netRegex: NetRegexes.abilityFull({ id: '2515', ...playerDamageFields }),
      // This deals damage only to non-floating targets.
      condition: (data, matches) => data.DamageFromMatches(matches) > 0,
      mistake: (_data, matches) => {
        return { type: 'warn', blame: matches.target, text: matches.ability };
      },
    },
  ],
};
