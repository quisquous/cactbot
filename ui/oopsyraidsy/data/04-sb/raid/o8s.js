'use strict';

// O8S - Sigmascape 4.0 Savage
[{
  zoneRegex: {
    en: /^Sigmascape V4\.0 \(Savage\)$/,
    ko: /^차원의 틈 오메가: 시그마편\(영웅\) \(4\)$/,
  },
  triggers: [
    {
      id: 'O8S Blizzard III',
      damageRegex: gLang.kAbility.BlizzardIII,
      mistake: function(e, data) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
  ],
}];
