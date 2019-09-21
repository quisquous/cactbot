'use strict';

[{
  zoneRegex: /^The Bowl Of Embers$/,
  timelineFile: 'ifrit_nm.txt',
  timelineTriggers: [
    {
      id: 'IfritNM Inner',
      regex: /Radiant Plume \(inner\)/,
      beforeSeconds: 3.5,
      infoText: {
        en: 'Get Out',
      },
    },
    {
      id: 'IfritNM Outer',
      regex: /Radiant Plume \(outer\)/,
      beforeSeconds: 3.5,
      infoText: {
        en: 'Get In',
      },
    },
    {
      id: 'IfritNM Nail Add',
      regex: /Nail Add/,
      beforeSeconds: 0.5,
      infoText: {
        en: 'Kill Nail',
      },
    },
  ],
  triggers: [
  ],
}];
