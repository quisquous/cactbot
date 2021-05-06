import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';

// Diamond Weapon Normal
export default {
  zoneId: ZoneId.TheCloudDeck,
  damageWarn: {
    'Diamond Weapon Auri Arts': '5FE3', // Auri Arts dashes
    'Diamond Weapon Diamond Shrapnel Initial': '5FE1', // initial circle of Diamond Shrapnel
    'Diamond Weapon Diamond Shrapnel Chasing': '5FE2', // followup circles from Diamond Shrapnel
    'Diamond Weapon Aetherial Bullet': '5FD5', // bit lasers
  },
  damageFail: {
    'Diamond Weapon Claw Swipe Left': '5FD9', // Adamant Purge platform cleave
    'Diamond Weapon Claw Swipe Right': '5FDA', // Adamant Purge platform cleave
    'Diamond Weapon Auri Cyclone 1': '5FE6', // standing on the blue knockback puck
    'Diamond Weapon Auri Cyclone 2': '5FE7', // standing on the blue knockback puck
    'Diamond Weapon Airship\'s Bane 1': '5FE8', // destroying one of the platforms after Auri Cyclone
    'Diamond Weapon Airship\'s Bane 2': '5FFE', // destroying one of the platforms after Auri Cyclone
  },
  shareWarn: {
    'Diamond Weapon Homing Laser': '5FDB', // spread markers
  },
  triggers: [
    {
      id: 'Diamond Weapon Vertical Cleave Knocked Off',
      netRegex: NetRegexes.ability({ id: '5FE5' }),
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
