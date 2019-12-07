'use strict';

[{
  zoneRegex: /^(Middle La Noscea|中拉诺西亚)$/,
  timelineFile: 'test.txt',
  // timeline here is additions to the timeline.  They can
  // be strings, or arrays of strings, or functions that
  // take the same data object (including role and lang)
  // that triggers do.
  timeline: [
    'alerttext "Final Sting" before 4 "oh no final sting in 4"',
    'alarmtext "Death" before 3',
    'alertall "Long Castbar" before 1 speak "voice" "long"',
    function(data) {
      if (data.role != 'tank' && data.role != 'healer')
        return 'hideall "Super Tankbuster"';
    },
    function(data) {
      if (!data.role.startsWith('dps'))
        return 'hideall "Pentacle Sac (DPS)"';
    },
    function(data) {
      if (data.role != 'healer')
        return 'hideall "Almagest"';
      return 'alarmtext "Almagest" before 0';
    },
    function(data) {
      // <_<
      let shortName = data.me.indexOf(' ') >= 0 ? data.me.substring(0, data.me.indexOf(' ')) : data.me;
      return [
        '40 "Death To ' + shortName + '!!"',
        'hideall "Death"',
      ];
    },
  ],
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
      regex: /(Angry Dummy)/,
      regexDe: /(Wütender Dummy)/,
      regexCn: /愤怒的木人/,
      beforeSeconds: 2,
      infoText: function(data, matches) {
        return {
          en: 'Stack for ' + matches[1],
          de: 'Sammeln für ' + matches[1],
          cn: '木人处集合',
        };
      },
      tts: {
        en: 'Stack',
        de: 'Sammeln',
        cn: '集合',
      },
    },
  ],
  timelineReplace: [
    {
      locale: 'de',
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
      replaceSync: {
        'You bid farewell to the striking dummy': 'Du winkst der Trainingspuppe zum Abschied zu',
        'You bow courteously to the striking dummy': 'Du verbeugst dich hochachtungsvoll vor der Trainingspuppe',
        'test sync': 'test sync',
        'Engage!': 'Start!',
      },
    },
    {
      locale: 'fr',
      replaceText: {
        'Final Sting': 'Dard final',
        'Almagest': 'Almageste',
        'Angry Dummy': 'Mannequin en colère',
        'Long Castbar': 'Longue barre de lancement',
        'Dummy Stands Still': 'Mannequin immobile',
        'Death': 'Mort',
      },
      replaceSync: {
        'You bid farewell to the striking dummy': 'Vous faites vos adieux au mannequin d\'entraînement',
        'You bow courteously to the striking dummy': 'Vous vous inclinez devant le mannequin d\'entraînement',
        'Engage!': 'À l\'attaque',
      },
    },
    {
      locale: 'cn',
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
      },
      replaceSync: {
        'You bid farewell to the striking dummy': '.*向木人告别',
        'You bow courteously to the striking dummy': '.*恭敬地对木人行礼',
        'Engage!': '战斗开始！',
      },
    },
  ],
  triggers: [
    {
      id: 'Test Poke',
      regex: /:You poke the striking dummy/,
      regexDe: /:Du stupst die Trainingspuppe an/,
      regexFr: /:Vous touchez légèrement le mannequin d'entraînement du doigt/,
      regexCn: /:.*用手指戳向木人/,
      preRun: function(data) {
        data.pokes = (data.pokes || 0) + 1;
      },
      infoText: function(data) {
        return {
          en: 'poke #' + data.pokes,
          de: 'stups #' + data.pokes,
          fr: 'Touché #' + data.pokes,
          cn: '戳 #' + data.pokes,
        };
      },
    },
    {
      id: 'Test Psych',
      regex: /:You psych yourself up alongside the striking dummy/,
      regexDe: /:Du willst wahren Kampfgeist in der Trainingspuppe entfachen/,
      regexFr: /:Vous vous motivez devant le mannequin d'entraînement/,
      regexCn: /:.*激励木人/,
      alertText: {
        en: 'PSYCH!!!',
        de: 'AUF GEHTS!!!',
        fr: 'MOTIVATION !!!',
        cn: '激励！！',
      },
      tts: {
        en: 'psych',
        de: 'auf gehts',
        fr: 'Motivation',
        cn: '激励',
      },
      groupTTS: {
        en: 'group psych',
        de: 'Gruppen auf gehts',
        fr: 'group motivation',
        cn: '组激励',
      },
    },
    {
      id: 'Test Laugh',
      regex: /:You burst out laughing at the striking dummy/,
      regexDe: /:Du lachst herzlich mit der Trainingspuppe/,
      regexFr: /:Vous vous esclaffez devant le mannequin d'entraînement/,
      regexCn: /:.*看着木人高声大笑/,
      suppressSeconds: 5,
      alarmText: {
        en: 'hahahahaha',
        de: 'hahahahaha',
        fr: 'Mouahahaha',
        cn: '2333333333',
      },
      tts: {
        en: 'hahahahaha',
        de: 'hahahahaha',
        fr: 'Haha mort de rire',
        cn: '哈哈哈哈哈哈',
      },
      groupTTS: {
        en: 'group laugh',
        de: 'Gruppenlache',
        fr: 'group motivation',
        cn: '组哈哈',
      },
    },
    {
      id: 'Test Clap',
      regex: /:You clap for the striking dummy/,
      regexDe: /:Du klatschst begeistert Beifall für die Trainingspuppe/,
      regexFr: /:Vous applaudissez le mannequin d'entraînement/,
      regexCn: /:.*向木人送上掌声/,
      sound: '../../resources/sounds/WeakAuras/Applause.ogg',
      soundVolume: 0.3,
      tts: {
        en: 'clapity clap',
        de: 'klatschen',
        fr: 'Bravo, vive la France',
        cn: '鼓掌',
      },
    },
    {
      id: 'Test Lang',
      // In game: /echo cactbot lang
      regex: / 00:0038:cactbot lang/,
      regexDe: / 00:0038:cactbot sprache/,
      infoText: function(data) {
        return {
          en: 'Language: ' + data.lang,
          de: 'Sprache: ' + data.lang,
          cn: '语言: ' + data.lang,
        };
      },
    },
    {
      id: 'Test Response',
      regex: Regexes.echo({ line: 'cactbot test response', capture: false }),
      response: function(data) {
        return {
          alarmText: '1',
          alertText: '2',
          infoText: '3',
          tts: '4',
        };
      },
    },
  ],
}];
