import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

// It's hard to capture the reflection abilities from Leviathan's Head and Tail if you use
// ranged physical attacks / magic attacks respectively, as the ability names are the
// ability you used and don't appear to show up in the log as normal "ability" lines.
// That said, dots still tick independently on both so it's likely that people will atack
// them anyway.

// TODO: Figure out why Dread Tide / Waterspout appear like shares (i.e. 0x16 id).
// Dread Tide = 823/824/825, Waterspout = 829

// Leviathan Extreme
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheWhorleaterExtreme,
  damageWarn: {
    'LeviEx Grand Fall': '82F', // very large circular aoe before spinny dives, applies heavy
    'LeviEx Hydro Shot': '748', // Wavespine Sahagin aoe that gives Dropsy effect
    'LeviEx Dreadstorm': '749', // Wavetooth Sahagin aoe that gives Hysteria effect
  },
  damageFail: {
    'LeviEx Body Slam': '82A', // levi slam that tilts the boat
    'LeviEx Spinning Dive 1': '88A', // levi dash across the boat with knockback
    'LeviEx Spinning Dive 2': '88B', // levi dash across the boat with knockback
    'LeviEx Spinning Dive 3': '82C', // levi dash across the boat with knockback
  },
  gainsEffectWarn: {
    'LeviEx Dropsy': '110', // standing in the hydro shot from the Wavespine Sahagin
  },
  gainsEffectFail: {
    'LeviEx Hysteria': '128', // standing in the dreadstorm from the Wavetooth Sahagin
  },
  triggers: [
    {
      id: 'LeviEx Body Slam Knocked Off',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '82A' }),
      deathReason: (_data, matches) => {
        return {
          type: 'fail',
          name: matches.target,
          text: {
            en: 'Knocked off',
            de: 'Runtergefallen',
            fr: 'A été assommé(e)',
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
