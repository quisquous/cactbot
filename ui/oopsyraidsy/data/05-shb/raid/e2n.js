import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';

import { playerDamageFields } from '../../../oopsy_common';

// TODO: shadoweye failure (top line fail, bottom line success, effect there too)
// [16:17:35.966] 16:400110FE:Voidwalker:40B7:Shadoweye:10612345:Tini Poutini:F:10000:100190F:
// [16:17:35.966] 16:400110FE:Voidwalker:40B7:Shadoweye:1067890A:Potato Chippy:1:0:1C:8000:
// gains the effect of Petrification from Voidwalker for 10.00 Seconds.
// TODO: puddle failure?
export default {
  zoneId: ZoneId.EdensGateDescent,
  damageWarn: {
    'E2N Doomvoid Slicer': '3E3C',
    'E2N Doomvoid Guillotine': '3E3B',
  },
  triggers: [
    {
      id: 'E2N Nyx',
      netRegex: NetRegexes.abilityFull({ id: '3E3D', ...playerDamageFields }),
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
