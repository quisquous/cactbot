// Test mistake triggers.
[{
  zoneRegex: /^Middle La Noscea$/,
  triggers: [
    {
      regex: /:You bow courteously to the striking dummy/,
      pullText: 'Bow',
    },
    {
      regex: /:You bid farewell to the striking dummy/,
      wipeText: 'Party Wipe',
    },
    {
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
      regex: /:You poke the striking dummy/,
      delaySeconds: 5,
      runOnce: true,
      noText: function(events, data) {
        // When runOnce is specified, events are passed as an array.
        var pokes = events.length;

        // 1 poke at a time is fine, but more than one inside of
        // delaySeconds is (OBVIOUSLY) a mistake.
        if (pokes <= 1)
          return;
        return data.ShortName(data.me) + ': too many pokes (' + pokes + ')';
      },
    },
  ],
}]
