'use strict';

// Susano Extreme
[{
  zoneRegex: {
    en: /^The Pool Of Tribute \(Extreme\)$/,
    ko: /^극 스사노오 토벌전$/,
  },
  triggers: [
    {
      id: 'SusEx Churning',
      damageRegex: gLang.kAbility.ChurningDeep,
      condition: function(e, data) {
        return data.IsPlayerId(e.targetId);
      },
      mistake: function(e, data) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'SusEx Rasen Kaikyo',
      damageRegex: gLang.kAbility.RasenKaikyo,
      condition: function(e, data) {
        return data.IsPlayerId(e.targetId);
      },
      mistake: function(e, data) {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
  ],
}];
