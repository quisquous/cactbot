'use strict';

[{
  zoneRegex: /^The Epic [Oo]f Alexander \(Ultimate\)$/,
  timelineFile: 'the_epic_of_alexander.txt',
  timelineTriggers: [
    {
      // TODO: maybe figure out who is tanking which and call out Fluid Strike vs Fluid Swing
      id: 'TEA Fluid Swing',
      regex: /Fluid Swing/,
      beforeSeconds: 5,
      alertText: function(data) {
        if (data.role == 'healer' || data.role == 'tank') {
          return {
            en: 'Tank Busters',
            de: 'Tank buster',
            fr: 'Tank busters',
          };
        }
      },
      infoText: function(data) {
        if (data.role != 'healer' && data.role != 'tank') {
          return {
            en: 'Tank Cleave',
          };
        }
      },
    },
  ],
  triggers: [
    {
      id: 'TEA Cascade',
      regex: Regexes.startsUsing({ source: 'Living Liquid', id: '4826', capture: false }),
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank' || data.CanAddle();
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'TEA Protean Wave',
      regex: Regexes.startsUsing({ source: 'Living Liquid', id: '4822', capture: false }),
      infoText: {
        en: 'Protean Wave',
      },
    },
    {
      id: 'TEA Drainage Tether',
      regex: Regexes.tether({ source: 'Liquid Rage', id: '0003' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      // Even if folks have the right tethers, this happens repeatedly.
      suppressSeconds: 5,
      alertText: {
        en: 'Drainage tether on YOU',
      },
    },
    {
      id: 'TEA Hand of Pain 5',
      regex: Regexes.startsUsing({ source: 'Living Liquid', id: '482D', capture: false }),
      preRun: function(data) {
        data.handOfPainCount = (data.handOfPainCount || 0) + 1;
      },
      infoText: function(data) {
        if (data.handOfPainCount < 5)
          return;
        return {
          en: 'Focus Living Liquid',
        };
      },
    },
  ],
}];
