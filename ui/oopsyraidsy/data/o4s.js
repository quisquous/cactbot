// O4S - Deltascape 4.0 Savage
[{
  zoneRegex: /(Deltascape V4.0 \(Savage\)|Unknown Zone \(2Ba\))/,
  triggers: [
    {
      id: 'O4S2 Blizzard III',
      damageRegex: 'Blizzard III',
      condition: function(e, data) {
        return data.IsPlayerId(e.targetId);
      },
      warnText: function(e) {
        return e.abilityName + ': ' + e.targetName;
      },
    },
    {
      id: 'O4S2 Forked Lightning',
      damageRegex: 'Death Bolt',
      condition: function(e, data) {
        return data.IsPlayerId(e.targetId);
      },
      noText: function(e) {
        return 'Lightning: ' + data.ShortName(e.attackerName) + ' => ' + data.ShortName(e.targetName);
      },
    },
  ],
}]