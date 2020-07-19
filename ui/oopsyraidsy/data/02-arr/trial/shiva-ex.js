'use strict';

// Shiva Extreme
[{
  zoneRegex: {
    en: /^Akh Afah Amphitheatre \(Extreme\)$/,
  },
  zoneId: ZoneId.AkhAfahAmphitheatreExtreme,
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
    // Knockback tank cleave.
    'ShivaEx Heavenly Strike': 'BE8',
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
      condition: function(e) {
        // Should be shared with friends.
        return e.type === '15';
      },
      mistake: function(e) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'ShivaEx Deep Freeze',
      // Shiva also uses ability C8A on you, but it has the untranslated name
      // 透明：シヴァ：凍結レクト：ノックバック用/ヒロイック. So, use the effect instead for free translation.
      netRegex: NetRegexes.gainsEffect({ effectId: '1E7' }),
      condition: function(e, data, matches) {
        // The intermission also gets this effect, but for a shorter duration.
        return parseFloat(matches.duration) > 20;
      },
      mistake: function(e, data, matches) {
        return { type: 'fail', blame: matches.target, text: matches.effect };
      },
    },
  ],
}];
