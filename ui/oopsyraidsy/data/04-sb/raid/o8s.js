'use strict';

// O8S - Sigmascape 4.0 Savage
[{
  zoneRegex: /Sigmascape V4\.0 \(Savage\)/,
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
