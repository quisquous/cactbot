import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';

import { playerDamageFields } from '../../../oopsy_common';

// Ultima Weapon Ultimate
export default {
  zoneId: ZoneId.TheWeaponsRefrainUltimate,
  damageWarn: {
    'UWU Searing Wind': '2B5C',
    'UWU Eruption': '2B5A',
    'UWU Weight': '2B65',
    'UWU Landslide1': '2B70',
    'UWU Landslide2': '2B71',
  },
  damageFail: {
    'UWU Great Whirlwind': '2B41',
    'UWU Slipstream': '2B53',
    'UWU Wicked Wheel': '2B4E',
    'UWU Wicked Tornado': '2B4F',
  },
  triggers: [
    {
      id: 'UWU Windburn',
      netRegex: NetRegexes.gainsEffect({ effectId: 'EB' }),
      suppressSeconds: 2,
      mistake: (_e, _data, matches) => {
        return { type: 'warn', blame: matches.target, text: matches.effect };
      },
    },
    {
      // Featherlance explosion.  It seems like the person who pops it is the
      // first person listed damage-wise, so they are likely the culprit.
      id: 'UWU Featherlance',
      netRegex: NetRegexes.abilityFull({ id: '2B43', ...playerDamageFields }),
      collectSeconds: 0.5,
      suppressSeconds: 5,
      mistake: (_e, _data, matches) => {
        return { type: 'fail', blame: matches[0].target, text: matches[0].source };
      },
    },
  ],
};
