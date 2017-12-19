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
  ],
}]
