// O4S - Deltascape 4.0 Savage
[{
  zoneRegex: /(Deltascape V4.0 \(Savage\)|Unknown Zone \(2Ba\))/,
  triggers: [
    {
      regex: /:2408:Exdeath starts using The Decisive Battle/,
      run: function(e, data) {
        data.isDecisiveBattleElement = true;
      },
    },
    {
      regex: /:23FE:Exdeath starts using Vacuum Wave/,
      run: function(e, data) {
        data.isDecisiveBattleElement = false;
      },
    },
    {
      id: 'O4S2 Blizzard III',
      damageRegex: 'Blizzard III',
      condition: function(e, data) {
        // Ignore unavoidable raid aoe Blizzard III.
        return data.IsPlayerId(e.targetId) && !data.isDecisiveBattleElement;
      },
      warnText: function(e) {
        return data.shortName(e.targetName) + ': ' + e.abilityName;
      },
    },
    {
      id: 'O4S2 Thunder III',
      damageRegex: 'Thunder III',
      condition: function(e, data) {
        // Only consider this during random mechanic after decisive battle.
        return data.IsPlayerId(e.targetId) && data.isDecisiveBattleElement;
      },
      warnText: function(e) {
        return data.shortName(e.targetName) + ': ' + e.abilityName;
      },
    },
    {
      id: 'O4S2 Acceleration Bomb',
      damageRegex: 'Death Bomb',
      warnText: function(e) {
        return data.ShortName(e.targetName) + ': bomb';
      },
    },
    {
      id: 'O4S2 Petrified',
      regex: /:(\y{Name}) gains the effect of Petrification/,
      noText: function(e, data, matches) {
        return data.ShortName(matches[1]) + ': looked at shriek';
      },
    },
    {
      id: 'O4S2 Forked Lightning',
      damageRegex: 'Death Bolt',
      condition: function(e, data) {
        return data.IsPlayerId(e.targetId);
      },
      noText: function(e, data) {
        return 'Lightning: ' + data.ShortName(e.attackerName) + ' => ' + data.ShortName(e.targetName);
      },
    },
    {
      id: 'O4S2 Double Attack',
      damageRegex: 'Double Attack',
      condition: function(e, data) {
        return data.IsPlayerId(e.targetId);
      },
      collectSeconds: 0.5,
      noText: function(e) {
        if (e.length <= 2)
          return;
        return 'Double Attack hit ' + e.length;
      },
    },
    {
      id: 'O4S2 Emptiness',
      damageRegex: 'Emptiness',
      condition: function(e, data) {
        return data.IsPlayerId(e.targetId);
      },
      warnText: function(e) {
        return e.abilityName + ': ' + e.targetName;
      },
    },
    {
      id: 'O4S2 Double Laser',
      damageRegex: 'Edge Of Death',
      condition: function(e, data) {
        return data.IsPlayerId(e.targetId);
      },
      noText: function(events) {
        return data.ShortName(e.targetName) + ': double laser';
      },
    },
  ],
}]