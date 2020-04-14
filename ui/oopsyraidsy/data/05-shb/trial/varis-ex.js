'use strict';

[{
  zoneRegex: {
    en: /^Memoria Misera \(Extreme\)$/,
  },
  damageWarn: {
    'VarisEx Alea Iacta Est 1': '4CD2',
    'VarisEx Alea Iacta Est 2': '4CD3',
    'VarisEx Alea Iacta Est 3': '4CD4',
    'VarisEx Alea Iacta Est 4': '4CD5',
    'VarisEx Alea Iacta Est 5': '4CD6',
    'VarisEx Ignis Est 1': '4CB5',
    'VarisEx Ignis Est 2': '4CC5',
    'VarisEx Ventus Est 1': '4CC7',
    'VarisEx Ventus Est 2': '4CC8',
    'VarisEx Assault Cannon': '4CE5',
    'VarisEx Fortius Rotating': '4CE9',
  },
  damageFail: {
    // Don't hit the shields!
    'VarisEx Repay': '4CDD',
  },
  triggers: [
    {
      id: 'VarisEx Terminus Est',
      damageRegex: '4CB4',
      // TODO: actually implement suppressSeconds.
      suppressSeconds: 1,
      mistake: function(e, data) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'VarisEx Magitek Burst',
      damageRegex: '4CDF',
      condition: function(e, data) {
        // Double taps only.
        return e.type != '15';
      },
      mistake: function(e, data) {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'VarisEx Aetherochemical Grenado',
      damageRegex: '4CED',
      condition: function(e, data) {
        // Double taps only.
        return e.type != '15';
      },
      mistake: function(e, data) {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      // This is the "protean" fortius.
      id: 'VarisEx Fortius Protean',
      damageRegex: '4CE7',
      condition: function(e, data) {
        // Double taps only.
        return e.type != '15';
      },
      mistake: function(e, data) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
  ],
}];
