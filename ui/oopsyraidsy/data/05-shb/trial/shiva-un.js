import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';

// Shiva Unreal
export default {
  zoneId: ZoneId.TheAkhAfahAmphitheatreUnreal,
  damageWarn: {
    // Large white circles.
    'ShivaEx Icicle Impact': '537B',
    // "get in" aoe
    'ShivaEx Whiteout': '5376',
    // Avoidable tank stun.
    'ShivaEx Glacier Bash': '5375',
  },
  damageFail: {
    // 270 degree attack.
    'ShivaEx Glass Dance': '5378',
  },
  shareWarn: {
    // Hailstorm spread marker.
    'ShivaEx Hailstorm': '536F',
  },
  shareFail: {
    // Laser.  TODO: maybe blame the person it's on??
    'ShivaEx Avalanche': '5379',
  },
  soloWarn: {
    // Party shared tank buster.
    'ShivaEx Icebrand': '5373',
  },
  triggers: [
    {
      id: 'ShivaEx Deep Freeze',
      // Shiva also uses ability 537A on you, but it has an unknown name.
      // So, use the effect instead for free translation.
      netRegex: NetRegexes.gainsEffect({ effectId: '1E7' }),
      condition: (_data, matches) => {
        // The intermission also gets this effect, but for a shorter duration.
        return parseFloat(matches.duration) > 20;
      },
      mistake: (_data, matches) => {
        return { type: 'fail', blame: matches.target, text: matches.effect };
      },
    },
  ],
};
