import ZoneId from '../../../../../resources/zone_id';

// It's hard to capture the reflection abilities from Leviathan's Head and Tail if you use
// ranged physical attacks / magic attacks respectively, as the ability names are the
// ability you used and don't appear to show up in the log as normal "ability" lines.
// That said, dots still tick independently on both so it's likely that people will atack
// them anyway.

// Leviathan Extreme
export default {
  zoneId: ZoneId.TheWhorleaterExtreme,
  damageWarn: {
    'LeviEx Grand Fall': '82F', // very large circular aoe before spinny dives, applies heavy
    'LeviEx Hydro Shot': '748', // Wavespine Sahagin aoe that gives Dropsy effect
    'LeviEx Dreadstorm': '749', // Wavetooth Sahagin aoe that gives Hysteria effect
  },
  damageFail: {
    'LeviEx Body Slam': '82A', // levi slam that tilts the boat
    'LeviEx Spinning Dive': '82C', // levi dash across the boat with knockback
  },
  shareWarn: {
    'LeviEx Dread Tide 1': '823', // Triple hit line aoe from head aimed at tank
    'LeviEx Dread Tide 2': '824', // triple hit line aoe from head aimed at tank
    'LeviEx Dread Tide 3': '825', // triple hit line aoe from head aimed at tank
    'LeviEx Water Spout': '829', // small circular water aoe on healers
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
      netRegex: NetRegexes.ability({ id: '82A' }),
      deathReason: (e, data, matches) => {
        return {
          type: 'fail',
          name: matches.target,
          reason: {
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
