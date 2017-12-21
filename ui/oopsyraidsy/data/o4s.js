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
      mistake: function(e) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'O4S2 Thunder III',
      damageRegex: 'Thunder III',
      condition: function(e, data) {
        // Only consider this during random mechanic after decisive battle.
        return data.IsPlayerId(e.targetId) && data.isDecisiveBattleElement;
      },
      mistake: function(e) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'O4S2 Acceleration Bomb',
      damageRegex: 'Death Bomb',
      mistake: function(e, data) {
        return { type: 'warn', blame: e.targetName, text: 'Bomb' };
      },
    },
    {
      id: 'O4S2 Petrified',
      buffRegex: 'Petrification',
      condition: function(e) { return e.gains; },
      mistake: function(e, data) {
        return { type: 'fail', blame: e.targetName, text: 'Bomb' };
      },
    },
    {
      id: 'O4S2 Forked Lightning',
      damageRegex: 'Death Bolt',
      condition: function(e, data) {
        return data.IsPlayerId(e.targetId);
      },
      mistake: function(e, data) {
        var text = 'Lightning => ' + data.ShortName(e.targetName)
        return { type: 'fail', blame: e.attackerName, text: text };
      },
    },
    {
      id: 'O4S2 Double Attack',
      damageRegex: 'Double Attack',
      condition: function(e, data) {
        return data.IsPlayerId(e.targetId);
      },
      collectSeconds: 0.5,
      mistake: function(e) {
        if (e.length <= 2)
          return;
        // Hard to know who should be in this and who shouldn't, but
        // it should never hit 3 people.
        return { type: 'fail', fullText: e.abilityName + ' hit ' + e.length };
      },
    },
    {
      id: 'O4S2 Emptiness',
      damageRegex: 'Emptiness',
      condition: function(e, data) {
        return data.IsPlayerId(e.targetId);
      },
      mistake: function(e, data) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'O4S2 Double Laser',
      damageRegex: 'Edge Of Death',
      condition: function(e, data) {
        return data.IsPlayerId(e.targetId);
      },
      mistake: function(events, data) {
        return { type: 'fail', blame: e.targetName, text: 'Double Laser' };
      },
    },
    {
      buffRegex: 'Beyond Death',
      run: function(e, data) {
        data.hasBeyondDeath[e.targetName] = e.gains;
      },
    },
    {
      id: 'O4S2 Beyond Death',
      buffRegex: 'Beyond Death',
      condition: function(e) { return e.gains; },
      delaySeconds: function(e) { return e.durationSeconds - 1; },
      deathReason: function(e) {
        if (!data.hasBeyondDeath[e.targetName])
          return;
        return {
          name: e.targetName,
          reason: 'Beyond Death Failure',
        };
      },
    },
  ],
}]