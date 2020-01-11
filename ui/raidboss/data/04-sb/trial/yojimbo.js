'use strict';

[{
  zoneRegex: /^Kugane Ohashi$/,
  timelineFile: 'yojimbo.txt',
  triggers: [
    {
      id: 'Yojimbo Giga Jump',
      regex: Regexes.headMarker({ id: '0057' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      alertText: {
        en: 'Run Marker Away',
        de: 'Mit Marker weglaufen',
      },
    },
    {
      id: 'Yojimbo Dorito',
      regex: Regexes.headMarker({ id: '0037' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      alertText: {
        en: 'Dorito Stack',
        de: 'Stacken',
        fr: 'Packez-vous',
      },
    },
    {
      id: 'Yojimbo Gekko',
      regex: Regexes.headMarker({ id: '0090' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      infoText: {
        en: 'Gekko Marker',
        de: 'Gekko Marker',
      },
    },
    {
      id: 'Yojimbo Enchain',
      regex: Regexes.headMarker({ id: '0005' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      alarmText: {
        en: 'GTFO',
        de: 'WEG!',
      },
    },
  ],
}];
