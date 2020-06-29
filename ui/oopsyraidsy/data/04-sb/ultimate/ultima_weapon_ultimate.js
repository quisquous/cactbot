'use strict';

// Ultima Weapon Ultimate
[{
  zoneRegex: {
    en: /^The Weapon's Refrain \(Ultimate\)$/,
    ko: /^절 알테마 웨폰 파괴작전$/,
  },
  zoneId: ZoneId.TheWeaponsRefrainUltimate,
  damageWarn: {
    'UWU Searing Wind': '2B5C',
    'UWU Eruption': '2B5A',
    'UWU Weight': '2B65',
    'UWU Landslide1': '2B70',
    'UWU Landslide2': '2B71',
  },
  damageFail: {
    'UWU Great Whirlwind': '2B41',
    'UWU Slipstream': '2B53',
    'UWU Wicked Wheel': '2B4E',
    'UWU Wicked Tornado': '2B4F',
  },
  triggers: [
    {
      id: 'UWU Windburn',
      gainsEffectRegex: gLang.kEffect.Windburn,
      // TODO: implement suppressSeconds <_<
      suppressSeconds: 2,
      mistake: function(e) {
        return { type: 'warn', blame: e.targetName, text: e.effectName };
      },
    },
  ],
}];
