[{
  zoneRegex: /^Middle La Noscea$/,
  triggers: [
    {
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
      regex: /:You psych yourself up alongside the striking dummy/,
      alertText: function(data) {
        return 'PSYCH!!!';
      },
      tts: 'psych',
    },
    {
      regex: /:You burst out laughing at the striking dummy/,
      alarmText: function(data) {
        return 'hahahahaha';
      },
      tts: 'hahahahaha',
    },
  ],
}]
