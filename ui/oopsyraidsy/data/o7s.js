// O7S - Sigmascape 3.0 Savage
[{
  zoneRegex: /Sigmascape V3\.0 \(Savage\)/,
  triggers: [
    {
      id: 'O7S Blizzard III',
      damageRegex: gLang.kAbility.BlizzardIII,
      mistake: function(e, data) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
  ],
}]
