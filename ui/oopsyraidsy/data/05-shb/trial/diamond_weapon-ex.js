import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';

// TODO: warning for taking Diamond Flash (5FA1) stack on your own?

// Diamond Weapon Extreme
export default {
  zoneId: ZoneId.TheCloudDeckExtreme,
  damageWarn: {
    'DiamondEx Auri Arts 1': '5FAF', // Auri Arts dashes/explosions
    'DiamondEx Auri Arts 2': '5FB2', // Auri Arts dashes/explosions
    'DiamondEx Auri Arts 3': '5FCD', // Auri Arts dashes/explosions
    'DiamondEx Auri Arts 4': '5FCE', // Auri Arts dashes/explosions
    'DiamondEx Auri Arts 5': '5FCF', // Auri Arts dashes/explosions
    'DiamondEx Auri Arts 6': '5FF8', // Auri Arts dashes/explosions
    'DiamondEx Auri Arts 7': '6159', // Auri Arts dashes/explosions
    'DiamondEx Articulated Bit Aetherial Bullet': '5FAB', // bit lasers during all phases
    'DiamondEx Diamond Shrapnel 1': '5FCB', // chasing circles
    'DiamondEx Diamond Shrapnel 2': '5FCC', // chasing circles
  },
  damageFail: {
    'DiamondEx Claw Swipe Left': '5FC2', // Adamant Purge platform cleave
    'DiamondEx Claw Swipe Right': '5FC3', // Adamant Purge platform cleave
    'DiamondEx Auri Cyclone 1': '5FD1', // standing on the blue knockback puck
    'DiamondEx Auri Cyclone 2': '5FD2', // standing on the blue knockback puck
    'DiamondEx Airship\'s Bane 1': '5FFE', // destroying one of the platforms after Auri Cyclone
    'DiamondEx Airship\'s Bane 2': '5FD3', // destroying one of the platforms after Auri Cyclone
  },
  shareWarn: {
    'DiamondEx Tank Lasers': '5FC8', // cleaving yellow lasers on top two enmity
    'DiamondEx Homing Laser': '5FC4', // Adamante Purge spread
  },
  shareFail: {
    'DiamondEx Flood Ray': '5FC7', // "limit cut" cleaves
  },
  triggers: [
    {
      id: 'DiamondEx Vertical Cleave Knocked Off',
      netRegex: NetRegexes.ability({ id: '5FD0' }),
      deathReason: (_e, _data, matches) => {
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
