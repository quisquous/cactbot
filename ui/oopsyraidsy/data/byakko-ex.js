// Byakko Extreme
[{
  zoneRegex: /^The Jade Stoa \(Extreme\)$/,
  triggers: [
    {
      id: 'ByaEx Churning',
      damageRegex: gLang.kAbility.ChurningDeep,
      condition: function(e, data) { return data.IsPlayerId(e.targetId); },
      mistake: function(e, data) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
  ],
}]
