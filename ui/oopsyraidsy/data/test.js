// Test mistake triggers.
[{
  zoneRegex: /^Middle La Noscea$/,
  triggers: [
    {
      id: 'Test Bow',
      regex: /:You bow courteously to the striking dummy/,
      mistake: function(e, data) {
        return { type: 'pull', blame: data.me, fullText: 'Bow' };
      },
    },
    {
      id: 'Test Wipe',
      regex: /:You bid farewell to the striking dummy/,
      mistake: function(e, data) {
        return { type: 'wipe', blame: data.me, fullText: 'Party Wipe' };
      }
    },
    {
      id: 'Test Bootshine',
      damageRegex: gLang.kAbility.Bootshine,
      condition: function(e, data) {
        return e.attackerName == data.me && e.targetName == 'Striking Dummy';
      },
      mistake: function(e, data) {
        data.bootCount = data.bootCount || 0;
        data.bootCount++;
        var text = e.abilityName + ' (' + data.bootCount + '): ' + e.damageStr;
        return { type: 'warn', blame: data.me, text: text };
      },
    },
    {
      id: 'Test Oops',
      regex: /:(oops.*)/,
      mistake: function(e, data, matches) {
        return { type: 'fail', blame: data.me, text: matches[1] };
      },
    },
    {
      id: 'Test Poke',
      regex: /:You poke the striking dummy/,
      collectSeconds: 5,
      mistake: function(events, data) {
        // When runOnce is specified, events are passed as an array.
        var pokes = events.length;

        // 1 poke at a time is fine, but more than one inside of
        // collectSeconds is (OBVIOUSLY) a mistake.
        if (pokes <= 1)
          return;
        var text = 'Too many pokes (' + pokes + ')';
        return { type: 'fail', blame: data.me, text: text };
      },
    },
    {
      id: 'Test One Ilm Punch',
      damageRegex: gLang.kAbility.OneIlmPunch,
      condition: function(e) {
        return e.targetName == 'Striking Dummy';
      },
      mistake: function(e, data) {
        // Demonstrate returning multiple mistakes.
        return [
          { type: 'warn', blame: data.me, text: 'ONE!' },
          { type: 'fail', blame: data.me, text: 'ILM!' },
          { type: 'potion', blame: data.me, text: 'PUNCH!' },
        ];
      },
    },
  ],
}]
