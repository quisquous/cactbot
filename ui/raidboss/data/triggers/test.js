[{
  zoneRegex: /^Middle La Noscea$/,
  timelineFile: 'test.txt',
  timeline: `
    infotext "Angry Dummy" before 2 "stack for angry dummy"
    alerttext "Final Sting" before 4 "oh no final sting in 4"
    alarmtext "Death" before 3
  `,
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
