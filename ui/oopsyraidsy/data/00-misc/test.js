'use strict';

// Test mistake triggers.
[{
  zoneId: ZoneId.MiddleLaNoscea,
  triggers: [
    {
      id: 'Test Bow',
      netRegex: NetRegexes.gameNameLog({ line: 'You bow courteously to the striking dummy.*?' }),
      netRegexFr: NetRegexes.gameNameLog({ line: 'Vous vous inclinez devant le mannequin d\'entraînement.*?' }),
      netRegexJa: NetRegexes.gameNameLog({ line: '.*は木人にお辞儀した.*?' }),
      netRegexCn: NetRegexes.gameNameLog({ line: '.*恭敬地对木人行礼.*?' }),
      netRegexKo: NetRegexes.gameNameLog({ line: '.*나무인형에게 공손하게 인사합니다.*?' }),
      mistake: function(e, data) {
        return {
          type: 'pull',
          blame: data.me,
          fullText: {
            en: 'Bow',
            de: 'Bogen',
            fr: 'Saluer',
            ja: 'お辞儀',
            cn: '鞠躬',
            ko: '인사',
          },
        };
      },
    },
    {
      id: 'Test Wipe',
      netRegex: NetRegexes.gameNameLog({ line: 'You bid farewell to the striking dummy.*?' }),
      netRegexFr: NetRegexes.gameNameLog({ line: 'Vous faites vos adieux au mannequin d\'entraînement.*?' }),
      netRegexJa: NetRegexes.gameNameLog({ line: '.*は木人に別れの挨拶をした.*?' }),
      netRegexCn: NetRegexes.gameNameLog({ line: '.*向木人告别.*?' }),
      netRegexKo: NetRegexes.gameNameLog({ line: '.*나무인형에게 작별 인사를 합니다.*?' }),
      mistake: function(e, data) {
        return {
          type: 'wipe',
          blame: data.me,
          fullText: {
            en: 'Party Wipe',
            fr: 'Wipe',
            de: 'Gruppenwipe',
            ja: 'ワイプ',
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
          '木人', // Striking Dummy called `木人` in CN as well as JA
          '나무인형',
          // FIXME: add other languages here
        ];
        return strikingDummyNames.includes(e.targetName);
      },
      mistake: function(e, data) {
        data.bootCount = data.bootCount || 0;
        data.bootCount++;
        let text = e.abilityName + ' (' + data.bootCount + '): ' + e.damageStr;
        return { type: 'warn', blame: data.me, text: text };
      },
    },
    {
      id: 'Test Leaden Fist',
      netRegex: NetRegexes.gainsEffect({ effectId: '745' }),
      condition: function(e, data, matches) {
        return matches.source === data.me;
      },
      mistake: function(e, data, matches) {
        return { type: 'good', blame: data.me, text: matches.effect };
      },
    },
    {
      id: 'Test Oops',
      netRegex: NetRegexes.echo({ line: '.*oops.*' }),
      mistake: function(e, data, matches) {
        return { type: 'fail', blame: data.me, text: matches.line };
      },
    },
    {
      id: 'Test Poke',
      netRegex: NetRegexes.gameNameLog({ line: 'You poke the striking dummy.*?' }),
      netRegexFr: NetRegexes.gameNameLog({ line: 'Vous touchez légèrement le mannequin d\'entraînement du doigt.*?' }),
      netRegexJa: NetRegexes.gameNameLog({ line: '.*は木人をつついた.*?' }),
      netRegexCn: NetRegexes.gameNameLog({ line: '.*用手指戳向木人.*?' }),
      netRegexKo: NetRegexes.gameNameLog({ line: '.*나무인형을 쿡쿡 찌릅니다.*?' }),
      collectSeconds: 5,
      mistake: function(events, data) {
        // When collectSeconds is specified, events are passed as an array.
        let pokes = events.length;

        // 1 poke at a time is fine, but more than one inside of
        // collectSeconds is (OBVIOUSLY) a mistake.
        if (pokes <= 1)
          return;
        let text = {
          en: 'Too many pokes (' + pokes + ')',
          fr: 'Trop de touches (' + pokes + ')',
          de: 'Zu viele Piekser (' + pokes + ')',
          ja: 'いっぱいつついた (' + pokes + ')',
          cn: '戳太多下啦 (' + pokes + ')',
          ko: '너무 많이 찌름 (' + pokes + '번)',
        };
        return { type: 'fail', blame: data.me, text: text };
      },
    },
  ],
}];
