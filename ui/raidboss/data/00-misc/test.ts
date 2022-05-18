import NetRegexes from '../../../../resources/netregexes';
import outputs from '../../../../resources/outputs';
import Util from '../../../../resources/util';
import ZoneId from '../../../../resources/zone_id';
import { RaidbossData } from '../../../../types/data';
import { LocaleText, TriggerSet } from '../../../../types/trigger';

const strikingDummyNames: LocaleText = {
  en: 'Striking Dummy',
  de: 'Trainingspuppe',
  fr: 'Mannequin d\'entraînement',
  ja: '木人',
  cn: '木人',
  ko: '나무인형',
};

export interface Data extends RaidbossData {
  delayedDummyTimestampBefore: number;
  delayedDummyTimestampAfter: number;
  pokes: number;
}

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.MiddleLaNoscea,
  timelineFile: 'test.txt',
  // timeline here is additions to the timeline.  They can
  // be strings, or arrays of strings, or functions that
  // take the same data object (including role and lang)
  // that triggers do.
  timeline: [
    'alerttext "Final Sting" before 4 "oh no final sting in 4"',
    'alarmtext "Death" before 3',
    'alertall "Long Castbar" before 1 speak "voice" "long"',
    (data) => {
      if (data.role !== 'tank' && data.role !== 'healer')
        return 'hideall "Super Tankbuster"';
      return 'alarmtext "Super Tankbuster" before 2';
    },
    (data) => {
      if (data.role !== 'dps')
        return 'hideall "Pentacle Sac (DPS)"';
    },
    (data) => {
      if (data.role !== 'healer')
        return 'hideall "Almagest"';
      return 'alarmtext "Almagest" before 0';
    },
    (data) => {
      return [
        '40 "Death To ' + data.ShortName(data.me) + '!!"',
        'hideall "Death"',
      ];
    },
  ],
  initData: () => {
    return {
      delayedDummyTimestampBefore: 0,
      delayedDummyTimestampAfter: 0,
      pokes: 0,
    };
  },
  timelineStyles: [
    {
      regex: /^Death To/,
      style: {
        'color': 'red',
        'font-family': 'Impact',
      },
    },
  ],
  timelineTriggers: [
    {
      id: 'Test Angry Dummy',
      regex: /Angry Dummy/,
      beforeSeconds: 2,
      infoText: (_data, _matches, output) => output.stack!(),
      tts: (_data, _matches, output) => output.stackTTS!(),
      outputStrings: {
        stack: {
          en: 'Stack for Angry Dummy',
          de: 'Sammeln für Wütender Dummy',
          fr: 'Packez-vous pour le Mannequin en colère',
          ja: '怒る木人に集合',
          cn: '木人处集合',
          ko: '화난 나무인형에 집합',
        },
        stackTTS: {
          en: 'Stack',
          de: 'Sammeln',
          fr: 'Packez-vous',
          ja: '集合',
          cn: '集合',
          ko: '집합',
        },
      },
    },
    {
      id: 'Test Delayed Dummy',
      regex: /Angry Dummy/,
      beforeSeconds: 0,
      // Add in a huge delay to make it obvious the delay runs before promise.
      delaySeconds: 10,
      promise: (data) => {
        data.delayedDummyTimestampBefore = Date.now();
        const p = new Promise<void>((res) => {
          window.setTimeout(() => {
            data.delayedDummyTimestampAfter = Date.now();
            res();
          }, 3000);
        });
        return p;
      },
      infoText: (data, _matches, output) => {
        const elapsed = data.delayedDummyTimestampAfter - data.delayedDummyTimestampBefore;
        return output.elapsed!({ elapsed: elapsed });
      },
      outputStrings: {
        elapsed: {
          en: 'Elapsed ms: ${elapsed}',
          de: 'Abgelaufene ms: ${elapsed}',
          fr: 'Expiré ms: ${elapsed}',
          ja: '経過時間：${elapsed}',
          cn: '经过时间：${elapsed}',
          ko: '경과 시간: ${elapsed}',
        },
      },
    },
  ],
  triggers: [
    {
      id: 'Test Poke',
      type: 'GameLog',
      netRegex: NetRegexes.gameNameLog({ line: 'You poke the striking dummy.*?', capture: false }),
      preRun: (data) => ++data.pokes,
      infoText: (data, _matches, output) => output.poke!({ numPokes: data.pokes }),
      outputStrings: {
        poke: {
          en: 'poke #${numPokes}',
          de: 'stups #${numPokes}',
          fr: 'poussée #${numPokes}',
          ja: 'つつく #${numPokes}',
          cn: '戳 #${numPokes}',
          ko: '${numPokes}번 찌름',
        },
      },
    },
    {
      id: 'Test Psych',
      type: 'GameLog',
      netRegex: NetRegexes.gameNameLog({ line: 'You psych yourself up alongside the striking dummy.*?', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      tts: {
        en: 'psych',
        de: 'auf gehts',
        fr: 'motivation',
        ja: '活を入れる',
        cn: '激励',
        ko: '힘내라!',
      },
      outputStrings: {
        text: {
          en: 'PSYCH!!!',
          de: 'AUF GEHTS!!!',
          fr: 'MOTIVATION !!!',
          ja: '活を入れる！！',
          cn: '激励！！',
          ko: '힘내라!!',
        },
      },
    },
    {
      id: 'Test Laugh',
      type: 'GameLog',
      netRegex: NetRegexes.gameNameLog({ line: 'You burst out laughing at the striking dummy.*?', capture: false }),
      suppressSeconds: 5,
      alarmText: (_data, _matches, output) => output.text!(),
      tts: {
        en: 'hahahahaha',
        de: 'hahahahaha',
        fr: 'hahahahaha',
        ja: 'ハハハハハ',
        cn: '哈哈哈哈哈哈',
        ko: '푸하하하하핳',
      },
      outputStrings: {
        text: {
          en: 'hahahahaha',
          de: 'hahahahaha',
          fr: 'hahahahaha',
          ja: 'ハハハハハ',
          cn: '2333333333',
          ko: '푸하하하하핳',
        },
      },
    },
    {
      id: 'Test Clap',
      type: 'GameLog',
      netRegex: NetRegexes.gameNameLog({ line: 'You clap for the striking dummy.*?', capture: false }),
      sound: '../../resources/sounds/freesound/power_up.webm',
      soundVolume: 0.3,
      tts: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'clapity clap',
          de: 'klatschen',
          fr: 'applaudissement',
          ja: '拍手',
          cn: '鼓掌',
          ko: '박수 짝짝짝',
        },
      },
    },
    {
      id: 'Test Lang',
      type: 'GameLog',
      // In game: /echo cactbot lang
      netRegex: NetRegexes.echo({ line: 'cactbot lang.*?', capture: false }),
      infoText: (data, _matches, output) => output.text!({ lang: data.parserLang }),
      outputStrings: {
        text: {
          en: 'Language: ${lang}',
          de: 'Sprache: ${lang}',
          fr: 'Langage: ${lang}',
          ja: '言語：${lang}',
          cn: '语言: ${lang}',
          ko: '언어: ${lang}',
        },
      },
    },
    {
      id: 'Test Response',
      type: 'GameLog',
      netRegex: NetRegexes.echo({ line: 'cactbot test response.*?', capture: false }),
      response: (_data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          alarmOne: outputs.num1,
          alertTwo: outputs.num2,
          infoThree: outputs.num3,
          ttsFour: outputs.num4,
        };
        return {
          alarmText: output.alarmOne!(),
          alertText: output.alertTwo!(),
          infoText: output.infoThree!(),
          tts: output.ttsFour!(),
        };
      },
    },
    {
      id: 'Test Watch',
      type: 'GameLog',
      netRegex: NetRegexes.echo({ line: 'cactbot test watch.*?', capture: false }),
      promise: (data) =>
        Util.watchCombatant({
          names: [
            data.me,
            strikingDummyNames[data.lang] ?? strikingDummyNames['en'],
          ],
          // 50 seconds
          maxDuration: 50000,
        }, (ret) => {
          const me = ret.combatants.find((c) => c.Name === data.me);
          const dummyName = strikingDummyNames[data.lang] ?? strikingDummyNames['en'];
          const dummies = ret.combatants.filter((c) => c.Name === dummyName);
          console.log(`test watch: me = ${me?.Name ?? 'undefined'}; ${dummies.length} dummies`);
          if (me) {
            for (const dummy of dummies) {
              const distX = Math.abs(me.PosX - dummy.PosX);
              const distY = Math.abs(me.PosY - dummy.PosY);
              const dist = Math.hypot(distX, distY);
              console.log(`test watch: distX = ${distX}; distY = ${distY}; dist = ${dist}`);
              if (dist < 5)
                return true;
            }
            return false;
          }
          return false;
        }),
      infoText: (_data, _matches, output) => output.close!(),
      outputStrings: {
        close: {
          en: 'Dummy close!',
          de: 'Puppe beendet!',
          fr: 'Mannequin proche !',
          ja: '木人に近すぎ！',
          cn: '靠近木人！',
          ko: '나무인형과 가까움!',
        },
      },
    },
  ],
  timelineReplace: [
    {
      locale: 'de',
      replaceSync: {
        'You bid farewell to the striking dummy': 'Du winkst der Trainingspuppe zum Abschied zu',
        'You bow courteously to the striking dummy': 'Du verbeugst dich hochachtungsvoll vor der Trainingspuppe',
        'test sync': 'test sync',
        'You burst out laughing at the striking dummy': 'Du lachst herzlich mit der Trainingspuppe',
        'cactbot lang': 'cactbot sprache',
        'cactbot test response': 'cactbot test antwort',
        'cactbot test watch': 'cactbot test beobachten',
        'You clap for the striking dummy': 'Du klatschst begeistert Beifall für die Trainingspuppe',
        'You psych yourself up alongside the striking dummy': 'Du willst wahren Kampfgeist in der Trainingspuppe entfachen',
        'You poke the striking dummy': 'Du stupst die Trainingspuppe an',
      },
      replaceText: {
        'Final Sting': 'Schlussstich',
        'Almagest': 'Almagest',
        'Angry Dummy': 'Wütender Dummy',
        'Long Castbar': 'Langer Zauberbalken',
        'Dummy Stands Still': 'Dummy still stehen',
        'Death': 'Tot',
        'Super Tankbuster': 'Super Tankbuster',
        'Pentacle Sac': 'Pentacle Sac',
        'Engage': 'Start!',
      },
    },
    {
      locale: 'fr',
      replaceSync: {
        'cactbot lang': 'cactbot langue',
        'cactbot test response': 'cactbot test de réponse',
        'cactbot test watch': 'cactbot test d\'observation',
        'You bid farewell to the striking dummy': 'Vous faites vos adieux au mannequin d\'entraînement',
        'You bow courteously to the striking dummy': 'Vous vous inclinez devant le mannequin d\'entraînement',
        'You burst out laughing at the striking dummy': 'Vous vous esclaffez devant le mannequin d\'entraînement',
        'You clap for the striking dummy': 'Vous applaudissez le mannequin d\'entraînement',
        'You poke the striking dummy': 'Vous touchez légèrement le mannequin d\'entraînement du doigt',
        'You psych yourself up alongside the striking dummy': 'Vous vous motivez devant le mannequin d\'entraînement',
        'test sync': 'test sync',
      },
      replaceText: {
        'Almagest': 'Almageste',
        'Angry Dummy': 'Mannequin en colère',
        'Death': 'Mort',
        'Death To': 'Mort sur',
        'Dummy Stands Still': 'Mannequin immobile',
        'Engage': 'À l\'attaque',
        'Final Sting': 'Dard final',
        'Long Castbar': 'Longue barre de lancement',
        'Pentacle Sac': 'Pentacle Sac',
        'Super Tankbuster': 'Super Tank buster',
      },
    },
    {
      locale: 'ja',
      replaceSync: {
        'You bid farewell to the striking dummy': '.*は木人に別れの挨拶をした',
        'You bow courteously to the striking dummy': '.*は木人にお辞儀した',
        'test sync': 'test sync',
        'You burst out laughing at the striking dummy': '.*は木人のことを大笑いした',
        'cactbot lang': 'cactbot言語',
        'cactbot test response': 'cactbotレスポンステスト',
        'cactbot test watch': 'cactbot探知テスト',
        'You clap for the striking dummy': '.*は木人に拍手した',
        'You psych yourself up alongside the striking dummy': '.*は木人に活を入れた',
        'You poke the striking dummy': '.*は木人をつついた',
      },
      replaceText: {
        'Almagest': 'アルマゲスト',
        'Angry Dummy': '怒る木人',
        'Death': '死',
        'Death To': '死の宣告',
        'Dummy Stands Still': '木人はじっとしている',
        'Engage': '戦闘開始',
        'Final Sting': 'ファイナルスピア',
        'Long Castbar': '長い長い詠唱バー',
        'Pentacle Sac': 'ナイサイ',
        'Super Tankbuster': 'スーパータンクバスター',
      },
    },
    {
      locale: 'cn',
      replaceSync: {
        'You bid farewell to the striking dummy': '.*向木人告别',
        'You bow courteously to the striking dummy': '.*恭敬地对木人行礼',
        'test sync': 'test sync',
        'You burst out laughing at the striking dummy': '.*看着木人高声大笑',
        'cactbot lang': 'cactbot语言',
        'cactbot test response': 'cactbot响应测试',
        'cactbot test watch': 'cactbot探测测试',
        'You clap for the striking dummy': '.*向木人送上掌声',
        'You psych yourself up alongside the striking dummy': '.*激励木人',
        'You poke the striking dummy': '.*用手指戳向木人',
      },
      replaceText: {
        'Final Sting': '终极针',
        'Almagest': '至高无上',
        'Angry Dummy': '愤怒的木人',
        'Long Castbar': '长时间咏唱',
        'Dummy Stands Still': '木人8动了',
        'Super Tankbuster': '超级无敌转圈死刑',
        'Death To': '嗝屁攻击：',
        'Death': '嗝屁',
        'Engage': '战斗开始',
        'Pentacle Sac': '传毒',
      },
    },
    {
      locale: 'ko',
      replaceSync: {
        'You bid farewell to the striking dummy': '.*나무인형에게 작별 인사를 합니다',
        'You bow courteously to the striking dummy': '.*나무인형에게 공손하게 인사합니다',
        'test sync': '테스트 싱크',
        'You burst out laughing at the striking dummy': '.*나무인형을 보고 폭소를 터뜨립니다',
        'cactbot lang': 'cactbot 언어',
        'cactbot test response': 'cactbot 응답 테스트',
        'cactbot test watch': 'cactbot 탐지 테스트',
        'You clap for the striking dummy': '.*나무인형에게 박수를 보냅니다',
        'You psych yourself up alongside the striking dummy': '.*나무인형에게 힘을 불어넣습니다',
        'You poke the striking dummy': '.*나무인형을 쿡쿡 찌릅니다',
      },
      replaceText: {
        'Final Sting': '마지막 벌침',
        'Almagest': '알마게스트',
        'Angry Dummy': '화난 나무인형',
        'Long Castbar': '긴 시전바',
        'Dummy Stands Still': '나무인형이 아직 살아있다',
        'Death': '데스',
        'Super Tankbuster': '초강력 탱크버스터',
        'Pentacle Sac': 'Pentacle Sac',
        'Engage': '시작',
      },
    },
  ],
};

export default triggerSet;
