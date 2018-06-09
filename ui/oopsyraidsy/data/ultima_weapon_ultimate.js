'use strict';

// Ultima Weapon Ultimate
[{
  zoneRegex: /^(The Weapon's Refrain \(Ultimate\)|Unknown Zone \(309\))$/,
  triggers: [
    {
      id: 'UWU Great Whirlwind',
      damageRegex: gLang.kAbility.GreatWhirlwind,
      condition: function(e, data) {
        return data.IsPlayerId(e.targetId);
      },
      mistake: function(e, data) {
        return { type: 'fail', blame: e.targetName, text: e.effectName };
      },
    },
    {
      id: 'UWU Slipstream',
      damageRegex: gLang.kAbility.Slipstream,
      condition: function(e, data) {
        return data.IsPlayerId(e.targetId);
      },
      mistake: function(e, data) {
        return { type: 'fail', blame: e.targetName, text: e.effectName };
      },
    },
    {
      id: 'UWU Windburn',
      gainsEffectRegex: gLang.kEffect.Windburn,
      // TODO: implement suppressSeconds <_<
      suppressSeconds: 2,
      mistake: function(e) {
        return { type: 'warn', blame: e.targetName, text: e.effectName };
      },
    },
    {
      id: 'UWU Wicked Wheel',
      damageRegex: gLang.kAbility.WickedWheel,
      condition: function(e, data) {
        return data.IsPlayerId(e.targetId);
      },
      mistake: function(e, data) {
        return { type: 'fail', blame: e.targetName, text: e.effectName };
      },
    },
    {
      id: 'UWU Wicked Tornado',
      damageRegex: gLang.kAbility.WickedTornado,
      condition: function(e, data) {
        return data.IsPlayerId(e.targetId);
      },
      mistake: function(e, data) {
        return { type: 'fail', blame: e.targetName, text: e.effectName };
      },
    },
    {
      id: 'UWU Searing Wind',
      damageRegex: gLang.kAbility.SearingWind,
      condition: function(e, data) {
        return data.IsPlayerId(e.targetId);
      },
      mistake: function(e, data) {
        return { type: 'warn', blame: e.targetName, text: e.effectName };
      },
    },
    {
      id: 'UWU Eruption',
      damageRegex: gLang.kAbility.Eruption,
      condition: function(e, data) {
        return data.IsPlayerId(e.targetId);
      },
      mistake: function(e, data) {
        return { type: 'warn', blame: e.targetName, text: e.effectName };
      },
    },
    {
      id: 'UWU Weight',
      damageRegex: gLang.kAbility.WeightOfTheLand,
      condition: function(e, data) {
        return data.IsPlayerId(e.targetId);
      },
      mistake: function(e, data) {
        return { type: 'warn', blame: e.targetName, text: e.effectName };
      },
    },
    {
      id: 'UWU Landslide1',
      damageRegex: gLang.kAbility.Landslide1,
      condition: function(e, data) {
        return data.IsPlayerId(e.targetId);
      },
      mistake: function(e, data) {
        return { type: 'warn', blame: e.targetName, text: e.effectName };
      },
    },
    {
      id: 'UWU Landslide2',
      damageRegex: gLang.kAbility.Landslide2,
      condition: function(e, data) {
        return data.IsPlayerId(e.targetId);
      },
      mistake: function(e, data) {
        return { type: 'warn', blame: e.targetName, text: e.effectName };
      },
    },
  ],
}];
