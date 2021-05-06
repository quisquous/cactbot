import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';

// TODO: phase 2

export default {
  zoneId: ZoneId.AlphascapeV40Savage,
  damageWarn: {
    'O12S1 Superliminal Motion 1': '3334', // 300+ degree cleave with back safe area
    'O12S1 Efficient Bladework 1': '3329', // Omega-M "get out" centered aoe after split
    'O12S1 Efficient Bladework 2': '332A', // Omega-M "get out" centered aoe during blades
    'O12S1 Beyond Strength': '3328', // Omega-M "get in" centered aoe during shield
    'O12S1 Superliminal Steel 1': '3330', // Omega-F "get front/back" blades phase
    'O12S1 Superliminal Steel 2': '3331', // Omega-F "get front/back" blades phase
    'O12S1 Optimized Blizzard III': '3332', // Omega-F giant cross
  },
  damageFail: {
    'O12S1 Optical Laser': '3347', // middle laser from eye
    'O12S1 Advanced Optical Laser': '334A', // giant circle centered on eye
  },
  shareWarn: {
    'O12S1 Optimized Fire III': '3337', // fire spread
  },
  shareFail: {
    'O12S1 Optimized Sagittarius Arrow': '334D', // Omega-M bard limit break
  },
  triggers: [
    {
      id: 'O12S1 Discharger Knocked Off',
      netRegex: NetRegexes.ability({ id: '3327' }),
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
    {
      id: 'O12S1 Magic Vulnerability Up Gain',
      netRegex: NetRegexes.gainsEffect({ effectId: '472' }),
      run: (data, matches) => {
        data.vuln = data.vuln || {};
        data.vuln[matches.target] = true;
      },
    },
    {
      id: 'O12S1 Magic Vulnerability Up Lose',
      netRegex: NetRegexes.losesEffect({ effectId: '472' }),
      run: (data, matches) => {
        data.vuln = data.vuln || {};
        data.vuln[matches.target] = false;
      },
    },
    {
      id: 'O12S1 Magic Vulnerability Damage',
      // 332E = Pile Pitch stack
      // 333E = Electric Slide (Omega-M square 1-4 dashes)
      // 333F = Electric Slide (Omega-F triangle 1-4 dashes)
      damageRegex: ['332E', '333E', '333F'],
      condition: (e, data, matches) => data.vuln && data.vuln[matches.target],
      mistake: (e, data, matches) => {
        return {
          type: 'fail',
          blame: matches.target,
          text: {
            en: `${matches.ability} (with vuln)`,
          },
        };
      },
    },
  ],
};
