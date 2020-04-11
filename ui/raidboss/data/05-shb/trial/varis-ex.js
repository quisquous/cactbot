'use strict';
[{
  zoneRegex: {
    en: /^Memoria Misera \(Extreme\)$/,
  },
  timelineFile: 'varis-ex.txt',
  triggers: [
    {
      id: 'VarisEx Phase 2',
      regex: Regexes.startsUsing({ source: 'Varis Yae Galvus', id: '4CCC', capture: false }),
      run: function(data) {
        data.phase = 'phase2';
      },
    },
    {
      id: 'VarisEx Clones',
      regex: Regexes.ability({ source: 'Phantom Varis', id: '4CB3', capture: false }),
      run: function(data) {
        data.clones = 'active';
      },
    },
    {
      id: 'VarisEx Ignis Est',
      regex: Regexes.startsUsing({ source: 'Ignis Est', id: '4CB6', capture: false }),
      delaySeconds: 2,
      response: Responses.getOut(),
    },
    {
      id: 'VarisEx Ventus Est',
      regex: Regexes.startsUsing({ source: 'Ventus Est', id: '4CC7', capture: false }),
      delaySeconds: 2,
      response: Responses.getIn('info'),
    },
    {
      id: 'VarisEx Altius',
      regex: Regexes.startsUsing({ source: 'Varis Yae Galvus', id: '4CCA', capture: false }),
      infoText: {
        en: 'Bait Slashes',
      },
    },
    {
      id: 'VarisEx Citius',
      regex: Regexes.startsUsing({ source: 'Varis Yae Galvus', id: '4CF0' }),
      alertText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Buster on YOU',
          };
        }
        if (data.role == 'dps') {
          return {
            en: 'Avoid Tanks',
          };
        }
        return {
          en: 'Buster on ' + data.ShortName(matches.target),
        };
      },
    },
    {
      id: 'VarisEx Alea Iacta Est',
      regex: Regexes.startsUsing({ source: 'Varis Yae Galvus', id: '4CD2', capture: false }),
      response: Responses.getBehind('alert'),
    },
    {
      id: 'VarisEx Alea Iacta Est Front',
      regex: Regexes.ability({ source: 'Varis Yae Galvus', id: '4CD5', capture: false }),
      infoText: {
        en: 'Go Front',
      },
    },
    {
      id: 'VarisEx Electrified Gunshield',
      regex: Regexes.ability({ source: 'Varis Yae Galvus', id: '4CD7', capture: false }),
      delaySeconds: 21,
      response: Responses.knockback(),
    },
    {
      id: 'VarisEx Reinforced Gunshield',
      regex: Regexes.ability({ source: 'Varis Yae Galvus', id: '4CD9', capture: false }),
      delaySeconds: function(data) {
        if (data.phase == 'phase2')
          return 20;
        return 10;
      },
      alertText: {
        en: 'Stop attacking',
      },
    },
    {
      id: 'VarisEx Loaded Gunshield',
      regex: Regexes.ability({ source: 'Varis Yae Galvus', id: '4CD8', capture: false }),
      delaySeconds: 10,
      infoText: {
        en: 'Spread soon',
      },
    },
    {
      id: 'VarisEx Reinforcements',
      regex: Regexes.ability({ source: 'Varis Yae Galvus', id: '4CEA', capture: false }),
      infoText: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'Grab Tethers',
          };
        }
        return {
          en: 'Kill Adds',
        };
      },
    },
    {
      id: 'VarisEx Terminus Est Clones',
      regex: Regexes.startsUsing({ source: 'Terminus Est', id: '4CB4', capture: false }),
      condition: (data) => data.clones == 'active',
      infoText: {
        en: 'Dodge Clones',
      },
      run: function(data) {
        delete data.clones;
      },
    },
    {
      id: 'VarisEx Magitek Spark',
      regex: Regexes.startsUsing({ source: 'Gunshield', id: '4E50', capture: false }),
      response: Responses.spread(),
    },
    {
      id: 'VarisEx Magitek Torch',
      regex: Regexes.startsUsing({ source: 'Gunshield', id: '4E4F', capture: false }),
      response: Responses.stack(),
    },
    {
      id: 'VarisEx Fortius',
      regex: Regexes.startsUsing({ source: 'Varis Yae Galvus', id: '4CE[56]', capture: false }),
      infoText: {
        en: 'Bait Puddles Out',
      },
    },
  ],
  timelineReplace: [
  ],
}];
