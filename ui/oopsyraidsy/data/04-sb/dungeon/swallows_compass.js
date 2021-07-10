import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';

export default {
  zoneId: ZoneId.TheSwallowsCompass,
  damageWarn: {
    'Swallows Compass Ivy Fetters': '2C04', // Circle ground AoE, Sai Taisui trash, before boss 1
    'Swallows Compass Wildswind 1': '2C05', // Tornado ground AoE, placed by Sai Taisui trash, before boss 1

    'Swallows Compass Yama-Kagura': '2B96', // Frontal line AoE, Otengu, boss 1
    'Swallows Compass Flames Of Hate': '2B98', // Fire orb explosions, boss 1
    'Swallows Compass Conflagrate': '2B99', // Collision with fire orb, boss 1

    'Swallows Compass Upwell': '2C06', // Targeted circle ground AoE, Sai Taisui trash, before boss 2
    'Swallows Compass Bad Breath': '2C07', // Frontal cleave, Jinmenju trash, before boss 2

    'Swallows Compass Greater Palm 1': '2B9D', // Half arena right cleave, Daidarabotchi, boss 2
    'Swallows Compass Greater Palm 2': '2B9E', // Half arena left cleave, Daidarabotchi, boss 2
    'Swallows Compass Tributary': '2BA0', // Targeted thin conal ground AoEs, Daidarabotchi, boss 2

    'Swallows Compass Wildswind 2': '2C06', // Circle ground AoE, environment, after boss 2
    'Swallows Compass Wildswind 3': '2C07', // Circle ground AoE, placed by Sai Taisui trash, after boss 2
    'Swallows Compass Filoplumes': '2C76', // Frontal rectangle AoE, Dragon Bi Fang trash, after boss 2

    'Swallows Compass Both Ends 1': '2BA8', // Chariot AoE, Qitian Dasheng, boss 3
    'Swallows Compass Both Ends 2': '2BA9', // Dynamo AoE, Qitian Dasheng, boss 3
    'Swallows Compass Both Ends 3': '2BAE', // Chariot AoE, Shadow Of The Sage, boss 3
    'Swallows Compass Both Ends 4': '2BAF', // Dynamo AoE, Shadow Of The Sage, boss 3
    'Swallows Compass Equal Of Heaven': '2BB4', // Small circle ground AoEs, Qitian Dasheng, boss 3
  },
  shareWarn: {
    'Swallows Compass Mirage': '2BA2', // Prey-chasing puddles, Daidarabotchi, boss 2
    'Swallows Compass Mountain Falls': '2BA5', // Circle spread markers, Daidarabotchi, boss 2
    'Swallows Compass The Long End': '2BA7', // Laser tether, Qitian Dasheng  boss 3
    'Swallows Compass The Long End 2': '2BAD', // Laser Tether, Shadows Of The Sage, boss 3
  },
  gainsEffectWarn: {
    'Swallows Compass Hysteria': '128', // Gaze attack failure, Otengu, boss 1
    'Swallows Compass Bleeding': '112F', // Stepping outside the arena, boss 3
  },
  triggers: [
    {
      // Standing in the lake, Diadarabotchi, boss 2
      id: 'Swallows Compass Six Fulms Under',
      netRegex: NetRegexes.gainsEffect({ effectId: '237' }),
      deathReason: (_data, matches) => {
        return {
          type: 'fail',
          name: matches.target,
          reason: matches.effect,
        };
      },
    },
    {
      // Stack marker, boss 3
      id: 'Swallows Compass Five Fingered Punishment',
      netRegex: NetRegexes.ability({ id: ['2BAB', '2BB0'], source: ['Qitian Dasheng', 'Shadow Of The Sage'] }),
      condition: (_data, matches) => matches.type === '21', // Taking the stack solo is *probably* a mistake.
      mistake: (_data, matches) => {
        return {
          type: 'fail',
          blame: matches.target,
          text: {
            en: `${matches.ability} (alone)`,
            de: `${matches.ability} (allein)`,
            fr: `${matches.ability} (seul(e))`,
            ja: `${matches.ability} (一人)`,
            cn: `${matches.ability} (单吃)`,
            ko: `${matches.ability} (혼자 맞음)`,
          },
        };
      },
    },
  ],
};
