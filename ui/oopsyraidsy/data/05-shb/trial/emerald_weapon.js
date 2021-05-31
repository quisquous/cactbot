import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';

export default {
  zoneId: ZoneId.CastrumMarinum,
  damageWarn: {
    'Emerald Weapon Heat Ray': '4F9D', // Emerald Beam initial conal
    'Emerald Weapon Photon Laser 1': '5534', // Emerald Beam inside circle
    'Emerald Weapon Photon Laser 2': '5536', // Emerald Beam middle circle
    'Emerald Weapon Photon Laser 3': '5538', // Emerald Beam outside circle
    'Emerald Weapon Heat Ray 1': '5532', // Emerald Beam rotating pulsing laser
    'Emerald Weapon Heat Ray 2': '5533', // Emerald Beam rotating pulsing laser
    'Emerald Weapon Magnetic Mine Explosion': '5B04', // repulsing mine explosions
    'Emerald Weapon Sidescathe 1': '553F', // left/right cleave
    'Emerald Weapon Sidescathe 2': '5540', // left/right cleave
    'Emerald Weapon Sidescathe 3': '5541', // left/right cleave
    'Emerald Weapon Sidescathe 4': '5542', // left/right cleave
    'Emerald Weapon Bit Storm': '554A', // "get in"
    'Emerald Weapon Emerald Crusher': '553C', // blue knockback puck
    'Emerald Weapon Pulse Laser': '5548', // line aoe
    'Emerald Weapon Energy Aetheroplasm': '5551', // hitting a glowy orb
    'Emerald Weapon Divide Et Impera Ground': '556F', // party targeted ground cones
    'Emerald Weapon Primus Terminus Est': '4B3E', // ground circle during arrow headmarkers
    'Emerald Weapon Secundus Terminus Est': '556A', // X / + headmarkers
    'Emerald Weapon Tertius Terminus Est': '556D', // triple swords
    'Emerald Weapon Shots Fired': '555F', // line aoes from soldiers
  },
  shareWarn: {
    'Emerald Weapon Divide Et Impera P1': '554E', // tankbuster, probably cleaves, phase 1
    'Emerald Weapon Divide Et Impera P2': '5570', // tankbuster, probably cleaves, phase 2
  },
  triggers: [
    {
      id: 'Emerald Weapon Emerald Crusher Knocked Off',
      netRegex: NetRegexes.ability({ id: '553E' }),
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
    {
      // Getting knocked into a wall from the arrow headmarker.
      id: 'Emerald Weapon Primus Terminus Est Wall',
      netRegex: NetRegexes.ability({ id: ['5563', '5564'] }),
      deathReason: (_e, _data, matches) => {
        return {
          type: 'fail',
          name: matches.target,
          reason: {
            en: 'Pushed into wall',
            de: 'Rückstoß in die Wand',
            ja: '壁へノックバック',
            cn: '击退至墙',
            ko: '넉백',
          },
        };
      },
    },
  ],
};
