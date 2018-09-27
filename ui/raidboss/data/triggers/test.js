'use strict';

[{
  zoneRegex: /^Middle La Noscea$/,
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
      let shortName = data.me.substring(0, data.me.indexOf(' '));
      return [
        '40 "Death To ' + shortName + '!!"',
        'hideall "Death"',
      ];
    },
  ],
  timelineTriggers: [
    {
      id: 'Test Angry Dummy',
      regex: /(Angry Dummy)/,
      beforeSeconds: 2,
      infoText: function(data, matches) {
        return {
          en: 'Stack for ' + matches[1],
        };
      },
      tts: {
        en: 'Stack',
      },
    },
  ],
  timelineReplace: [
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
  ],
  triggers: [
    {
      id: 'Test Poke',
      regex: /:You poke the striking dummy/,
      regexFr: /:Vous touchez légèrement le mannequin d'entraînement du doigt/,
      preRun: function(data) {
        data.pokes = (data.pokes || 0) + 1;
      },
      infoText: function(data) {
        return {
          en: 'poke #' + data.pokes,
          fr: 'Touché #' + data.pokes,
        };
      },
    },
    {
      id: 'Test Psych',
      regex: /:You psych yourself up alongside the striking dummy/,
      regexFr: /:Vous vous motivez devant le mannequin d'entraînement/,
      alertText: function(data) {
        return {
          en: 'PSYCH!!!',
          fr: 'MOTIVATION !!!',
        };
      },
      tts: {
        en: 'psych',
        fr: 'Motivation',
      },
    },
    {
      id: 'Test Laugh',
      regex: /:You burst out laughing at the striking dummy/,
      regexFr: /:Vous vous esclaffez devant le mannequin d'entraînement/,
      suppressSeconds: 5,
      alarmText: function(data) {
        return {
          en: 'hahahahaha',
          fr: 'Mouahahaha',
        };
      },
      tts: {
        en: 'hahahahaha',
        fr: 'Haha mort de rire',
      },
    },
    {
      id: 'Test Clap',
      regex: /:You clap for the striking dummy/,
      regexFr: /:Vous applaudissez le mannequin d'entraînement/,
      sound: '../../resources/sounds/WeakAuras/Applause.ogg',
      soundVolume: 0.3,
      tts: {
        en: 'clapity clap',
        fr: 'Bravo, vive la France',
      },
    },
    {
      id: 'Test Lang',
      // In game: /echo cactbot lang
      regex: /00:0038:cactbot lang/,
      infoText: function(data) {
        return {
          en: 'Language: ' + data.lang,
        };
      },
    },
  ],
}];
