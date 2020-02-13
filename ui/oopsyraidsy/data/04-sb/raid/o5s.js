'use strict';

// O5S - Sigmascape 1.0 Savage
[{
  zoneRegex: {
    en: /^Sigmascape V1\.0 \(Savage\)$/,
    ko: /^차원의 틈 오메가: 시그마편\(영웅\) \(1\)$/,
  },
  triggers: [
    {
      id: 'O5S Blizzard III',
      damageRegex: gLang.kAbility.BlizzardIII,
      mistake: function(e, data) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
  ],
}];
