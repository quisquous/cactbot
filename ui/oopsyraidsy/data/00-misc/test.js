import NetRegexes from '../../../../resources/netregexes';
import ZoneId from '../../../../resources/zone_id';

// Test mistake triggers.
export default {
  zoneId: ZoneId.MiddleLaNoscea,
  triggers: [
    {
      id: 'Test Bow',
      netRegex: NetRegexes.gameNameLog({ line: 'You bow courteously to the striking dummy.*?' }),
      netRegexFr: NetRegexes.gameNameLog({ line: 'Vous vous inclinez devant le mannequin d\'entraînement.*?' }),
      netRegexJa: NetRegexes.gameNameLog({ line: '.*は木人にお辞儀した.*?' }),
      netRegexCn: NetRegexes.gameNameLog({ line: '.*恭敬地对木人行礼.*?' }),
      netRegexKo: NetRegexes.gameNameLog({ line: '.*나무인형에게 공손하게 인사합니다.*?' }),
      mistake: (_e, data) => {
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
      mistake: (_e, data) => {
        return {
          type: 'wipe',
          blame: data.me,
          fullText: {
            en: 'Party Wipe',
            de: 'Gruppenwipe',
            fr: 'Party Wipe',
            ja: 'ワイプ',
            cn: '团灭',
            ko: '파티 전멸',
          },
        };
      },
    },
    {
      id: 'Test Bootshine',
      netRegex: NetRegexes.abilityFull({ id: '35' }),
      condition: (_e, data, matches) => {
        if (matches.source !== data.me)
          return false;
        const strikingDummyByLocale = {
          en: 'Striking Dummy',
          fr: 'Mannequin d\'entraînement',
          ja: '木人',
          cn: '木人',
          ko: '나무인형',
        };
        const strikingDummyNames = Object.values(strikingDummyByLocale);
        return strikingDummyNames.includes(matches.target);
      },
      mistake: (_e, data, matches) => {
        data.bootCount = data.bootCount || 0;
        data.bootCount++;
        const text = `${matches.ability} (${data.bootCount}): ${data.DamageFromMatches(matches)}`;
        return { type: 'warn', blame: data.me, text: text };
      },
    },
    {
      id: 'Test Leaden Fist',
      netRegex: NetRegexes.gainsEffect({ effectId: '745' }),
      condition: (_e, data, matches) => matches.source === data.me,
      mistake: (_e, data, matches) => {
        return { type: 'good', blame: data.me, text: matches.effect };
      },
    },
    {
      id: 'Test Oops',
      netRegex: NetRegexes.echo({ line: '.*oops.*' }),
      suppressSeconds: 10,
      mistake: (_e, data, matches) => {
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
      mistake: (events, data) => {
        // When collectSeconds is specified, events are passed as an array.
        const pokes = events.length;

        // 1 poke at a time is fine, but more than one inside of
        // collectSeconds is (OBVIOUSLY) a mistake.
        if (pokes <= 1)
          return;
        const text = {
          en: 'Too many pokes (' + pokes + ')',
          de: 'Zu viele Piekser (' + pokes + ')',
          fr: 'Trop de touches (' + pokes + ')',
          ja: 'いっぱいつついた (' + pokes + ')',
          cn: '戳太多下啦 (' + pokes + ')',
          ko: '너무 많이 찌름 (' + pokes + '번)',
        };
        return { type: 'fail', blame: data.me, text: text };
      },
    },
  ],
};
