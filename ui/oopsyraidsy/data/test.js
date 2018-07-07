'use strict';

// Test mistake triggers.
[{
  zoneRegex: /^Middle La Noscea$/,
  triggers: [
    {
      id: 'Test Bow',
      regex: /:You bow courteously to the striking dummy/,
      mistake: function(e, data) {
        return {
          type: 'pull',
          blame: data.me,
          fullText: {
            en: 'Bow',
            de: 'Bogen',
          },
        };
      },
    },
    {
      id: 'Test Wipe',
      regex: /:You bid farewell to the striking dummy/,
      mistake: function(e, data) {
        return {
          type: 'wipe',
          blame: data.me,
          fullText: {
            en: 'Party Wipe',
            de: 'Gruppenwipe',
          },
        };
      },
    },
    {
      id: 'Test Bootshine',
      damageRegex: gLang.kAbility.Bootshine,
      condition: function(e, data) {
        if (e.attackerName != data.me)
          return false;
        let strikingDummyNames = [
          'Striking Dummy',
          // FIXME: add other languages here
        ];
        return strikingDummyNames.indexOf(e.targetName) >= 0;
      },
      mistake: function(e, data) {
        data.bootCount = data.bootCount || 0;
        data.bootCount++;
        let text = e.abilityName + ' (' + data.bootCount + '): ' + e.damageStr;
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
        let pokes = events.length;

        // 1 poke at a time is fine, but more than one inside of
        // collectSeconds is (OBVIOUSLY) a mistake.
        if (pokes <= 1)
          return;
        let text = {
          en: 'Too many pokes (' + pokes + ')',
          de: 'Zu viele Piekser (' + pokes + ')',
        };
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
          {
            type: 'warn',
            blame: data.me,
            text: {
              en: 'ONE!',
              de: 'EIN!',
            },
          },
          {
            type: 'fail',
            blame: data.me,
            text: {
              en: 'ILM!',
              de: 'ILM!',
            },
          },
          {
            type: 'potion',
            blame: data.me,
            text: {
              en: 'PUNCH!',
              de: 'SCHLAG!',
            },
          },
        ];
      },
    },
  ],
}];
