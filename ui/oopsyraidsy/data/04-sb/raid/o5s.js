'use strict';

// O5S - Sigmascape 1.0 Savage
[{
  zoneRegex: /Sigmascape V1\.0 \(Savage\)/,
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
