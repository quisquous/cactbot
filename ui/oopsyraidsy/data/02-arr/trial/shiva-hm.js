'use strict';

// Shiva Hard
[{
  zoneRegex: {
    en: /^Akh Afah Amphitheatre \(Hard\)$/,
  },
  zoneId: ZoneId.AkhAfahAmphitheatreHard,
  damageWarn: {
    // Large white circles.
    'ShivaHm Icicle Impact': '993',
    // Avoidable tank stun.
    'ShivaHm Glacier Bash': '9A1',
  },
  shareWarn: {
    // Knockback tank cleave.
    'ShivaHm Heavenly Strike': '9A0',
    // Hailstorm spread marker.
    'ShivaHm Hailstorm': '998',
  },
  shareFail: {
    // Tankbuster.  This is Shiva Hard mode, not Shiva Extreme.  Please!
    'ShivaHm Icebrand': '996',
  },
  triggers: [
    {
      id: 'ShivaHm Diamond Dust',
      netRegex: NetRegexes.ability({ id: '98A' }),
      run: function(data) {
        data.seenDiamondDust = true;
      },
    },
    {
      id: 'ShivaHm Deep Freeze',
      // Shiva also uses ability 9A3 on you, but it has the untranslated name
      // 透明：シヴァ：凍結レクト：ノックバック用. So, use the effect instead for free translation.
      netRegex: NetRegexes.gainsEffect({ effectId: '1E7' }),
      condition: function(e, data, matches) {
        // The intermission also gets this effect, so only a mistake after that.
        // Unlike extreme, this has the same 20 second duration as the intermission.
        return data.seenDiamondDust;
      },
      mistake: function(e, data, matches) {
        return { type: 'fail', blame: matches.target, text: matches.effect };
      },
    },
  ],
}];
