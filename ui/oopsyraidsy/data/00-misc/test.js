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
      regexFr: /:Vous vous inclinez devant le mannequin d\'entraînement/,
      regexKo: /:.*나무인형에게 공손하게 인사합니다/,
      mistake: function(e, data) {
        return {
          type: 'pull',
          blame: data.me,
          fullText: {
            en: 'Bow',
            de: 'Bogen',
            fr: 'Saluer',
            cn: '鞠躬',
            ko: '인사',
          },
        };
      },
    },
    {
      id: 'Test Wipe',
      regex: /:You bid farewell to the striking dummy/,
      regexFr: /:Vous faites vos adieux au mannequin d\'entraînement/,
      regexKo: /:.*나무인형에게 작별 인사를 합니다/,
      mistake: function(e, data) {
        return {
          type: 'wipe',
          blame: data.me,
          fullText: {
            en: 'Party Wipe',
            fr: 'Wipe',
            de: 'Gruppenwipe',
            cn: '团灭',
            ko: '파티 전멸',
          },
        };
      },
    },
    {
      id: 'Test Bootshine',
      damageRegex: '35',
      condition: function(e, data) {
        if (e.attackerName != data.me)
          return false;
        let strikingDummyNames = [
          'Striking Dummy',
          'Mannequin d\'entraînement',
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
      regexFr: /:Vous touchez légèrement le mannequin d'entraînement du doigt/,
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
          fr: 'Trop de touches (' + pokes + ')',
          de: 'Zu viele Piekser (' + pokes + ')',
          cn: '戳太多下啦 (' + pokes + ')',
          ko: '너무 많이 찌름 (' + pokes + '번)',
        };
        return { type: 'fail', blame: data.me, text: text };
      },
    },
  ],
}];
