import NetRegexes from '../../../../resources/netregexes';
import ZoneId from '../../../../resources/zone_id';
import { OopsyData } from '../../../../types/data';
import { OopsyTriggerSet } from '../../../../types/oopsy';

export interface Data extends OopsyData {
  bootCount?: number;
  pokeCount?: number;
}

// Test mistake triggers.
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.MiddleLaNoscea,
  triggers: [
    {
      id: 'Test Bow',
      type: 'GameLog',
      netRegex: NetRegexes.gameNameLog({ line: 'You bow courteously to the striking dummy.*?' }),
      netRegexFr: NetRegexes.gameNameLog({ line: 'Vous vous inclinez devant le mannequin d\'entraînement.*?' }),
      netRegexJa: NetRegexes.gameNameLog({ line: '.*は木人にお辞儀した.*?' }),
      netRegexCn: NetRegexes.gameNameLog({ line: '.*恭敬地对木人行礼.*?' }),
      netRegexKo: NetRegexes.gameNameLog({ line: '.*나무인형에게 공손하게 인사합니다.*?' }),
      mistake: (data) => {
        return {
          type: 'pull',
          blame: data.me,
          text: {
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
      type: 'GameLog',
      netRegex: NetRegexes.gameNameLog({ line: 'You bid farewell to the striking dummy.*?' }),
      netRegexFr: NetRegexes.gameNameLog({ line: 'Vous faites vos adieux au mannequin d\'entraînement.*?' }),
      netRegexJa: NetRegexes.gameNameLog({ line: '.*は木人に別れの挨拶をした.*?' }),
      netRegexCn: NetRegexes.gameNameLog({ line: '.*向木人告别.*?' }),
      netRegexKo: NetRegexes.gameNameLog({ line: '.*나무인형에게 작별 인사를 합니다.*?' }),
      mistake: (data) => {
        return {
          type: 'wipe',
          blame: data.me,
          text: {
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
      type: 'Ability',
      netRegex: NetRegexes.abilityFull({ id: '35' }),
      condition: (data, matches) => {
        if (matches.source !== data.me)
          return false;
        const strikingDummyByLocale = {
          en: 'Striking Dummy',
          de: 'Trainingspuppe',
          fr: 'Mannequin d\'entraînement',
          ja: '木人',
          cn: '木人',
          ko: '나무인형',
        };
        const strikingDummyNames = Object.values(strikingDummyByLocale);
        return strikingDummyNames.includes(matches.target);
      },
      mistake: (data, matches) => {
        data.bootCount ??= 0;
        data.bootCount++;
        const text = `${matches.ability} (${data.bootCount}): ${data.DamageFromMatches(matches)}`;
        return { type: 'warn', blame: data.me, text: text };
      },
    },
    {
      id: 'Test Leaden Fist',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '745' }),
      condition: (data, matches) => matches.source === data.me,
      mistake: (data, matches) => {
        return { type: 'good', blame: data.me, text: matches.effect };
      },
    },
    {
      id: 'Test Oops',
      type: 'GameLog',
      netRegex: NetRegexes.echo({ line: '.*oops.*' }),
      suppressSeconds: 10,
      mistake: (data, matches) => {
        return { type: 'fail', blame: data.me, text: matches.line };
      },
    },
    {
      id: 'Test Poke Collect',
      type: 'GameLog',
      netRegex: NetRegexes.gameNameLog({ line: 'You poke the striking dummy.*?' }),
      netRegexFr: NetRegexes.gameNameLog({ line: 'Vous touchez légèrement le mannequin d\'entraînement du doigt.*?' }),
      netRegexJa: NetRegexes.gameNameLog({ line: '.*は木人をつついた.*?' }),
      netRegexCn: NetRegexes.gameNameLog({ line: '.*用手指戳向木人.*?' }),
      netRegexKo: NetRegexes.gameNameLog({ line: '.*나무인형을 쿡쿡 찌릅니다.*?' }),
      run: (data) => {
        data.pokeCount = (data.pokeCount ?? 0) + 1;
      },
    },
    {
      id: 'Test Poke',
      type: 'GameLog',
      netRegex: NetRegexes.gameNameLog({ line: 'You poke the striking dummy.*?' }),
      netRegexFr: NetRegexes.gameNameLog({ line: 'Vous touchez légèrement le mannequin d\'entraînement du doigt.*?' }),
      netRegexJa: NetRegexes.gameNameLog({ line: '.*は木人をつついた.*?' }),
      netRegexCn: NetRegexes.gameNameLog({ line: '.*用手指戳向木人.*?' }),
      netRegexKo: NetRegexes.gameNameLog({ line: '.*나무인형을 쿡쿡 찌릅니다.*?' }),
      delaySeconds: 5,
      mistake: (data) => {
        // 1 poke at a time is fine, but more than one in 5 seconds is (OBVIOUSLY) a mistake.
        if (!data.pokeCount || data.pokeCount <= 1)
          return;
        return {
          type: 'fail',
          blame: data.me,
          text: {
            en: `Too many pokes (${data.pokeCount})`,
            de: `Zu viele Piekser (${data.pokeCount})`,
            fr: `Trop de touches (${data.pokeCount})`,
            ja: `いっぱいつついた (${data.pokeCount})`,
            cn: `戳太多下啦 (${data.pokeCount})`,
            ko: `너무 많이 찌름 (${data.pokeCount}번)`,
          },
        };
      },
      run: (data) => delete data.pokeCount,
    },
  ],
};

export default triggerSet;
