// Test mistake triggers.
[{
  zoneRegex: /^Middle La Noscea$/,
  triggers: [
    {
      id: 'Test Bow',
      regex: /:You bow courteously to the striking dummy/,
      pullText: 'Bow',
    },
    {
      id: 'Test Wipe',
      regex: /:You bid farewell to the striking dummy/,
      wipeText: 'Party Wipe',
    },
    {
      id: 'Test Bootshine',
      damageRegex: 'Bootshine',
      condition: function(e) {
        return e.targetName == 'Striking Dummy';
      },
      warnText: function(e, data) {
        data.bootCount = data.bootCount || 0;
        data.bootCount++;
        return e.abilityName + ' (' + data.bootCount + '): ' + e.targetName + ': ' + e.damageStr;
      },
    },
    {
      id: 'Test Poke',
      regex: /:You poke the striking dummy/,
      collectSeconds: 5,
      failText: function(events, data) {
        // When runOnce is specified, events are passed as an array.
        var pokes = events.length;

        // 1 poke at a time is fine, but more than one inside of
        // collectSeconds is (OBVIOUSLY) a mistake.
        if (pokes <= 1)
          return;
        return data.ShortName(data.me) + ': too many pokes (' + pokes + ')';
      },
    },
  ],
}]
