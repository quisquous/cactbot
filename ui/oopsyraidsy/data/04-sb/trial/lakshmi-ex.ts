import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';
import { playerDamageFields } from '../../../oopsy_common';

// Note: flower circle in extreme is called Blissful Hammer, whereas in normal
// both the cross from the Blissful Arrow and the flower circle are both called
// Blissful Spear.

export type Data = OopsyData;

// Lakshmi Extreme
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.EmanationExtreme,
  damageWarn: {
    'LakshmiEx Blissful Spear Cross': '2151', // blissful arrow's cross lines (called Blissful Spear)
    'LakshmiEx Blissful Spear Cross Chanchala': '2152', // blissful arrow's cross lines (called Blissful Spear)
  },
  gainsEffectWarn: {
    'LakshmiEx Bleeding': '140', // standing in expanding blue flower circle
  },
  gainsEffectFail: {
    'LakshmiEx Dreaming Kshatriya Terror': '42', // failing Inner Demons from initial add
  },
  shareWarn: {
    'LakshmiEx Dreaming Kshatriya Tail Slap': '258C', // untelegraphed no cast bar cleave
    'LakshmiEx Blissful Arrow': '214F', // cross marker dropping
    'LakshmiEx Blissful Arrow Chanchala': '2150', // cross marker dropping
    'LakshmiEx Blissful Hammer': '21DC', // flower circle dropping
    'LakshmiEx Blissful Hammer Chanchala': '21DD', // flower circle droping
    'LakshmiEx The Path of Light': '215A', // OT cleave
    'LakshmiEx The Path of Light Chanchala': '215B', // OT cleave
  },
  soloWarn: {
    'LakshmiEx The Pall of Light': '215C', // stack
  },
  triggers: [
    {
      id: 'LakshmiEx Divine Denial Knocked Off',
      type: 'Ability',
      netRegex: NetRegexes.abilityFull({ id: '2149', ...playerDamageFields }),
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
