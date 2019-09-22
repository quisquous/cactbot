'use strict';

[{
  zoneRegex: /^The Navel \(Extreme\)$/,
  timelineFile: 'titan_ex.txt',
  timelineTriggers: [
    {
      id: 'TitanEx Mountain Buster',
      regex: /Mountain Buster/,
      beforeSeconds: 7,
      alertText: function(data, matches) {
        if (data.role == 'healer' || data.role == 'tank') {
          return {
            en: 'Tankbuster',
            de: 'Tankbuster',
            fr: 'Tankbuster',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.role != 'healer' && data.role != 'tank') {
          return {
            en: 'Tank Cleave',
          };
        }
      },
    },
    {
      id: 'TitanEx Tumult',
      regex: /Tumult/,
      beforeSeconds: 5,
      condition: function(data, matches) {
        return data.role == 'healer' || data.role == 'tank' || data.CanAddle();
      },
      infoText: {
        en: 'aoe',
      },
    },
    {
      id: 'TitanEx Gaoler Adds',
      regex: /Gaoler Adds/,
      beforeSeconds: 1,
      infoText: {
        en: 'Gaoler Adds',
      },
    },
    {
      id: 'TitanEx Double Weight',
      regex: /Weight Of The Land 1/,
      beforeSeconds: 4,
      infoText: {
        en: 'Double Weight',
      },
    },
  ],
  triggers: [
  ],
}];
