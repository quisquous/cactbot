import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';
import { playerDamageFields } from '../../../oopsy_common';

export type Data = OopsyData;

// Lakshmi Normal
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.Emanation,
  damageWarn: {
    'Lakshmi Blissful Spear Cross': '248B', // blissful arrow's cross lines (called Blissful Spear)
    'Lakshmi Blissful Spear Cross Chanchala': '248C', // blissful arrow's cross lines (called Blissful Spear)
  },
  gainsEffectWarn: {
    'Lakshmi Bleeding': '140', // standing in expanding blue flower circle
  },
  gainsEffectFail: {
    'Lakshmi Dreaming Kshatriya Terror': '42', // failing Inner Demons from initial add
  },
  shareWarn: {
    'Lakshmi Blissful Arrow': '2489', // cross marker dropping
    'Lakshmi Blissful Arrow Chanchala': '248A', // cross marker dropping
    'Lakshmi Blissful Spear': '2494', // flower circle dropping
    'Lakshmi Blissful Spear Chanchala': '2495', // flower circle dropping
    'Lakshmi The Path of Light': '24A1', // OT cleave
  },
  soloWarn: {
    'Lakshmi The Pall of Light': '2491', // stack
  },
  triggers: [
    {
      id: 'Lakshmi Divine Denial Knocked Off',
      type: 'Ability',
      netRegex: NetRegexes.abilityFull({ id: '2485', ...playerDamageFields }),
      deathReason: (_data, matches) => {
        return {
          id: matches.targetId,
          name: matches.target,
          text: {
            en: 'Knocked off',
            de: 'Runtergefallen',
            fr: 'Renversé(e)',
            ja: 'ノックバック',
            cn: '击退坠落',
            ko: '넉백',
          },
        };
      },
    },
  ],
};

export default triggerSet;
