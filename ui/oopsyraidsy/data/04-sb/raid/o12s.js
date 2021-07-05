import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';

import { playerDamageFields } from '../../../oopsy_common';

// TODO: could add Patch warnings for double/unbroken tethers
// TODO: Hello World could have any warnings (sorry)

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
    'O12S2 Diffuse Wave Cannon': '3369', // back/sides lasers
    'O12S2 Right Arm Unit Hyper Pulse 1': '335A', // Rotating Archive Peripheral lasers
    'O12S2 Right Arm Unit Hyper Pulse 2': '335B', // Rotating Archive Peripheral lasers
    'O12S2 Right Arm Unit Colossal Blow': '335F', // Exploding Archive All hands
    'O12S2 Left Arm Unit Colossal Blow': '3360', // Exploding Archive All hands
  },
  damageFail: {
    'O12S1 Optical Laser': '3347', // middle laser from eye
    'O12S1 Advanced Optical Laser': '334A', // giant circle centered on eye
    'O12S2 Rear Power Unit Rear Lasers 1': '3361', // Archive All initial laser
    'O12S2 Rear Power Unit Rear Lasers 2': '3362', // Archive All rotating laser
  },
  shareWarn: {
    'O12S1 Optimized Fire III': '3337', // fire spread
    'O12S2 Hyper Pulse Tether': '335C', // Index And Archive Peripheral tethers
    'O12S2 Wave Cannon': '336B', // Index And Archive Peripheral baited lasers
    'O12S2 Optimized Fire III': '3379', // Archive All spread
  },
  shareFail: {
    'O12S1 Optimized Sagittarius Arrow': '334D', // Omega-M bard limit break
    'O12S2 Oversampled Wave Cannon': '3366', // Monitor tank busters
    'O12S2 Savage Wave Cannon': '336D', // Tank buster with the vuln first
  },
  triggers: [
    {
      id: 'O12S1 Discharger Knocked Off',
      netRegex: NetRegexes.ability({ id: '3327' }),
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
      id: 'O12S1 Magic Vulnerability Up Gain',
      netRegex: NetRegexes.gainsEffect({ effectId: '472' }),
      run: (_e, data, matches) => {
        data.vuln = data.vuln || {};
        data.vuln[matches.target] = true;
      },
    },
    {
      id: 'O12S1 Magic Vulnerability Up Lose',
      netRegex: NetRegexes.losesEffect({ effectId: '472' }),
      run: (_e, data, matches) => {
        data.vuln = data.vuln || {};
        data.vuln[matches.target] = false;
      },
    },
    {
      id: 'O12S1 Magic Vulnerability Damage',
      // 332E = Pile Pitch stack
      // 333E = Electric Slide (Omega-M square 1-4 dashes)
      // 333F = Electric Slide (Omega-F triangle 1-4 dashes)
      netRegex: NetRegexes.abilityFull({ id: ['332E', '333E', '333F'], ...playerDamageFields }),
      condition: (_e, data, matches) => data.vuln && data.vuln[matches.target],
      mistake: (_e, _data, matches) => {
        return {
          type: 'fail',
          blame: matches.target,
          text: {
            en: `${matches.ability} (with vuln)`,
            de: `${matches.ability} (mit Verwundbarkeit)`,
            ja: `${matches.ability} (被ダメージ上昇)`,
            cn: `${matches.ability} (带易伤)`,
          },
        };
      },
    },
  ],
};
