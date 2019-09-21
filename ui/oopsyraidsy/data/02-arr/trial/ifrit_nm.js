'use strict';

// Ifrit Story Mode
[{
  zoneRegex: /^The Bowl Of Embers$/,
  damageWarn: {
    'Ifrit NM Radiant Plume': '2DE',
  },
  triggers: [
    // Things that should only hit one person.
    {
      id: 'IfritNM Incinerate',
      damageRegex: '1C5',
      condition: function(e, data) {
        return e.type != '15';
      },
      mistake: function(e, data) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'IfritNM Eruption',
      damageRegex: '2DD',
      condition: function(e, data) {
        return e.type != '15';
      },
      mistake: function(e, data) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
  ],
}];
