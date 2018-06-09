'use strict';

// O6S - Sigmascape 2.0 Savage
[{
  zoneRegex: /Sigmascape V2\.0 \(Savage\)/,
  triggers: [
    {
      id: 'O6S Blizzard III',
      damageRegex: gLang.kAbility.BlizzardIII,
      mistake: function(e, data) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
  ],
}];
