'use strict';

[{
  zoneRegex: /Kugane Ohashi/,
  timelineFile: 'yojimbo.txt',
  triggers: [
    {
      id: 'Yojimbo Giga Jump',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0057:/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      alertText: {
        en: 'Run Marker Away',
        de: 'Mit Marker weglaufen',
      },
    },
    {
      id: 'Yojimbo Dorito',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0037:/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      alertText: {
        en: 'Dorito Stack',
        de: 'Stacken',
        fr: 'Packez-vous',
      },
    },
    {
      id: 'Yojimbo Gekko',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0090:/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      infoText: {
        en: 'Gekko Marker',
        de: 'Gekko Marker',
      },
    },
    {
      id: 'Yojimbo Enchain',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0005:/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      alarmText: {
        en: 'GTFO',
        de: 'WEG!',
      },
    },
  ],
}];
