import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';

// Shiva Extreme
export default {
  zoneId: ZoneId.TheAkhAfahAmphitheatreExtreme,
  damageWarn: {
    // Large white circles.
    'ShivaEx Icicle Impact': 'BEB',
    // "get in" aoe
    'ShivaEx Whiteout': 'BEC',
    // Avoidable tank stun.
    'ShivaEx Glacier Bash': 'BE9',
  },
  damageFail: {
    // 270 degree attack.
    'ShivaEx Glass Dance': 'BDF',
  },
  shareWarn: {
    // Hailstorm spread marker.
    'ShivaEx Hailstorm': 'BE2',
  },
  shareFail: {
    // Laser.  TODO: maybe blame the person it's on??
    'ShivaEx Avalanche': 'BE0',
  },
  triggers: [
    {
      // Party shared tank buster.
      id: 'ShivaEx Icebrand',
      damageRegex: 'BE1',
      condition: (e) => {
        // Should be shared with friends.
        return e.type === '15';
      },
      mistake: (e) => {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'ShivaEx Deep Freeze',
      // Shiva also uses ability C8A on you, but it has the untranslated name
      // 透明：シヴァ：凍結レクト：ノックバック用/ヒロイック. So, use the effect instead for free translation.
      netRegex: NetRegexes.gainsEffect({ effectId: '1E7' }),
      condition: (_e, _data, matches) => {
        // The intermission also gets this effect, but for a shorter duration.
        return parseFloat(matches.duration) > 20;
      },
      mistake: (_e, _data, matches) => {
        return { type: 'fail', blame: matches.target, text: matches.effect };
      },
    },
  ],
};
