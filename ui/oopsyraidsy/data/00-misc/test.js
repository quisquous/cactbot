'use strict';

// Test mistake triggers.
[{
  zoneRegex: {
    en: /^Middle La Noscea$/,
    cn: /^中拉诺西亚$/,
    ko: /^중부 라노시아$/,
  },
  triggers: [
    {
      id: 'Test Bow',
      regex: /:You bow courteously to the striking dummy/,
      regexKo: /:.*나무인형에게 공손하게 인사합니다/,
      mistake: function(e, data) {
        return {
          type: 'pull',
          blame: data.me,
          fullText: {
            en: 'Bow',
            de: 'Bogen',
            ko: '인사',
          },
        };
      },
    },
    {
      id: 'Test Wipe',
      regex: /:You bid farewell to the striking dummy/,
      regexKo: /:.*나무인형에게 작별 인사를 합니다/,
      mistake: function(e, data) {
        return {
          type: 'wipe',
          blame: data.me,
          fullText: {
            en: 'Party Wipe',
            de: 'Gruppenwipe',
            ko: '파티 전멸',
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
          '나무인형',
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
      regexKo: /:.*나무인형을 쿡쿡 찌릅니다/,
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
          ko: '너무 많이 찌름 (' + pokes + '번)',
        };
        return { type: 'fail', blame: data.me, text: text };
      },
    },
  ],
}];
