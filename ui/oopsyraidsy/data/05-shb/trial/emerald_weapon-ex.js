import NetRegexes from '../../../../../resources/netregexes.js';
import ZoneId from '../../../../../resources/zone_id.js';

export default {
  zoneId: ZoneId.CastrumMarinumExtreme,
  damageWarn: {
    'EmeraldEx Heat Ray': '5BD3', // Emerald Beam initial conal
    'EmeraldEx Photon Laser 1': '557B', // Emerald Beam inside circle
    'EmeraldEx Photon Laser 2': '557D', // Emerald Beam outside circle
    'EmeraldEx Heat Ray 1': '557A', // Emerald Beam rotating pulsing laser
    'EmeraldEx Heat Ray 2': '5579', // Emerald Beam rotating pulsing laser
    'EmeraldEx Explosion': '5596', // Magitek Mine explosion
    'EmeraldEx Tertius Terminus Est Initial': '55CD', // sword initial puddles
    'EmeraldEx Tertius Terminus Est Explosion': '55CE', // sword explosions
    'EmeraldEx Airborne Explosion': '55BD', // exaflare
    'EmeraldEx Sidescathe 1': '55D4', // left/right cleave
    'EmeraldEx Sidescathe 2': '55D4', // left/right cleave
    'EmeraldEx Shots Fired': '55B7', // rank and file soldiers
    'EmeraldEx Secundus Terminus Est': '55CB', // dropped + and x headmarkers
    'EmeraldEx Expire': '55D1', // ground aoe on boss "get out"
    'EmeraldEx Aire Tam Storm': '55D0', // expanding red and black ground aoe
  },
  shareWarn: {
    'EmeraldEx Divide Et Impera': '55D9', // non-tank protean spread
    'EmeraldEx Primus Terminus Est 1': '55C4', // knockback arrow
    'EmeraldEx Primus Terminus Est 2': '55C5', // knockback arrow
    'EmeraldEx Primus Terminus Est 3': '55C6', // knockback arrow
    'EmeraldEx Primus Terminus Est 4': '55C7', // knockback arrow
  },
  triggers: [
    {
      // Orbs from Aetheroplasm Production must be taken with a friend.
      id: 'EmeraldEx Aetheroplasm',
      // 55AE = Nitrosphere Aetheroplasm
      // 55AF = Ceruleum Sphere Aetheroplasm
      damageRegex: ['55AE', '55AF'],
      condition: (e) => e.type === '15',
      mistake: (e, data, matches) => {
        return {
          type: 'fail',
          blame: matches.target,
          text: {
            en: `${matches.ability} (alone)`,
          },
        };
      },
    },
    {
      id: 'EmeraldEx Nitrosphere Physical Vulnerability Up Gain',
      netRegex: NetRegexes.gainsEffect({ effectId: '82A' }),
      run: (e, data, matches) => {
        data.sphereNitro = data.sphereNitro || {};
        data.sphereNitro[matches.target] = true;
      },
    },
    {
      id: 'EmeraldEx Nitrosphere Physical Vulnerability Up Lose',
      netRegex: NetRegexes.losesEffect({ effectId: '82A' }),
      run: (e, data, matches) => {
        // Need to track loss here for the 4/4 strategy.
        data.sphereNitro = data.sphereNitro || {};
        data.sphereNitro[matches.target] = false;
      },
    },
    {
      id: 'EmeraldEx Ceruleum Sphere Magic Vulnerability Up Gain',
      netRegex: NetRegexes.gainsEffect({ effectId: '82B' }),
      run: (e, data, matches) => {
        data.sphereCeruleum = data.sphereCeruleum || {};
        data.sphereCeruleum[matches.target] = true;
      },
    },
    {
      id: 'EmeraldEx Ceruleum Sphere Magic Vulnerability Up Lose',
      netRegex: NetRegexes.losesEffect({ effectId: '82B' }),
      run: (e, data, matches) => {
        data.sphereCeruleum = data.sphereCeruleum || [];
        data.sphereCeruleum[matches.target] = false;
      },
    },
    {
      id: 'EmeraldEx Nitrosphere Twice',
      netRegex: NetRegexes.ability({ id: '55AE' }),
      condition: (e, data, matches) => data.sphereNitro && data.sphereNitro[matches.target],
      mistake: (e, data, matches) => {
        return {
          type: 'fail',
          blame: matches.target,
          text: {
            en: `${matches.ability} (wrong color)`,
          },
        };
      },
    },
    {
      id: 'EmeraldEx Ceruleum Sphere Twice',
      netRegex: NetRegexes.ability({ id: '55AF' }),
      condition: (e, data, matches) => data.sphereCeruleum && data.sphereCeruleum[matches.target],
      mistake: (e, data, matches) => {
        return {
          type: 'fail',
          blame: matches.target,
          text: {
            en: `${matches.ability} (wrong color)`,
          },
        };
      },
    },
  ],
};
