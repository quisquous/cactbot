[{
  zoneRegex: /^Middle La Noscea$/,
  timelineFile: 'test.txt',
  timeline: [
    'infotext "Angry Dummy" before 2 "stack for angry dummy"',
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
      else
        return 'alarmtext "Almagest" before 0';
    },
    function(data) {
      // <_<
      var shortName = data.me.substring(0, data.me.indexOf(' '));
      return [
        '40 "Death To ' + shortName + '!!"',
        'hideall "Death"',
      ];
    },
  ],
  timelineReplace: [
    {
      locale: 'fr',
      replaceText: {
        'Final Sting': 'Piq&ucirc;re Final',
      },
      replaceSync: {
        'You bid farewell to the striking dummy': 'cactbot wipe',
      },
    }
  ],
  triggers: [
    {
      id: 'Test Poke',
      regex: /:You poke the striking dummy/,
      regexFr: /:You poke the striking dummy, in French/,
      preRun: function(data) {
        data.pokes = (data.pokes || 0) + 1;
      },
      infoText: function(data) {
        return {
          en: 'poke #' + data.pokes,
          fr: 'french poke #' + data.pokes,
        };
      },
      tts: function(data) {
        return {
          en: 'poke ' + data.pokes,
          fr: 'french poke ' + data.pokes,
        };
      },
    },
    {
      id: 'Test Psych',
      regex: /:You psych yourself up alongside the striking dummy/,
      alertText: function(data) {
        return 'PSYCH!!!';
      },
      tts: 'psych',
    },
    {
      id: 'Test Laugh',
      regexEn: /:You burst out laughing at the striking dummy/,
      regexFr: /:You burst out laughing, in French/,
      alarmText: function(data) {
        return {
          en: 'hahahahaha',
          fr: 'hahaha in french',
        };
      },
      tts: {
        en: 'hahahahaha',
        fr: 'hahaha in french',
      },
    },
    {
      id: 'Test Clap',
      regex: /:You clap for the striking dummy/,
      sound: '../../resources/sounds/WeakAuras/Applause.ogg',
      soundVolume: 0.3,
      tts: 'clapity clap',
    },
  ],
}]
