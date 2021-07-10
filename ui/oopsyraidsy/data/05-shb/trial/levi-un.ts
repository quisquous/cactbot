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
// Dread Tide = 5CCA/5CCB/5CCC, Waterspout = 5CD1

// Leviathan Unreal
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheWhorleaterUnreal,
  damageWarn: {
    'LeviUn Grand Fall': '5CDF', // very large circular aoe before spinny dives, applies heavy
    'LeviUn Hydroshot': '5CD5', // Wavespine Sahagin aoe that gives Dropsy effect
    'LeviUn Dreadstorm': '5CD6', // Wavetooth Sahagin aoe that gives Hysteria effect
  },
  damageFail: {
    'LeviUn Body Slam': '5CD2', // levi slam that tilts the boat
    'LeviUn Spinning Dive 1': '5CDB', // levi dash across the boat with knockback
    'LeviUn Spinning Dive 2': '5CE3', // levi dash across the boat with knockback
    'LeviUn Spinning Dive 3': '5CE8', // levi dash across the boat with knockback
    'LeviUn Spinning Dive 4': '5CE9', // levi dash across the boat with knockback
  },
  gainsEffectWarn: {
    'LeviUn Dropsy': '110', // standing in the hydro shot from the Wavespine Sahagin
  },
  gainsEffectFail: {
    'LeviUn Hysteria': '128', // standing in the dreadstorm from the Wavetooth Sahagin
  },
  triggers: [
    {
      id: 'LeviUn Body Slam Knocked Off',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '5CD2' }),
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
