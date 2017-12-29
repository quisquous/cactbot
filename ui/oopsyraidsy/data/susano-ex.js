// Susano Extreme
[{
  zoneRegex: /^The Pool Of Tribute \(Extreme\)$/,
  triggers: [
    {
      id: 'SusEx Churning',
      damageRegex: 'Churning Deep', // 203F
      condition: function(e, data) { return data.IsPlayerId(e.targetId); },
      mistake: function(e, data) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'SusEx Rasen Kaikyo',
      damageRegex: 'Rasen Kaikyo', // 202E
      condition: function(e, data) { return data.IsPlayerId(e.targetId); },
      mistake: function(e, data) {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
  ],
}]
