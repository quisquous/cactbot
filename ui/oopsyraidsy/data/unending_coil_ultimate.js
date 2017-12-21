// UCU - The Unending Coil Of Bahamut (Ultimate)
[{
  zoneRegex: /The Unending Coil Of Bahamut \(Ultimate\)/,
  triggers: [
    {
      id: 'UCU Twister Death',
      damageRegex: 'Twister',
      condition: function(e, data) {
        // Instant death uses '32' as its flags, differentiating
        // from the explosion damage you take when somebody else
        // pops one.
        return data.IsPlayerId(e.targetId) && e.flags == '32';
      },
      mistake: function(e, data) {
        return { type: 'fail', blame: e.targetName, text: 'Twister Pop' };
      },
    },
    {
      id: 'UCU Dynamo',
      damageRegex: 'Iron Dynamo',
      condition: function(e, data) {
        return data.IsPlayerId(e.targetId);
      },
      mistake: function(e, data) {
        return { type: 'fail', blame: e.targetName, text: 'Dynamo' };
      },
    },
    {
      id: 'UCU Chariot',
      damageRegex: 'Iron Chariot',
      condition: function(e, data) {
        return data.IsPlayerId(e.targetId);
      },
      mistake: function(e, data) {
        return { type: 'fail', blame: e.targetName, text: 'Chariot' };
      },
    },
    {
      id: 'UCU White Puddle',
      damageRegex: 'Wings Of Salvation',
      condition: function(e, data) {
        return data.IsPlayerId(e.targetId);
      },
      mistake: function(e, data) {
        return { type: 'fail', blame: e.targetName, text: 'White Puddle' };
      },
    },
    {
      id: 'UCU Chain Lightning',
      damageRegex: 'Chain Lightning',
      condition: function(e, data) {
        // Chain lightning gets log lines when it goes out
        // on players, so ignore those log lines.
        return data.IsPlayerId(e.targetId) && e.abilityId == '26C8';
      },
      mistake: function(e, data) {
        // It's hard to assign blame for lightning.  The debuffs
        // go out and then explode in order, but the attacker is
        // the dragon and not the player.
        return { type: 'warn', fullText: e.targetName + ': hit by lightning' };
      },
    },
    {
      id: 'UCU Burns',
      buffRegex: 'Burns',
      condition: function(e) { return e.gains; },
      mistake: function(e) {
        return { type: 'fail', blame: e.targetName, text: 'Burn Dot' };
      },
    },
    {
      id: 'UCU Sludge',
      buffRegex: 'Sludge',
      condition: function(e) { return e.gains; },
      mistake: function(e) {
        return { type: 'fail', blame: e.targetName, text: 'Sludge Dot' };
      },
    },
    {
      buffRegex: 'Doom',
      run: function(e, data) {
        data.hasDoom[e.targetName] = e.gains;
      },
    },
    {
      // There is no callout for "you forgot to clear doom".  The logs look
      // something like this:
      //   [20:02:30.564] 1A:Okonomi Yaki gains the effect of Doom from  for 6.00 Seconds.
      //   [20:02:36.443] 1E:Okonomi Yaki loses the effect of Protect from Tako Yaki.
      //   [20:02:36.443] 1E:Okonomi Yaki loses the effect of Doom from .
      //   [20:02:38.525] 19:Okonomi Yaki was defeated by Firehorn.
      // In other words, doom effect is removed +/- network latency, but can't
      // tell until later that it was a death.  Arguably, this could have been a
      // close-but-successful clearing of doom as well.  It looks the same.
      // Strategy: if you haven't cleared doom with 1 second to go then you probably
      // died to doom.  You can get non-fatally iceballed or auto'd in between,
      // but what can you do.
      id: 'UCU Doom',
      buffRegex: 'Doom',
      condition: function(e) { return e.gains; },
      delaySeconds: function(e) { return e.durationSeconds - 1; },
      deathReason: function(e, data, matches) {
        if (!data.hasDoom[e.targetName])
          return;
        var reason;
        if (e.durationSeconds < 9)
          reason = 'doom #1';
        else if (e.durationSeconds < 14)
          reason = 'doom #2';
        else
          reason = 'doom #3';
        return { name: e.targetName, reason: reason };
      },
    },
  ],
}]
