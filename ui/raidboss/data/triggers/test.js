[{
  zoneRegex: /^Middle La Noscea$/,
  timelineFile: 'test.txt',
  timeline: [
    'infotext "Angry Dummy" before 2 "stack for angry dummy"',
    'alerttext "Final Sting" before 4 "oh no final sting in 4"',
    'alarmtext "Death" before 3',
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
  triggers: [
    {
      id: 'Test Poke',
      regex: /:You poke the striking dummy/,
      infoText: function(data) {
        data.pokes = (data.pokes || 0) + 1;
        return 'poke #' + data.pokes;
      },
      tts: function(data) {
        return 'poke ' + data.pokes;
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
      regex: /:You burst out laughing at the striking dummy/,
      alarmText: function(data) {
        return 'hahahahaha';
      },
      tts: 'hahahahaha',
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
