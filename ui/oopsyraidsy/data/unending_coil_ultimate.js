// UCU - The Unending Coil Of Bahamut (Ultimate)
[{
  zoneRegex: /The Unending Coil Of Bahamut \(Ultimate\)/,
  triggers: [
    {
      id: 'UCU Twister Death',
      damageRegex: 'Twister',
      condition: function(e, data) {
        return data.IsPlayerId(e.targetId) && e.flags == '32';
      },
      noText: function(e, data) {
        return data.ShortName(e.targetName) + ': twister pop';
      },
    },
    {
      id: 'UCU Dynamo',
      damageRegex: 'Iron Dynamo',
      condition: function(e, data) {
        return data.IsPlayerId(e.targetId);
      },
      noText: function(e, data) {
        return data.ShortName(e.targetName) + ': dynamo';
      },
    },
    {
      id: 'UCU Chariot',
      damageRegex: 'Iron Chariot',
      condition: function(e, data) {
        return data.IsPlayerId(e.targetId);
      },
      noText: function(e, data) {
        return data.ShortName(e.targetName) + ': chariot';
      },
    },
    {
      id: 'UCU White Puddle',
      damageRegex: 'Wings Of Salvation',
      condition: function(e, data) {
        return data.IsPlayerId(e.targetId);
      },
      noText: function(e, data) {
        return data.ShortName(e.targetName) + ': white puddle';
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
      warnText: function(e, data) {
        return data.ShortName(e.targetName) + ': hit by lightning';
      },
    },
    {
      id: 'UCU Burns',
      // TODO: add a buff regex
      regex: ':(\y{Name}) gains the effect of Burns',
      noText: function(e, data, matches) {
        return data.ShortName(matches[1]) + ': burn dot';
      },
    },
    {
      id: 'UCU Sludge',
      regex: ':(\y{Name}) gains the effect of Sludge',
      noText: function(e, data) {
        return data.ShortName(matches[1]) + ': sludge dot';
      },
    },
    {
      regex: /:(\y{Name}) gains the effect of Doom from .*? for (\y{Float}) Seconds/,
      run: function(e, data, matches) {
        data.doomReason = data.doomReason || {};
        var reason;
        if (data.ParseLocaleFloat(matches[2]) < 9)
          reason = 'doom #1';
        else if (data.ParseLocaleFloat(matches[2]) < 14)
          reason = 'doom #2';
        else
          reason = 'doom #3';
        data.doomReason[matches[1]] = reason;
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
      id: 'UCU Doom',
      regex: /:(\y{Name}) loses the effect of Doom/,
      deathReason: function(e, data, matches) {
        var name = matches[1];
        var reason = data.doomReason[name];
        if (!reason) {
          reason = 'doom';
          console.error('Missing gains doom log for ' + name);
        }
        return { name: name, reason: reason };
      },
    },
  ],
}]
